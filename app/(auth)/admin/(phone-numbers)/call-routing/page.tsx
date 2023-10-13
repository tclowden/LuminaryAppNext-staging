import { fetchDbApi } from '@/serverActions';
import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import CallRoutesClient from './CallRoutesClient';

const CallRouting = async () => {
   const callRoutesData = await fetchDbApi(`/api/v2/call-routes`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));

   return (
      <PageProvider>
         <CallRoutesClient callRoutesData={callRoutesData?.length ? callRoutesData : []} />
      </PageProvider>
   );
};

export default CallRouting;
