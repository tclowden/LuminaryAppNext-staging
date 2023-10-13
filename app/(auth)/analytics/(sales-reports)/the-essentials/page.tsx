import PageProvider from '@/providers/PageProvider';
import { cookies } from 'next/headers';
import React from 'react';
import Breadcrumbs from '../../../../../features/components/breadcrumbs/Breadcrumbs';
import EssentialsReport from './EssentialsReport';

export const dynamic = 'force-dynamic';

const EssentialsReportPage = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const reportData = await fetchEssentialsReport(authToken);
   const intervalOptions = [
      { option: 'Today' },
      { option: 'Yesterday' },
      { option: 'Last Full Week' },
      { option: 'Month To Date' },
      { option: 'Last Full Month' },
      { option: 'Year To Date' },
      { option: 'Six Week Rolling' },
   ];
   return (
      <PageProvider>
         <EssentialsReport reportData={reportData} intervalOptions={intervalOptions}></EssentialsReport>
      </PageProvider>
   );
};

export default EssentialsReportPage;

async function fetchEssentialsReport(authToken: string | undefined) {
   try {
      const report = await fetch(`${process.env.CLIENT_SITE}/api/v2/analytics/reports/essentials`, {
         method: 'GET',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
         cache: 'no-store',
      });
      return await report.json();
   } catch (error) {
      console.log(error);
   }
}
