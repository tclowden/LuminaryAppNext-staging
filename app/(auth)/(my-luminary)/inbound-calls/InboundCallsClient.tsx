'use client';
import { useEffect, useState } from 'react';
import Button from '../../../../common/components/button/Button';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setInboundCalls } from '../../../../store/slices/twilio';
import { selectUser } from '../../../../store/slices/user';
import Grid from '../../../../common/components/grid/Grid';
import PageContainer from '../../../../common/components/page-container/PageContainer';
import Tabs from '../../../../common/components/tabs/Tabs';
import InboundCallsTab from './(partials)/InboundCallsTab';
import MonitoringTab from './(partials)/MonitoringTab';
import MissedCallsTab from './(partials)/MissedCallsTab';

const phoneNumberTabs = [{ name: 'Inbound Calls' }, { name: 'Monitoring' }, { name: 'Missed Calls' }];

type Props = {};

const InboundCallsClient = ({}: Props) => {
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);

   const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

   useEffect(() => {
      async function getCallsInQueue() {
         try {
            const res = await fetch(`/api/v2/twilio/queue-calls`, {
               method: 'GET',
               headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user?.token}` },
            });
            const queueCalls = await res.json();
            const userChannels = user?.roleIds?.length ? [user.id, ...user?.roleIds] : [user.id];

            // Only set Inbound Calls for calls that are directed to user
            queueCalls.forEach((call: any) => {
               // This determines if any notifiedChannels on the call match with the user's channels
               const isCallingCurrentUser: boolean = call.notifiedChannels.some((ch: string) =>
                  userChannels.includes(ch)
               );
               if (isCallingCurrentUser) dispatch(setInboundCalls(call));
            });
         } catch (err) {
            console.log(err);
         }
      }
      getCallsInQueue();
   }, [dispatch, user]);

   return (
      <PageContainer>
         <Grid>
            <Grid columnCount={4} columnGap={10}>
               <div className='min-h-[108px] rounded bg-lum-white dark:bg-lum-gray-700'></div>
               <div className='min-h-[108px] rounded bg-lum-white dark:bg-lum-gray-700'></div>
               <div className='min-h-[108px] rounded bg-lum-white dark:bg-lum-gray-700'></div>
               <div className='min-h-[108px] rounded bg-lum-white dark:bg-lum-gray-700'></div>
            </Grid>
            <Tabs
               tabs={phoneNumberTabs}
               activeTabIndex={activeTabIndex}
               setActiveTabIndex={(tabIndex) => setActiveTabIndex(tabIndex)}
            />
            <Grid>
               {activeTabIndex === 0 && <InboundCallsTab />}
               {activeTabIndex === 1 && <MonitoringTab />}
               {activeTabIndex === 2 && <MissedCallsTab />}
            </Grid>
         </Grid>
      </PageContainer>
   );
};

export default InboundCallsClient;
