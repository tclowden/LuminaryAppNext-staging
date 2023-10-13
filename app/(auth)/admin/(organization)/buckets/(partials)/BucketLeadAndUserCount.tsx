import Grid from '@/common/components/grid/Grid';
import Panel from '@/common/components/panel/Panel';
import ToggleSwitch from '@/common/components/toggle-switch/ToggleSwitch';
import React from 'react';
import { Bucket } from './types';

interface Props {
   bucketName: string;
   isBucketActive: boolean;
   activeBucketUsers: any[];
   bucketLeadsCount: number;
   handleToggleBucketActive: (isBucketActive: boolean) => any;
}

const BucketLeadAndUserCount = ({
   bucketName,
   isBucketActive,
   activeBucketUsers,
   bucketLeadsCount,
   handleToggleBucketActive,
}: Props) => {
   return (
      <Panel
         title={bucketName}
         topRightChildren={
            <ToggleSwitch
               label='Active?'
               checked={isBucketActive}
               onChange={(e: any) => handleToggleBucketActive(e.target.checked)}
            />
         }>
         <Grid columnCount={2}>
            <div className='flex flex-col'>
               Leads
               <div className='flex'>{bucketLeadsCount}</div>
            </div>
            <div className='flex flex-col'>
               Users
               <div className='flex'>{activeBucketUsers.length}</div>
            </div>
         </Grid>
      </Panel>
   );
};

export default BucketLeadAndUserCount;
