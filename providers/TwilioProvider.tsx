'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { fetchDbApi } from '@/serverActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { Call, Device } from '@twilio/voice-sdk';
import { getObjectProp } from '@/utilities/helpers';
import { mute, setActiveCallState, setCallBarStatus, showCallBar } from '@/store/slices/twilio';
import { AblyContext } from '@/providers/AblyProvider';

const FIVE_MINUTES: number = 300000;

export const TwilioContext = createContext<any>({ DEVICE: null, CALL: null });

const TwilioProvider = ({ children }: { children: ReactNode }) => {
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const { publishToChannels } = useContext(AblyContext);

   const [DEVICE, setDEVICE] = useState<any>(null);
   const [CALL, setCALL] = useState<any>(null);

   const keepTokenUpdated = useCallback(async () => {
      setInterval(async () => {
         console.log('TwilioProvider -> keepTokenUpdated -> Refreshing Token');
         let data: any = await getAccessToken(user);
         if (DEVICE && data?.token) {
            setDEVICE((prevState: any) => {
               prevState.updateToken(data.token);
               return prevState;
            });
         }
      }, FIVE_MINUTES);
   }, [user, DEVICE]);

   const initDevice = useCallback(async () => {
      console.log('TwilioProvider -> initDevice -> Initiated');
      if (!user?.token) {
         console.log('TwilioProvider -> initDevice -> Error: "No user defined"');
         return;
      }
      const data = await getAccessToken(user);

      const tempDevice = new Device(data.token, {
         closeProtection: true,
         disableAudioContextSounds: false,
      });

      tempDevice.setMaxListeners(20);

      // this sets the Device ready for incoming calls
      tempDevice.register();

      // Catch errors on twilio device
      tempDevice.on('error', (twilioError, call) => {
         console.log('Twilio Error:', twilioError);
      });

      // successful registration will emit the registered event, from there we keep the access token fresh
      tempDevice.on('registered', async () => {
         console.log('TwilioProvider -> initDevice -> registered');
         // await keepTokenUpdated();
      });

      // someone calls us
      tempDevice.on('incoming', async (call: Call) => {
         console.log('TwilioProvider -> initDevice -> incoming');
         const tempCall = call;

         tempCall.accept();

         dispatch(
            setActiveCallState({
               toNumber: tempCall?.parameters?.To,
               fromNumber: tempCall?.parameters?.From,
               currentCallSid: tempCall?.parameters?.CallSid,
               userOnCall: true,
               incomingCall: false,
               isCallBarShowing: true,
               callBarStatus: 'connected',
            })
         );
         await tempCall.on('disconnect', async () => {
            console.log('TwilioProvider -> initDevice -> disconnect');
            tempCall.disconnect();
            dispatch(showCallBar(false));
            dispatch(setCallBarStatus(null));
         });

         setCALL(tempCall);
      });

      setDEVICE(tempDevice);
   }, [user, dispatch]);

   const verifyNumber = useCallback(async (phoneNumber: string) => {
      const response = await fetchDbApi(`/api/v2/twilio/verify-number`, {
         method: 'POST',
         body: JSON.stringify({
            phoneNumber,
         }),
      });

      if (!response.verifiedNumber) return;
      return response.verifiedNumber;
   }, []);

   const makeOutboundCall = useCallback(
      async (toNumber: string) => {
         console.log('TwilioProvider -> makeOutboundCall -> toNumber:', toNumber);

         if (!user) {
            console.log('TwilioProvider -> makeOutboundCall -> Error: "No user defined"');
            return;
         }
         const userNumber = getObjectProp(user, ['phoneNumbers', 0, 'phoneNumber', 'number']);
         if (!userNumber) {
            console.log('TwilioProvider -> makeOutboundCall -> Error: "User has no number"');
            return;
         }

         const verifiedNumber = await verifyNumber(toNumber);
         if (!verifiedNumber) {
            console.log('TwilioProvider -> makeOutboundCall -> Error:', 'Number could not be verified');
         }

         const data = await getAccessToken(user);

         const tempDevice = new Device(data.token, {
            closeProtection: true,
            disableAudioContextSounds: false,
         });

         tempDevice.setMaxListeners(20);

         // this sets the Device ready for incoming calls
         tempDevice.register();

         // Catch errors on twilio device
         tempDevice.on('error', (twilioError, call) => {
            console.log('Twilio Error:', twilioError);
         });

         // successful registration will emit the registered event, from there we keep the access token fresh
         tempDevice.on('registered', async () => {
            console.log('TwilioProvider -> initDevice -> registered');
            await keepTokenUpdated();
         });

         const confUUID = crypto.randomUUID();
         // This starts calling
         let newCall: Call = await tempDevice.connect({
            params: {
               To: verifiedNumber,
               From: userNumber,
               CallerId: userNumber,
               FriendlyName: confUUID,
            },
         });

         // All the events emitted by the call object
         newCall.on('accept', (call) => {
            console.log(
               `TwilioProvider -> makeOutboundCall -> accept: "The call has been accepted or the outgoing call's media session has finished setting up."`,
               call.parameters
            );

            const acceptedCall = call;
            setCALL(acceptedCall);
            // update with the accepted call status, and all info we have about the call
            dispatch(
               setActiveCallState({
                  userId: user.id,
                  currentCallSid: acceptedCall?.parameters?.CallSid,
                  fromNumber: userNumber,
                  toNumber: toNumber,
                  twilioCallEventStatus: 'accept',
                  twilioCallStatus: newCall.status(),
                  conferenceId: confUUID,
               })
            );
            dispatch(showCallBar(true));
            dispatch(setCallBarStatus('connected'));
         });

         newCall.on('disconnect', () => {
            console.log('TwilioProvider -> makeOutboundCall -> disconnect');
            newCall.disconnect();

            dispatch(
               setActiveCallState({
                  twilioCallEventStatus: 'disconnect',
                  twilioCallStatus: newCall.status(),
                  isCallBarShowing: false,
               })
            );
         });

         newCall.on('ringing', () => {
            console.log('TwilioProvider -> makeOutboundCall -> ringing');

            dispatch(
               setActiveCallState({
                  twilioCallEventStatus: 'ringing',
                  twilioCallStatus: newCall.status(),
                  isCallBarShowing: true,
                  callBarStatus: 'connecting',
                  conferenceId: confUUID,
                  toNumber: toNumber,
               })
            );
         });

         newCall.on('cancel', () => {
            console.log('TwilioProvider -> makeOutboundCall -> cancel');

            dispatch(
               setActiveCallState({
                  twilioCallEventStatus: 'cancel',
                  twilioCallStatus: newCall.status(),
               })
            );
         });

         newCall.on('reject', () => {
            console.log('TwilioProvider -> makeOutboundCall -> reject');

            dispatch(
               setActiveCallState({
                  twilioCallEventStatus: 'reject',
                  twilioCallStatus: newCall.status(),
               })
            );
         });

         newCall.on('busy', () => {
            console.log(`TwilioProvider -> makeOutboundCall -> busy`);

            dispatch(
               setActiveCallState({
                  twilioCallEventStatus: 'busy',
                  twilioCallStatus: newCall.status(),
               })
            );
         });

         setCALL(newCall);
      },
      [user, keepTokenUpdated, verifyNumber, dispatch]
   );

   const endCall = useCallback(() => {
      setCALL((prevState: any) => {
         prevState.disconnect();
         return prevState;
      });
   }, []);

   const muteCall = useCallback((isMuted: boolean) => {
      setCALL((prevState: any) => {
         prevState?.mute && prevState?.mute(isMuted);
         return prevState;
      });
      dispatch(mute(isMuted));
   }, []);

   const acceptCall = useCallback(
      async ({
         callSid,
         notifiedChannels,
         lead,
      }: {
         callSid: string;
         notifiedChannels: Array<string>;
         lead?: { id?: string; firstName?: string; lastName?: string };
      }) => {
         publishToChannels(notifiedChannels, 'call-answered', { callSid });
         dispatch(
            setActiveCallState({
               lead,
               isCallBarShowing: true,
               callBarStatus: 'connecting',
            })
         );
         await fetchDbApi(`/api/v2/twilio/accept-call`, {
            method: 'POST',
            body: JSON.stringify({
               userId: user?.id,
               callSid,
               notifiedChannels,
            }),
         }).catch((err: any) => console.log('TwilioProvider -> acceptCall -> Error:', err));
      },
      [user, dispatch]
   );

   useEffect(() => {
      if (!DEVICE && user?.id && user?.token) {
         initDevice();
      }
   }, [DEVICE, user, initDevice]);

   const value = { DEVICE, setDEVICE, CALL, setCALL, makeOutboundCall, endCall, muteCall, acceptCall };

   return <TwilioContext.Provider value={value}>{children}</TwilioContext.Provider>;
};

export default TwilioProvider;

const getAccessToken = async (user: any) => {
   return fetchDbApi(`/api/v2/twilio/capability-token/${user?.id}`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => {
      console.error('Unable to fetch twilio access token: ', err);
   });
};
