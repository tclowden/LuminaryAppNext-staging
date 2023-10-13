import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../../providers/PageProvider';
import UtilityCompanyClient from './UtilityCompanyClient';
import { fetchDbApi } from '@/serverActions';

interface Props {
   params: { id: string };
   searchParams?: { type: string };
}

const UtilityCompany = async ({ params }: Props) => {
   const utilityCompanyId = params.id !== 'new' ? params.id : null;
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   const statesRes: any = fetchStates(authToken);
   const fetchNetMeteringTypesRes: any = fetchNetMeteringTypes(authToken);

   let utilityCompanyRes: any = null;
   if (utilityCompanyId) utilityCompanyRes = fetchUtilityCompany(authToken, utilityCompanyId);
   // default obj if creating a new utility company
   else utilityCompanyRes = { netMeter: false };

   const [states, netMeteringTypes, utilityCompany] = await Promise.allSettled([
      statesRes,
      fetchNetMeteringTypesRes,
      utilityCompanyRes,
   ])
      .then(handleResults)
      .catch((err) => {
         console.log('err:', err);
      });

   return (
      <PageProvider
         enablePageContext
         defaultPageContext={{
            utilityCompany: utilityCompany,
            states: states,
            netMeteringTypes: netMeteringTypes,
         }}>
         <UtilityCompanyClient />
      </PageProvider>
   );
};

export default UtilityCompany;

const fetchUtilityCompany = async (token: string | undefined, utilityCompanyId: number | string) => {
   return await fetchDbApi(`/api/v2/utility-companies/${utilityCompanyId}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      console.log('err in utility company page with id:', utilityCompanyId, ' err -->', err);
   });
};

const fetchStates = async (token: string | undefined) => {
   const filterObj = {
      // where: { supported: true }
      order: [['name', 'ASC']],
   };
   return await fetchDbApi(`/api/v2/states/query`, {
      method: 'POST',
      body: JSON.stringify(filterObj),
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err: any) => {
      console.log('err:', err);
   });
};

const fetchNetMeteringTypes = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/net-metering-types`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err: any) => {
      console.log('err:', err);
   });
};

const handleResults = (results: any) => results.map((result: any) => result.status === 'fulfilled' && result.value);
