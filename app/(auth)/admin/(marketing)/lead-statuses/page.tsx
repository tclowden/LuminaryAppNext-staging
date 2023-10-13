import React from 'react';
import LeadStatusesClient from './LeadStatusesClient';
import { fetchDbApi } from '@/serverActions';

const LeadStatuses = async () => {
   const statusesWithTypes: any = await fetchDbApi(`${process.env.CLIENT_SITE}/api/v2/statuses/status-modal-configs`, {
      method: 'GET',
      cache: 'no-store',
   }).then((response) => response);

   return <LeadStatusesClient statusesWithTypes={statusesWithTypes} />;
};

export default LeadStatuses;
