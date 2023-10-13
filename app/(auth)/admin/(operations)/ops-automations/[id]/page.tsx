import React from 'react';
import PageProvider from '@/providers/PageProvider';
import Automations from '@/features/components/automations/Automations';
import { fetchDbApi } from '@/serverActions';


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

const OpsAutomation = async ({ params }: { params: { id: string } }) => {
   const automationData = await getAutomation(params.id)

   return (
      <PageProvider>
         <Automations type='operations' automationData={automationData}/>
      </PageProvider>
   );
};

export default OpsAutomation;
