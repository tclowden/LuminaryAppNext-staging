'use client';
import React, { useEffect } from 'react';
import PageContainer from '@/common/components/page-container/PageContainer';
import AdminDashboard from './(partials)/AdminDashboard';
import SalesTeamDash from './(partials)/SalesTeamDashboard';
import DefaultDashboard from './(partials)/DefaultDashboard'; // Import your default component
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { selectUserHasPermission } from '@/store/slices/user';

const SALES_DASHBOARD_PERMISSION = 'eada8239-0617-4423-847a-f75dfee94cb0';
const ADMIN_DASHBOARD_PERMISSION = 'ee5fa96f-e9b9-48ce-8d88-a85838021ad5';

const DashboardClient = () => {
   const user = useAppSelector(selectUser);

   const canViewSalesDashboard = selectUserHasPermission(user, SALES_DASHBOARD_PERMISSION);
   const canViewAdminDashboard = selectUserHasPermission(user, ADMIN_DASHBOARD_PERMISSION);

   // Create new variable for when canViewSalesDashboard is true and canViewAdminDashboard is true
   const canViewBothDashboards = canViewSalesDashboard && canViewAdminDashboard;

   return (
      <PageContainer>
         {/* Use conditional logic here to render based on your criteria */}
         {canViewBothDashboards ? (
            <>
               <AdminDashboard user={user} />
            </>
         ) : canViewAdminDashboard ? (
            <AdminDashboard user={user} />
         ) : canViewSalesDashboard ? (
            <SalesTeamDash user={user} />
         ) : (
            <DefaultDashboard user={user} />
         )}
      </PageContainer>
   );
};

export default DashboardClient;
