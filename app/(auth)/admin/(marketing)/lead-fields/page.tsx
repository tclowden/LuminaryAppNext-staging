import { fetchDbApi } from '@/serverActions';
import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import LeadFieldsClient from './LeadFieldsClient';

const LeadFields = async () => {
   const leadFieldsData: any = await fetchDbApi(`/api/v2/leads/lead-fields`, {
      method: 'GET',
   }).catch((err) => console.error('err', err));

   return (
      <PageProvider>
         <LeadFieldsClient leadFieldsData={!!leadFieldsData?.length ? leadFieldsData : []} />
      </PageProvider>
   );
};

export default LeadFields;
