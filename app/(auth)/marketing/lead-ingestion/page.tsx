import React from 'react'
// import { cookies } from 'next/headers';
import LeadIngestion from './pageNav';
import PageProvider from '../../../../providers/PageProvider';

import { fetchDbApi } from '../../../../serverActions/fetchDbApi';

const Page = async () => {

   const allEndpoints = await fetchDbApi(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/leadIngestion/endpoints`, {
      method: 'GET',
   }).then(res => {
      return res;
   }).catch((err) => console.error('err', err));

   return (
      <PageProvider>
         <LeadIngestion endpoints={allEndpoints}></LeadIngestion>
      </PageProvider>
   );
};

export default Page;
