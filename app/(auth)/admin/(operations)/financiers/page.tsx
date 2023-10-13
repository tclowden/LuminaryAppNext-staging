import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import FinanciersClient from './FinanciersClient';
import { fetchDbApi } from '@/serverActions';

const FinanciersCompanies = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const allFinanciersCompanies: Array<any> = await fetchFinance(authToken);

   return (
      <PageProvider enablePageContext defaultPageContext={{ financiers: allFinanciersCompanies }}>
         <FinanciersClient />
      </PageProvider>
   );
};

export default FinanciersCompanies;

const fetchFinance: any = async (token: string | undefined) => {
   return await fetchDbApi(`${process.env.CLIENT_SITE}/api/v2/financiers`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err:', err);
   });
};
