import PageProvider from '@/providers/PageProvider';
import { cookies } from 'next/headers';
import React from 'react';
import SingleSegmentClient from './SingleSegmentClient';

const SingleSegmentPage = async ({ params }: { params: { id: string } }) => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   const columnDropDowns = await getLeadSourceData(authToken);
   if (params.id === 'new')
      return (
         <PageProvider>
            <SingleSegmentClient columnDropDowns={columnDropDowns} segment={null} />
         </PageProvider>
      );

   const segment = await getSegmentFilter(authToken, params.id);
   return (
      <PageProvider>
         <SingleSegmentClient columnDropDowns={columnDropDowns} segment={segment} />
      </PageProvider>
   );
};

export default SingleSegmentPage;

const getLeadSourceData = async (authToken: any) => {
   return await fetch(`${process.env.CLIENT_SITE}/api/v2/segments/settings`, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${authToken}`,
      },
   }).then((res) => res.json());
};

const getSegmentFilter = async (authToken: any, id: string) => {
   return await fetch(`${process.env.CLIENT_SITE}/api/v2/segments/${id}`, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${authToken}`,
      },
   }).then((res) => res.json());
};
