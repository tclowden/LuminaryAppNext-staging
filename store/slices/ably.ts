import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Ably from 'ably/promises';
import { RootState } from '../store';
import { Toast, toastSlice } from './toast';
import { InboundCall, twilioSlice } from './twilio';

let __ABLY__: any;
export interface AblyState {
   channels: Array<string>;
}

const ablyInitialState: AblyState = {
   channels: [],
};

export const subscribeChannels = createAsyncThunk('ably/subscribeChannels', async (_, { getState, dispatch }) => {
   const { ably, toast, twilio } = getState() as RootState;
   if (!ably.channels.length) return;

   const channels = ably.channels.map((name) => name && __ABLY__.channels.get(name));

   for (const ch of channels) {
      if (!ch) return;
      await ch.subscribe(({ id, name, data }: { id: string; name: string; data: any }) => {
         switch (name) {
            case 'incoming-call':
               console.log('incoming-call: ', id, data);
               const callSid = data?.incomingCall?.CallSid;
               const foundExistingCall = twilio.inboundCalls.find((call: InboundCall) => call.callSid === callSid);

               if (!foundExistingCall) {
                  dispatch(
                     twilioSlice.actions.setInboundCalls({
                        from: data?.incomingCall?.From,
                        callSid,
                        callStartTime: `${new Date()}`,
                        leadId: data?.lead?.id || null,
                        leadName: [data.lead?.firstName, data.lead?.lastName].some((val: any) => !!val)
                           ? `${data.lead?.firstName || ''} ${data.lead?.lastName || ''}`.trim()
                           : null,
                        notifiedChannels: data?.notifiedChannels,
                     })
                  );
               }

               const foundToast = toast.toasts.find((t: Toast) => t.uniqueId === callSid);
               if (!foundToast) {
                  dispatch(
                     toastSlice.actions.setAddToast({
                        uniqueId: callSid,
                        title: 'Answer Call',
                        iconName: 'PhoneRinging',
                        details: [
                           {
                              label: 'Call From:',
                              text: [data.lead?.firstName, data.lead?.lastName].some((val: any) => !!val)
                                 ? `${data.lead?.firstName || ''} ${data.lead?.lastName || ''}`.trim()
                                 : 'Unknown',
                           },
                           { label: 'Number:', text: data?.incomingCall?.From },
                        ],
                        variant: 'success',
                        onToastClick: {
                           actionType: 'twilio/connectQueueCall',
                           actionPayload: { callSid, notifiedChannels: data?.notifiedChannels, lead: data?.lead },
                        },
                        onCloseToast: {
                           actionType: 'twilio/ignoreCall',
                        },
                        animate: true,
                        audio: 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-84577/zapsplat_multimedia_ringtone_mallets_marimba_smartphone_004_84893.mp3',
                        loopAudio: true,
                     })
                  );
               }
               break;
            case 'call-answered':
               console.log('call-answered: ', data);
               dispatch(toastSlice.actions.setRemoveToastByUniqueId({ uniqueId: data?.callSid }));
               dispatch(twilioSlice.actions.setRemoveInboundCall({ callSid: data.callSid }));
               break;
            case 'call-hung-up':
               console.log('call-hung-up: ', data);
               dispatch(toastSlice.actions.setRemoveToastByUniqueId({ uniqueId: data?.callSid }));
               dispatch(twilioSlice.actions.setRemoveInboundCall({ callSid: data.callSid }));
               break;
            case 'transfer-connected':
               console.log('transfer-connected: ', data);
               dispatch(twilioSlice.actions.setTransfer({ isMakingTransfer: false }));
               break;
            default:
               console.log(`Ably Message: ${name} ->`, data);
               break;
         }
      });
   }
});

export const publishToChannels = createAsyncThunk(
   'ably/publishToChannels',
   async ({
      channelsToNotify,
      eventName,
      eventData,
   }: {
      channelsToNotify: Array<string>;
      eventName: string;
      eventData: any;
   }) => {
      if (!channelsToNotify.length) return;

      const channels = channelsToNotify.map((name) => name && __ABLY__.channels.get(name));

      for (const ch of channels) {
         if (!ch) return;
         await ch.publish({ name: eventName, data: eventData });
      }
   }
);

export const initializeAbly = createAsyncThunk('ably/initializeAbly', async (_, { getState, dispatch }) => {
   const { user, toast, twilio } = getState() as RootState;
   if (!user?.id || !user?.token) return;

   if (!__ABLY__) {
      __ABLY__ = await new Ably.Realtime.Promise({
         authUrl: `/api/v2/ably`,
         authMethod: 'GET',
         authHeaders: { Authorization: `Bearer ${user.token}` },
      });
   }

   const channelNames = user?.roleIds?.length ? [user.id, ...user?.roleIds] : [user.id];
   dispatch(ablySlice.actions.setChannels(channelNames));

   await dispatch(subscribeChannels());
});

export const unsubscribeChannels = createAsyncThunk('ably/unsubscribeChannels', async (_, { getState, dispatch }) => {
   const { ably } = getState() as RootState;
   if (!ably.channels.length) return;

   const channels = ably.channels.map((name) => name && __ABLY__.channels.get(name));

   channels.forEach((ch) => {
      ch && ch.unsubscribe();
   });
});

export const ablySlice = createSlice({
   name: 'ably',
   initialState: { ...ablyInitialState },
   reducers: {
      setChannels: (state, action: PayloadAction<Array<string>>) => {
         state.channels = action.payload;
      },
   },
});

export const { setChannels } = ablySlice.actions;

export default ablySlice.reducer;
