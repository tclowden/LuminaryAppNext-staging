'use client';

import Grid from '../../../common/components/grid/Grid';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/user';
import GetNextLeadButton from './GetNextLeadButton';
import BucketsDropDown from './BucketsDropDown';
import { useEffect, useState } from 'react';
import { BucketResponse, Lead } from './types';

async function fetchBuckets(authToken: string, userId: string | null) {
   try {
      let request = await fetch(`/api/v2/buckets/users/${userId}`, {
         method: 'GET',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      });
      let response = await request.json();
      return response;
   } catch (err) {
      console.log('fetchBuckets err: ', err);
   }
}

function GetNextLead() {
   const user = useAppSelector(selectUser);
   const token = user.token as string;
   const [availableBuckets, setAvailableBuckets] = useState<any[]>([]);
   const [selectedBucket, setSelectedBucket] = useState<BucketResponse | null>(null);

   useEffect(() => {
      async function getBuckets() {
         const buckets = await fetchBuckets(token, user.id);
         const defaultBucket = buckets.find((buck: any) => buck.isDefaultBucket);
         setSelectedBucket(defaultBucket);
         setAvailableBuckets(buckets);
      }
      getBuckets();
   }, []);

   return (
      <div className='flex w-full'>
         <Grid columnCount={1}>
            {!!availableBuckets.length && (
               <>
                  <GetNextLeadButton selectedBucket={selectedBucket} />
                  <BucketsDropDown
                     selectedBucket={selectedBucket}
                     buckets={availableBuckets}
                     onBucketSelect={(selectedBucket: BucketResponse) => setSelectedBucket(selectedBucket)}
                  />
               </>
            )}
         </Grid>
      </div>
   );
}

export default GetNextLead;
