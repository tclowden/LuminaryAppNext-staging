import { fetchDbApi } from '@/serverActions';
import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import LeadFieldsSectionsClient from './LeadFieldsSectionsClient';

const LeadFieldsSections = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   if (!authToken) {
      console.log('hmmm... how to handle this err?');
   }

   const leadFieldsSectionsData: any = await fetchDbApi(`/api/v2/leads/sections`, {
      method: 'GET',
   }).catch((err) => console.error('err', err));
   return (
      <PageProvider>
         <LeadFieldsSectionsClient
            leadFieldsSectionsData={!!leadFieldsSectionsData?.length ? leadFieldsSectionsData : []}
         />
      </PageProvider>
   );
};

export default LeadFieldsSections;
