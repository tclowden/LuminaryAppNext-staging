'use client';
import React, { useState } from 'react';
import Button from '../../../../../common/components/button/Button';
import Tabs from '../../../../../common/components/tabs/Tabs';
import LIWebhookDetails from './webhookDetails';
import LIWebhookRunHistory from './webhookRunHistory';
import LIWebhookRunStats from './webhookRunStats';
import PageContainer from '../../../../../common/components/page-container/PageContainer';

// Success
// Failed
// Result: New Lead, Duplicate, Appointment Scheduled, 
// Date
// 

const LIWebhookNav = ({ endpointData, runHistory, searchParams }: {
   endpointData: { id: string, name: string, description: string, createdAt: Date, updatedAt: Date }[],
   runHistory: { id: string, dataIn: any, status: string, createdAt: Date, updatedAt: Date }[],
   searchParams: { [key: string]: string | string[] | undefined }
}) => {
   const [activeTabIndex, setActiveTabIndex] = useState<number>(searchParams?.tab ? +searchParams.tab : 0);
   const [showTabWithIcons, setShowTabWithIcons] = useState<boolean>(false);

   return (
      <PageContainer>
         <div className='flex flex-col gap-4'>
            <Tabs
               tabs={[
                  { name: 'Statistics' },
                  { name: 'Run History' },
                  { name: 'Details' },
               ]}
               activeTabIndex={activeTabIndex}
               setActiveTabIndex={setActiveTabIndex}
            />
            {activeTabIndex === 0 && <LIWebhookRunStats runHistory={runHistory} />}
            {activeTabIndex === 1 && <LIWebhookRunHistory runHistory={runHistory} />}
            {activeTabIndex === 2 && <LIWebhookDetails endpoint={endpointData[0]} runHistory={runHistory} />}
         </div>
      </PageContainer>
   );
};

export default LIWebhookNav;
