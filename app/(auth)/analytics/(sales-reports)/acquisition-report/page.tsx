import PageProvider from '@/providers/PageProvider';
import { cookies } from 'next/headers';
import React from 'react';
import Breadcrumbs from '@/features/components/breadcrumbs/Breadcrumbs';
import AcquisitionReport from './AcquisitionReport';

const Page = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const reportData = await fetchAcquisitionReport(authToken);
   console.log(reportData.rows);

   return (
      <PageProvider>
         <Breadcrumbs></Breadcrumbs>
         <AcquisitionReport reportData={reportData.rows} />
      </PageProvider>
   );
};

export default Page;

async function fetchAcquisitionReport(authToken: string | undefined) {
   try {
      const report = await fetch(`${process.env.CLIENT_SITE}/api/v2/analytics/reports/acquisition`, {
         method: 'GET',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
         cache: 'no-store',
      });
      return await report.json();
   } catch (error) {
      console.log(error);
   }
}
