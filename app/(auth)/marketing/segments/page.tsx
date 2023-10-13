import PageProvider from '@/providers/PageProvider';
import { cookies } from 'next/headers';
import React from 'react';
import SegmentsClient from './SegmentsClient';

const SegmentsPage = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   const segments = await getSegments(authToken);
   console.log('segments: ', segments);
   return (
      <PageProvider>
         <SegmentsClient segments={segments} />
      </PageProvider>
   );
};
const getSegments = async (authToken: any) => {
   return await fetch(`${process.env.CLIENT_SITE}/api/v2/segments`, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${authToken}`,
      },
   }).then((res) => res.json());
};

export default SegmentsPage;
