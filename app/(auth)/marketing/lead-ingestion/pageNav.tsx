'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'

import Button from '../../../../common/components/button/Button';
import Tabs from '../../../../common/components/tabs/Tabs';
import LeadIngestionWebhooks from './leadIngestionWebhooks';
import PageContainer from '../../../../common/components/page-container/PageContainer';
import { fetchDbApi } from '../../../../serverActions/fetchDbApi';

const Settings = ({ }) => {

   return (
      <>
         <div>Lead Deduplication</div>
         <div>Phone Number Validation</div>
         <div>Email Address Validation</div>
         <div>Zip Validation</div>
         <div>State Validation</div>
      </>
   )
}

const LeadIngestion = ({ endpoints }: { endpoints: object[] }) => {
   const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
   const router = useRouter()

   return (
      <PageContainer
         breadcrumbsChildren={
            <Button
               iconName='Plus'
               color='blue'
               onClick={async () => {
                  await fetchDbApi(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/leadIngestion/endpoints`, {
                     method: 'POST',
                     next: {
                        tags: ['test']
                     },
                     body: JSON.stringify({ name: "", description: "" })
                  }).then(res => {
                     console.log(res.id)
                     router.push(`/marketing/lead-ingestion/${res.id}?tab=2`)
                  }).catch(err => {
                     console.log("<------ERROR------>")
                     console.log(err);
                  })
               }}>
               New Source
            </Button>
         }
      >
         {/* <div>Ingestion</div> */}
         <div className='flex flex-col gap-4'>
            <Tabs
               tabs={[
                  { name: 'All Lead Sources' },
                  { name: 'Acquisition Statistics' },
                  { name: 'Archived Sources' },
                  { name: 'Settings' },
               ]}
               activeTabIndex={activeTabIndex}
               setActiveTabIndex={setActiveTabIndex}
            />
            {activeTabIndex === 0 && <LeadIngestionWebhooks endpoints={endpoints}></LeadIngestionWebhooks>}
            {activeTabIndex === 1 && <div>2</div>}
            {activeTabIndex === 2 && <div>3</div>}
            {activeTabIndex === 3 && <Settings></Settings>}
         </div>
      </PageContainer>
   );
};

export default LeadIngestion;
