import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../providers/PageProvider';
import DashboardClient from './DashboardClient';

const Dashboard = async () => {
   const nextCookies = cookies();

   return (
      <PageProvider>
         <DashboardClient />
      </PageProvider>
   );
};

export default Dashboard;
