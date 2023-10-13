import React from 'react';
import { cookies } from 'next/headers'; // Ensure this is the right path and method
import { redirect } from 'next/navigation'; // Ensure this is the right path and method
import SingleBucketClient from './SingleBucketClient';

interface SingleBucketProps {
   params: {
      id: string;
   };
}

const SingleBucket = async ({ params: { id } }: SingleBucketProps) => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   if (!authToken) return redirect('admin/buckets');

   if (id === 'new') {
      return (
         <SingleBucketClient
            bucketData={{
               id: id,
               name: 'New Bucket',
               isDefaultBucket: false,
               isActive: false,
               numLeads: 0,
               leads: [],
               bucketUsers: [],
               bucketLeadSources: [],
               bucketStatuses: [],
               bucketType: {
                  id: '',
                  typeName: '',
               },
               orderCriteria: [],
            }}
         />
      );
   } else {
      const response = await fetch(`${process.env.CLIENT_SITE}/api/v2/buckets/${id}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
         },
      });

      const data = await response.json();

      return <SingleBucketClient bucketData={data} />;
   }
};

export default SingleBucket;
