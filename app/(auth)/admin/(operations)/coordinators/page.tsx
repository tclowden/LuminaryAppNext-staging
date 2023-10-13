import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import CoordinatorsClient from './CoordinatorsClient';
import { cookies } from 'next/headers';
import { fetchDbApi } from '@/serverActions';

const Page = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const allCoordinators: Array<any> = await fetchCoordinators(authToken);

   return (
      // PAGE PROVIDER: validates the users permissions to required page permissions to give them access to the page or redirect them (fallback route)
      <PageProvider>
         <CoordinatorsClient allCoordinators={allCoordinators} />
      </PageProvider>
   );
};

export default Page;

const fetchCoordinators: any = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/products/coordinators`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err:', err);
   });
};
