import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import BucketsClient from './BucketsClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Buckets = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   if (!authToken) return redirect('/login');

   const data = await getBuckets(authToken);

   return (
      <PageProvider>
         <BucketsClient buckets={data} />
      </PageProvider>
   );
};

export default Buckets;

async function getBuckets(authToken: string) {
   const response = await fetch(`${process.env.CLIENT_SITE}/api/v2/buckets`, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${authToken}`,
      },
      cache: 'no-store',
   });
   const data = await response.json();
   return data;
}
