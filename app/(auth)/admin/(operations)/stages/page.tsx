import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import StagesClient from './StagesClient';
import { cookies } from 'next/headers';
import { fetchDbApi } from '@/serverActions';

const Stage = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const allStages: Array<any> = await fetchStages(authToken);

   return (
      <PageProvider>
         <StagesClient allStages={allStages} />
      </PageProvider>
   );
};

export default Stage;

const fetchStages: any = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/products/stages`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err:', err);
   });
};
