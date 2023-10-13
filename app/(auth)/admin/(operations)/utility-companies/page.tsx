import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import UtilityCompaniesClient from './UtilityCompaniesClient';
import { fetchDbApi } from '@/serverActions';

const UtilityCompanies = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const allUtilityCompanies: Array<any> = await fetchUtilityCompanies(authToken);
   const totalCount: number = await fetchUtilityCompanyCount(authToken);

   return (
      <PageProvider
         enablePageContext
         defaultPageContext={{ utilityCompanies: allUtilityCompanies, totalUtilCompanyCount: totalCount }}>
         <UtilityCompaniesClient />
      </PageProvider>
   );
};

export default UtilityCompanies;

// const fetchUtilityCompanies: any = async (token: string | undefined) => {
//    return await fetchDbApi(`/api/v2/utility-companies`, {
//       method: 'GET',
//       headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
//       cache: 'no-store',
//    }).catch((err) => {
//       // how should we handle errors if here??
//       console.log('err:', err);
//    });
// };
const fetchUtilityCompanies: any = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/utility-companies/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
         limit: 100,
         offset: 0,
         include: [{ model: 'statesLookup', as: 'state', required: false }],
         order: [['name', 'ASC']],
      }),
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err:', err);
   });
};

const fetchUtilityCompanyCount: any = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/utility-companies/count`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
   }).catch((err: any) => {
      console.log('err getting utility company count:', err);
   });
};
