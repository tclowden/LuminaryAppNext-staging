import React from 'react';
import PageProvider from '@/providers/PageProvider';
import MarketingAutomationsClient from './MarketingAutomationsClient';
import { fetchDbApi } from '@/serverActions';

const MarketingAutomations = async () => {
   const automations = getAutomations();
   const automationCount = getAutomationsCount();
   const [automationsArr, automationCountNum] = await Promise.all([automations, automationCount]);

   return (
      <PageProvider>
         <MarketingAutomationsClient allAutomations={automationsArr} automationCount={automationCountNum} />
      </PageProvider>
   );
};

export default MarketingAutomations;

const getAutomations = () => {
   return fetchDbApi(`/api/v2/automations/query?type=marketing`, {
      method: 'POST',
      cache: 'no-store',
      body: JSON.stringify({
         limit: 100,
         offset: 0,
         order: [['createdAt', 'DESC']],
      }),
   }).catch((err) => {
      console.log('err:', err);
   });
};

const getAutomationsCount: any = async () => {
   return await fetchDbApi(`/api/v2/automations/count?type=marketing`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => {
      console.log('err:', err);
   });
};