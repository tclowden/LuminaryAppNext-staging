import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Call, Device } from '@twilio/voice-sdk';
import { getObjectProp } from '@/utilities/helpers';
import { publishToChannels } from './ably';

/***
 * @param ___DEVICE____ is the socket that twilio creates to makes the calls
 * @param __CALL__ is the active connection that we can use to monitor events
 */
let __DEVICE__: Device;
let __CALL__: Call;

const FIVE_MINUTES: number = 300000;

/***
 * @type TwilioCallStatus
 * "closed"	      The media session associated with the call has been disconnected.
 * "connecting"   The call was accepted by or initiated by the local Device instance and the media session is being set up.
 * "open"	      The media session associated with the call has been established.
 * "pending"	   The call is incoming and hasn't yet been accepted.
 * "reconnecting"	The ICE connection was disconnected and a reconnection has been triggered.
 * "ringing"	   The callee has been notified of the call but has not yet responded.
 * */

export type InboundCall = {
   from: string;
   callSid: string;
   callStartTime: string | Date;
   leadId?: string;
   leadName?: string;
   notifiedChannels: Array<string>;
};

export type TwilioCallStatus = 'closed' | 'connecting' | 'open' | 'pending' | 'reconnecting' | 'ringing';

export interface ActiveCall {
   userId?: string | null;
   lead: any | null;
   userOnCall?: boolean;
   isMuted?: boolean;
   isOnHold?: boolean;
   currentCallSid?: string | null;
   fromNumber?: string;
   toNumber?: string;
   inboundCallerId?: string | null;
   incomingCall?: boolean;
   isCallBarShowing?: boolean;
   callBarStatus?: 'connecting' | 'connected' | null;
   twilioCallStatus?: TwilioCallStatus;
   twilioCallEventStatus?: any;
   inboundCalls: Array<InboundCall>;
   callJustEnded: boolean;
   isMakingTransfer: boolean;
   transferNumber: string;
   conferenceId: string;
}

const activeCall: ActiveCall = {
   userId: null,
   lead: null,
   isMuted: false,
   isOnHold: false,
   currentCallSid: null,
   fromNumber: '',
   toNumber: '',
   inboundCallerId: null,
   incomingCall: false,
   userOnCall: false,
   isCallBarShowing: false,
   callBarStatus: null,
   twilioCallStatus: 'closed',
   inboundCalls: [],
   callJustEnded: false,
   isMakingTransfer: false,
   transferNumber: '',
   conferenceId: '',
};

// gets the userId from redux, resets token every 2 minutes
export const initDevice = createAsyncThunk('initDevice', async (arg, { getState, dispatch }) => {
   console.log('Twilio Init Device');
   let { user } = getState() as RootState;

   // return if user is not authed
   if (!user?.token) return;

   const token: any = await dispatch(getAccessTokenV2());

   // create the twilio device
   // __DEVICE__ = new Device(token.payload, {
   __DEVICE__ = new Device(token.payload, {
      closeProtection: true,
      disableAudioContextSounds: false,
   });

   // removes warning for having lots of listeners
   // __DEVICE__.removeAllListeners();
   __DEVICE__.setMaxListeners(20);

   // this sets the Device ready for incoming calls
   __DEVICE__.register();

   // Catch errors on twilio device
   __DEVICE__.on('error', (twilioError, call) => {
      console.log('Twilio Error:', twilioError);
   });

   // successful registration will emit the registered event, from there we keep the access token fresh
   __DEVICE__.on('registered', async () => {
      console.log('...registered');
      const token = user?.token as any;
      await dispatch(keepTokenUpdated());
   });

   // someone calls us
   __DEVICE__.on('incoming', async (call: Call) => {
      console.log('INCOMING');
      __CALL__ = call;

      dispatch(answerCall(call.parameters));

      await __CALL__.on('disconnect', async () => {
         console.log('...Inbound call disconnected');
         await __CALL__.disconnect();
         dispatch(showCallBar(false));
         dispatch(setCallBarStatus(null));
      });
   });
});

export const getAccessToken = async (userToken: string) => {
   // get token from server
   return await fetch(`/api/v2/twilio/capability-token`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
      cache: 'no-store',
   })
      .then(async (response) => await response.json())
      .then((data) => data.token)
      .catch((err) => {
         console.error('Unable to fetch twilio access token: ', err);
      });
};

export const getAccessTokenV2 = createAsyncThunk('getAccessTokenV2', async (_, { dispatch, getState }) => {
   let { user } = getState() as RootState;

   return await fetch(`/api/v2/twilio/capability-token/${user.id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      cache: 'no-store',
   })
      .then(async (response) => await response.json())
      .then((data) => {
         return data.token;
      })
      .catch((err) => {
         console.error('Unable to fetch twilio access token: ', err);
      });
});

export const callIntoQueue = createAsyncThunk('callIntoQueue', async (queueName: string, { dispatch, getState }) => {
   try {
      // Grabbing the root state for these slices
      let { user, twilio } = getState() as RootState;

      // grab users number, TODO: round robin numbers
      const userNumber = getObjectProp(user, ['phoneNumbers', 0, 'phoneNumber', 'prettyNumber']);

      // This starts calling
      let call: Call = await __DEVICE__.connect({
         params: {
            To: 'inbound-call-queue',
            From: userNumber,
            CallerId: userNumber,
         },
      });

      // All the events emitted by the call object
      call.on('accept', (acceptedCall) => {
         console.log(
            "The call has been accepted or the outgoing call's media session has finished setting up.",
            acceptedCall.parameters
         );
         __CALL__ = acceptedCall;
         dispatch(
            setActiveCallState({
               ...twilio,
               userId: user.id,
               currentCallSid: acceptedCall?.parameters?.CallSid,
               fromNumber: userNumber,
               toNumber: '+14804146685',
               twilioCallEventStatus: 'accept',
               twilioCallStatus: call.status(),
            })
         );
         dispatch(showCallBar(true));
      });

      call.on('disconnect', () => {
         console.log('The call has ended.');
         call.disconnect();

         // dispatch(showCallBar(false));
         dispatch(
            setActiveCallState({
               ...twilio,
               twilioCallEventStatus: 'disconnect',
               twilioCallStatus: call.status(),
               isCallBarShowing: false,
               callBarStatus: null,
            })
         );
      });

      call.on('ringing', () => {
         console.log('The outgoing call has started ringing.');

         dispatch(
            setActiveCallState({
               ...twilio,
               twilioCallEventStatus: 'ringing',
               twilioCallStatus: call.status(),
            })
         );
      });

      call.on('cancel', () => {
         console.log('The outgoing call was cancelled by the caller before it was answered.');

         dispatch(
            setActiveCallState({
               ...twilio,
               twilioCallEventStatus: 'cancel',
               twilioCallStatus: call.status(),
            })
         );
      });

      call.on('reject', () => {
         console.log('The call was rejected by the callee.');

         dispatch(
            setActiveCallState({
               ...twilio,
               twilioCallEventStatus: 'reject',
               twilioCallStatus: call.status(),
            })
         );
      });

      call.on('busy', () => {
         console.log("The callee's line was busy.");

         dispatch(
            setActiveCallState({
               ...twilio,
               twilioCallEventStatus: 'busy',
               twilioCallStatus: call.status(),
            })
         );
      });
   } catch (err) {
      console.log(err);
   }
});

export const makeOutboundCall = createAsyncThunk(
   'makeOutboundCall',
   async (toNumber: string, { dispatch, getState }) => {
      try {
         // Grabbing the root state for these slices
         let { user, twilio } = getState() as RootState;

         // grab users number, TODO: round robin numbers
         const userNumber = getObjectProp(user, ['phoneNumbers', 0, 'phoneNumber', 'number']);

         if (!__DEVICE__) {
            const token = await dispatch(getAccessTokenV2());

            // create the twilio device
            __DEVICE__ = new Device(token.payload, {
               closeProtection: true,
               disableAudioContextSounds: false,
            });

            // removes warning for having lots of listeners
            __DEVICE__.removeAllListeners();
            __DEVICE__.setMaxListeners(20);

            // this sets the Device ready for incoming calls
            __DEVICE__.register();
         }

         // This becomes the friendly name of conf
         const confUUID = crypto.randomUUID();
         // dispatch(setConferenceId(confUUID));
         // This starts calling
         let call: Call = await __DEVICE__.connect({
            params: {
               To: toNumber,
               From: userNumber,
               CallerId: userNumber,
               FriendlyName: confUUID,
            },
         });

         // All the events emitted by the call object
         call.on('accept', (acceptedCall) => {
            console.log(
               "The call has been accepted or the outgoing call's media session has finished setting up.",
               acceptedCall.parameters
            );

            __CALL__ = acceptedCall;
            // update with the accepted call status, and all info we have about the call
            dispatch(
               setActiveCallState({
                  ...twilio,
                  userId: user.id,
                  currentCallSid: acceptedCall?.parameters?.CallSid,
                  fromNumber: userNumber,
                  toNumber: toNumber,
                  twilioCallEventStatus: 'accept',
                  twilioCallStatus: call.status(),
                  conferenceId: confUUID,
               })
            );
            dispatch(showCallBar(true));
            dispatch(setCallBarStatus('connected'));
         });

         call.on('disconnect', () => {
            console.log('The call has ended.');
            call.disconnect();

            dispatch(
               setActiveCallState({
                  ...twilio,
                  twilioCallEventStatus: 'disconnect',
                  twilioCallStatus: call.status(),
               })
            );
         });

         call.on('ringing', () => {
            console.log('The outgoing call has started ringing.');

            dispatch(
               setActiveCallState({
                  ...twilio,
                  twilioCallEventStatus: 'ringing',
                  twilioCallStatus: call.status(),
                  isCallBarShowing: true,
                  callBarStatus: 'connecting',
                  conferenceId: confUUID,
                  toNumber: toNumber,
               })
            );
         });

         call.on('cancel', () => {
            console.log('The outgoing call was cancelled by the caller before it was answered.');

            dispatch(
               setActiveCallState({
                  ...twilio,
                  twilioCallEventStatus: 'cancel',
                  twilioCallStatus: call.status(),
               })
            );
         });

         call.on('reject', () => {
            console.log('The call was rejected by the callee.');

            dispatch(
               setActiveCallState({
                  ...twilio,
                  twilioCallEventStatus: 'reject',
                  twilioCallStatus: call.status(),
               })
            );
         });

         call.on('busy', () => {
            console.log("The callee's line was busy.");

            dispatch(
               setActiveCallState({
                  ...twilio,
                  twilioCallEventStatus: 'busy',
                  twilioCallStatus: call.status(),
               })
            );
         });
      } catch (err) {
         console.log('makeOutboundCall:', err);
      }
   }
);

// Connect User to incoming call that is currently in Queue. Communicates with ably publish events
export const connectQueueCall = createAsyncThunk(
   'connectQueueCall',
   async (
      {
         callSid,
         notifiedChannels,
         lead,
      }: {
         callSid: string;
         notifiedChannels: Array<string>;
         lead?: { id?: string; firstName?: string; lastName?: string };
      },
      { getState, dispatch }
   ) => {
      let { user, twilio } = getState() as RootState;

      dispatch(
         publishToChannels({ channelsToNotify: notifiedChannels, eventName: 'call-answered', eventData: { callSid } })
      );
      dispatch(
         setActiveCallState({
            ...twilio,
            lead,
            isCallBarShowing: true,
            callBarStatus: 'connecting',
         })
      );
      showCallBar(true);
      await fetch(`/api/v2/twilio/accept-call`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
         body: JSON.stringify({
            userId: user?.id,
            callSid,
            notifiedChannels,
         }),
      });
   }
);

// This will return a verified phone number, which gets passed to makeOutboundCall
export const twilioVerifyNumber = createAsyncThunk(
   'verifyNumber',
   async (phoneNumber: string, { getState, dispatch }) => {
      try {
         let { user } = getState() as RootState;
         // Should return a formatted twilio number
         let res = await fetch(`/api/v2/twilio/verify-number`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            body: JSON.stringify({
               phoneNumber,
            }),
         });

         let response = await res.json();

         // handle invalid number responses
         if (!response.verifiedNumber) return;

         return response.verifiedNumber;
      } catch (TwilioError) {
         console.log(TwilioError);
      }
   }
);

// Updates twilio Access Token every 5 minutes
export const keepTokenUpdated = createAsyncThunk('verifyNumber', async (_, { getState, dispatch }) => {
   setInterval(async () => {
      console.log('...Refreshing Token');
      let token: any = await dispatch(getAccessTokenV2());
      if (__DEVICE__ && token?.payload) {
         __DEVICE__.updateToken(token?.payload);
      }
   }, FIVE_MINUTES);
});

export const endCall = createAsyncThunk('verifyNumber', async (_, { getState, dispatch }) => {
   __CALL__.disconnect();
});

export const twilioSlice = createSlice({
   name: 'twilio',
   initialState: { ...activeCall },
   reducers: {
      incomingCall: (state, action: PayloadAction<boolean>) => {
         console.log('...incomingCall reducer');
         // state.incomingCall = action.payload;
      },
      answerCall: (state, action: PayloadAction<any>) => {
         console.log('...answerCall reducer');
         const callParams = action.payload;
         __CALL__.accept();
         state.toNumber = callParams?.To;
         state.fromNumber = callParams?.From;
         state.currentCallSid = callParams?.CallSid;
         state.userOnCall = true;
         state.incomingCall = false;
         state.isCallBarShowing = true;
         state.callBarStatus = 'connected';
      },
      callEnded: (state, action: PayloadAction<boolean>) => {
         console.log('...callEnded reducer');
         state.userOnCall = action.payload;
         state.isCallBarShowing = false;
         state.callJustEnded = true;
         state.callBarStatus = null;

         __CALL__.disconnect();
      },
      resetCallJustEnded: (state) => {
         state.callJustEnded = false;
      },
      mute: (state, action: PayloadAction<boolean>) => {
         console.log('...mute reducer');
         // __CALL__.mute(action.payload);
         state.isMuted = action.payload;
      },
      placeOnHold: (state, action: PayloadAction<boolean>) => {
         console.log('...placeOnHold reducer');
         state.isOnHold = action.payload;
      },
      ignoreCall: (state, action: PayloadAction<any>) => {
         console.log('...ignoreCall reducer');
         const { payload } = action;
         // __CALL__.ignore();

         // state.isCallBarShowing = false;
      },
      rejectCall: (state, action: PayloadAction<boolean>) => {
         console.log('...rejectCall reducer');
         __CALL__.reject();
         state.isCallBarShowing = false;
      },
      showCallBar: (state, action: PayloadAction<boolean>) => {
         console.log('...showCallBar reducer');
         state.isCallBarShowing = action.payload;
      },
      setCallBarStatus: (state, action: PayloadAction<'connecting' | 'connected' | null>) => {
         console.log('...showCallBar reducer');
         state.callBarStatus = action.payload;
      },
      setActiveCallState: (state, action: PayloadAction<any>) => {
         console.log('...setActiveCallState reducer');
         return {
            ...state,
            ...action.payload,
         };
      },
      setLeadOnCall: (state, action: PayloadAction<any>) => {
         console.log('...setLeadOnCall reducer');
         state.lead = action.payload;
      },
      setInboundCalls: (state, action: PayloadAction<any>) => {
         console.log('...setInboundCalls reducer');
         const inboundCallAlreadyExists = state.inboundCalls.find((call) => call.callSid === action.payload?.callSid);
         if (inboundCallAlreadyExists) return state;
         state.inboundCalls = [...state.inboundCalls, action.payload];
         return state;
      },
      setRemoveInboundCall: (state, action: PayloadAction<any>) => {
         console.log('...setRemoveInboundCall reducer');
         const filteredInboundCalls = [...state.inboundCalls].filter((call) => {
            return call.callSid !== action.payload?.callSid;
         });
         state.inboundCalls = filteredInboundCalls;
         return state;
      },
      setTransfer: (state, action: PayloadAction<any>) => {
         console.log('...setTransfer reducer');
         state.isMakingTransfer = action.payload.isMakingTransfer;
         if (action.payload.transferNumber) {
            state.transferNumber = action.payload.transferNumber;
         }
      },
      setConferenceId: (state, action: PayloadAction<any>) => {
         console.log('...setConferenceId reducer');
         state.conferenceId = action.payload;
      },
   },
});

export const {
   showCallBar,
   setCallBarStatus,
   incomingCall,
   answerCall,
   callEnded,
   mute,
   placeOnHold,
   setActiveCallState,
   setLeadOnCall,
   setInboundCalls,
   setRemoveInboundCall,
   resetCallJustEnded,
   setTransfer,
   setConferenceId,
} = twilioSlice.actions;

export const selectCallBarStatus = (state: RootState) => state.twilio.isCallBarShowing;

export const selectActiveCall = (state: RootState) => state.twilio;

export const selectCallJustEnded = (state: RootState) => state.twilio.callJustEnded;

export const selectUserId = (state: RootState) => state.twilio.userId;

export const selectLeadOnCall = (state: RootState) => state.twilio.lead;

export const selectInboundCalls = (state: RootState) => state.twilio.inboundCalls;

export default twilioSlice.reducer;
