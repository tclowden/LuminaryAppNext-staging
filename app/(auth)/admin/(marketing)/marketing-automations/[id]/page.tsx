import PageContainer from '@/common/components/page-container/PageContainer';
import Automations from '@/features/components/automations/Automations';
import PageProvider from '@/providers/PageProvider';
import { fetchDbApi } from '@/serverActions';
import { get } from 'cypress/types/lodash';
import React from 'react';


const getAutomation = async (id: string) => {
   if (id === 'new') return null

   return fetchDbApi(`/api/v2/automations/${id}`, {
      method: 'GET',
   }).then(res => {
      return res
   }).catch(err => {
      console.log(err);
      return null
   });
}

const MarketingAutomation = async ({ params }: { params: { id: string } }) => {
   const automationData = await getAutomation(params.id)

   return (
      <PageProvider>
         <Automations type='marketing' automationData={automationData} />
      </PageProvider>
   );
};

export default MarketingAutomation;
