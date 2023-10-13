'use client';
import React from 'react';
import Table from '../../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../../common/components/table/tableTypes';
import { defaultLeadsInPipe } from './dummyData';

const columns: ColumnType[] = [
   { keyPath: ['leadName'], title: 'Lead Name', colSpan: 1 },
   { keyPath: ['phoneNumber'], title: 'Phone Number', colSpan: 1 },
   { keyPath: ['status', 'name'], title: 'Status', colSpan: 1 },
   { keyPath: ['leadSource', 'name'], title: 'Lead Source', colSpan: 1 },
   { keyPath: ['callCount'], title: 'Calls', colSpan: 1 },
   { keyPath: ['lastCall'], title: 'Last Call', colSpan: 1 },
   { keyPath: ['nextAppt'], title: 'Next Appointment', colSpan: 1 },
   { keyPath: ['address'], title: 'Address', colSpan: 2 },
];

interface Props {}

const LeadsInPipe = ({}: Props) => {
   const handleActionClick = ({}: { event: Event; actionKey: string; item: any }) => {};

   return (
      <Table
         columns={columns}
         data={defaultLeadsInPipe}
         actions={[
            { icon: 'PhoneAngled', actionKey: 'call', toolTip: 'Call Lead', callback: handleActionClick },
            { icon: 'MessagesEdit', actionKey: 'message', toolTip: 'Message Lead', callback: handleActionClick },
         ]}
      />
   );
};

export default LeadsInPipe;
