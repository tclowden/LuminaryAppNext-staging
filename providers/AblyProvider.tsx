'use client';

import {
   InboundCall,
   selectInboundCalls,
   setInboundCalls,
   setRemoveInboundCall,
   setTransfer,
} from '@/store/slices/twilio';
import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { selectToasts, setAddToast, setRemoveToastByUniqueId, Toast } from '@/store/slices/toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setNewLeadSmsLog } from '@/store/slices/smsLogs';
import { getDisplayName } from '@/utilities/helpers';
import { incrementUserNotificationCount, selectUser } from '@/store/slices/user';
import Ably from 'ably/promises';

export const AblyContext = createContext<any>({ ABLY: null, channels: [] });

const AblyProvider = ({ children }: { children: ReactNode }) => {
   const user = useAppSelector(selectUser);
   const inboundCalls = useAppSelector(selectInboundCalls);
   const toasts = useAppSelector(selectToasts);
   const dispatch = useAppDispatch();

   const [ABLY, setABLY] = useState<any>(null);
   const [channels, setChannels] = useState<Array<string>>([]);

   const subscribeChannels = useCallback(
      async (ablyInstance: any, userChannels: Array<string>) => {
         if (!userChannels?.length) {
            console.log('AblyProvider -> subscribeChannels -> Error:', '"No user channels"');
            return;
         }

         if (!ablyInstance) {
            console.log('AblyProvider -> subscribeChannels -> Error:', '"No ABLY instance"');
            return;
         }

         const ablyChannels = userChannels.map((name) => name && ablyInstance.channels.get(name));

         if (!ablyChannels?.length) {
            console.log(
               'AblyProvider -> subscribeChannels -> Error:',
               '"Could not get ably channels from provided channels"'
            );
            return;
         }

         for (const ch of ablyChannels) {
            if (!ch) return;
            await ch.subscribe(({ id, name, data }: { id: string; name: string; data: any }) => {
               switch (name) {
                  case 'incoming-call':
                     console.log('Ably -> "incoming-call": ', data);
                     const callSid = data?.incomingCall?.CallSid;
                     const foundExistingCall = inboundCalls.find((call: InboundCall) => call.callSid === callSid);

                     if (!foundExistingCall) {
                        dispatch(
                           setInboundCalls({
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

                     const foundToast = toasts.find((t: Toast) => t.uniqueId === callSid);
                     if (!foundToast) {
                        dispatch(
                           setAddToast({
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
                  case 'incoming-message':
                     console.log('Ably -> "incoming-message": ', data);
                     dispatch(
                        setAddToast({
                           uniqueId: data?.messageSid,
                           iconName: 'PaperAirplane',
                           details: [
                              {
                                 label: 'New Message From',
                                 text: getDisplayName([data?.lead?.firstName, data?.lead?.lastName]),
                              },
                              { label: 'Message', text: data?.body },
                              ...(data?.mediaUrls?.length
                                 ? [
                                      {
                                         label: 'Attached Media',
                                         text: `${data?.mediaUrls?.length} Attachment${
                                            data?.mediaUrls?.length > 1 ? 's' : ''
                                         }`,
                                      },
                                   ]
                                 : []),
                           ],
                           variant: 'primary',
                           autoCloseDelay: 10,
                           audio: 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-77317/zapsplat_multimedia_notification_vibraphone_alert_positive_new_message_001_78583.mp3',
                        })
                     );
                     dispatch(setNewLeadSmsLog({ leadId: data?.lead?.id, smsLog: data }));
                     break;
                  case 'call-answered':
                     console.log('Ably -> "call-answered": ', data);
                     dispatch(setRemoveToastByUniqueId({ uniqueId: data?.callSid }));
                     dispatch(setRemoveInboundCall({ callSid: data.callSid }));
                     break;
                  case 'call-hung-up':
                     console.log('Ably -> "call-hung-up": ', data);
                     dispatch(setRemoveToastByUniqueId({ uniqueId: data?.callSid }));
                     dispatch(setRemoveInboundCall({ callSid: data.callSid }));
                     break;
                  case 'transfer-connected':
                     console.log('Ably -> "transfer-connected"');
                     dispatch(setTransfer({ isMakingTransfer: false }));
                     break;
                  case 'notification':
                     dispatch(
                        setAddToast({
                           iconName: 'PaperAirplane',
                           details: [{ label: 'New Notification', text: data?.message }],
                           variant: 'primary',
                           autoCloseDelay: 10,
                           destinationRoute: data?.path || '',
                        })
                     );
                     dispatch(incrementUserNotificationCount());
                  case 'cron':
                     dispatch(
                        setAddToast({
                           iconName: 'AlarmClock',
                           details: [{ label: 'Cron', text: data?.message }],
                           variant: 'info',
                           autoCloseDelay: 5,
                        })
                     );
                  default:
                     console.log(`Ably -> default -> eventName: "${name}", data:`, data);
                     break;
               }
               return;
            });
         }
         return;
      },
      [inboundCalls, toasts, dispatch]
   );

   const unsubscribeChannels = useCallback(() => {
      if (channels?.length) {
         console.log('AblyProvider -> unsubscribeChannels -> Error:', '"No Channels to unsubscribe from"');
      }

      const ablyChannels = channels.map((name) => name && ABLY.channels.get(name));

      ablyChannels.forEach((ch) => {
         ch && ch.unsubscribe();
      });
   }, [ABLY, channels]);

   const initAbly = useCallback(async () => {
      console.log('AblyProvider -> initAbly -> Initiated');

      if (!user.id || !user.token) {
         console.log('AblyProvider -> initAbly -> Error:', '"No user defined"');
         return;
      }
      const ablyInstance = await new Ably.Realtime.Promise({
         authUrl: `/api/v2/ably`,
         authMethod: 'GET',
         authHeaders: { Authorization: `Bearer ${user.token}` },
      });
      setABLY(ablyInstance);

      const userChannels = user?.roleIds?.length ? [user.id, ...user?.roleIds] : [user.id];
      setChannels(userChannels);

      subscribeChannels(ablyInstance, userChannels);
   }, [user, subscribeChannels]);

   const publishToChannels = useCallback(
      async (channelsToNotify: Array<string>, eventName: string, eventData: any) => {
         if (!channelsToNotify.length) {
            console.log('AblyProvider -> publishToChannels -> Error:', '"No channels provided for publishing event"');
            return;
         }

         if (!eventName || !eventData) {
            console.log(
               'AblyProvider -> publishToChannels -> Error:',
               '"No eventName and/or eventData provided for channel publish"'
            );
            return;
         }

         setABLY((prevState: any) => {
            const channels = channelsToNotify.map((name) => name && prevState.channels.get(name));

            for (const ch of channels) {
               if (!ch) return;
               ch.publish({ name: eventName, data: eventData });
            }
            return prevState;
         });
      },
      [ABLY]
   );

   useEffect(() => {
      if (!ABLY && user?.id && user?.token) {
         initAbly();
      }

      // return () => {
      //    unsubscribeChannels();
      // };
   }, [ABLY, user, initAbly, unsubscribeChannels]);

   const value = { ABLY, channels, publishToChannels };

   return <AblyContext.Provider value={value}>{children}</AblyContext.Provider>;
};

export default AblyProvider;
