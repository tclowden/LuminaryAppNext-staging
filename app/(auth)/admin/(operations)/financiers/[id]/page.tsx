import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../../providers/PageProvider';
import FinancierClient from './FinancierClient';
import { fetchDbApi } from '@/serverActions';

interface Props {
   params: { id: string };
   searchParams?: { type: string };
}

const FinanceCompany = async ({ params }: Props) => {
   const financierId = params.id !== 'new' ? params.id : null;
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   let financier;
   if (financierId) financier = await fetchFinancier(authToken, financierId);
   else financier = {};

   return (
      <PageProvider
         enablePageContext
         defaultPageContext={{
            financier: financier,
         }}>
         <FinancierClient />
      </PageProvider>
   );
};

export default FinanceCompany;

const fetchFinancier = async (token: string | undefined, financierId: number | string) => {
   return await fetchDbApi(`/api/v2/financiers/${financierId}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      console.log('err in finacier page with id:', financierId, ' err -->', err);
   });
};

const handleResults = (results: any) => results.map((result: any) => result.status === 'fulfilled' && result.value);
