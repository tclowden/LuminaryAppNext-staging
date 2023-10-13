'use client';

import Grid from '@/common/components/grid/Grid';
import Input from '@/common/components/input/Input';
import PageContainer from '@/common/components/page-container/PageContainer';
import Tabs from '@/common/components/tabs/Tabs';
import { useEffect, useState } from 'react';
import CallsTable from './(partials)/CallsTable';
import StatusUpdatesTable from './(partials)/StatusUpdatesTable';
import TextsTable from './(partials)/TextsTable';

type Props = {
   callLogs: Array<any>;
   smsLogs: Array<any>;
   auditLogs: Array<any>;
};

const myActivityTabs = [
   { name: 'Calls', iconName: 'PhoneInOut' },
   { name: 'Texts', iconName: 'MessageBubble' },
   { name: 'Status Updates', iconName: 'TagEdit' },
];

const MyActivityClient = ({ callLogs, smsLogs, auditLogs }: Props) => {
   const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
   const [searchValue, setSearchValue] = useState<string>('');

   const handleSearch = (searchString: string) => {
      setSearchValue(searchString);
   };

   return (
      <PageContainer
         breadcrumbsChildren={
            <>
               <Input
                  iconName='MagnifyingGlass'
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  border
                  shadow
                  onClearInput={() => handleSearch('')}
               />
            </>
         }>
         <Grid>
            <div className='flex justify-between'>
               {!!myActivityTabs?.length && (
                  <Tabs
                     tabs={myActivityTabs}
                     activeTabIndex={activeTabIndex}
                     setActiveTabIndex={(tabIndex) => setActiveTabIndex(tabIndex)}
                  />
               )}
            </div>
            {activeTabIndex === 0 && <CallsTable callLogs={callLogs} />}
            {activeTabIndex === 1 && <TextsTable smsLogs={smsLogs} />}
            {activeTabIndex === 2 && <StatusUpdatesTable auditLogs={auditLogs} />}
         </Grid>
      </PageContainer>
   );
};

export default MyActivityClient;
