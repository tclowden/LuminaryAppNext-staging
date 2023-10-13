import React from 'react';
import Breadcrumbs from '../../../../../features/components/breadcrumbs/Breadcrumbs';
import PermissionsSetsClient from './PermissionSetsClient';

const Permissions = () => {
   return (
      <>
         <Breadcrumbs></Breadcrumbs>
         <PermissionsSetsClient />
      </>
   );
};

export default Permissions;
