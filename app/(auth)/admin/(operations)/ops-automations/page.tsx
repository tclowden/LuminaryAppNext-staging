import React from 'react';
import PageProvider from '@/providers/PageProvider';
import OpsAutomationsClient from './OpsAutomationsClient';
import { cookies } from 'next/headers';
import { fetchDbApi } from '@/serverActions';
import { deepCopy } from '@/utilities/helpers';

const OpsAutomations = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   let automations: any = getAutomations(authToken);
   let automationCount: any = getAutomationsCount(authToken);

   // fetch in parallel
   [automations, automationCount] = await Promise.allSettled([automations, automationCount]).then(handleResults);

   return (
      <PageProvider>
         <OpsAutomationsClient allAutomations={automations} automationCount={automationCount} />
      </PageProvider>
   );
};

export default OpsAutomations;

const getAutomations = (token?: string) => {
   return fetchDbApi(`/api/v2/automations/query?type=operations`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
         limit: 100,
         offset: 0,
         order: [['createdAt', 'DESC']],
      }),
   }).catch((err) => {
      // how to handle this err?
      console.log('err:', err);
   });
};

const getAutomationsCount: any = async (token?: string) => {
   return await fetchDbApi(`/api/v2/automations/count?type=operations`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      // how to handle this err?
      console.log('err:', err);
   });
};

const handleResults = (results: any) =>
   results.map((result: any) => result.status === 'fulfilled' && deepCopy(result.value));

// const getAutomations = (token?: string) => {
//    return fetchDbApi(`/api/v2/automations`, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//    }).catch((err: any) => {
//       console.log('err:', err);
//    });
// };
