'use client';
import React from 'react';
import Table from '../../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../../common/components/table/tableTypes';
import { defaultCustomers } from './dummyData';

const columns: ColumnType[] = [
   { keyPath: ['customerName'], title: 'Customer Name', colSpan: 1 },
   { keyPath: ['phoneNumber'], title: 'Phone Number', colSpan: 1 },
   { keyPath: ['status', 'name'], title: 'Status', colSpan: 1 },
   { keyPath: ['leadSource', 'name'], title: 'Lead Source', colSpan: 1 },
   { keyPath: ['callCount'], title: 'Calls', colSpan: 1 },
   { keyPath: ['lastCall'], title: 'Last Call', colSpan: 1 },
   { keyPath: ['purchaseDate'], title: 'Purchase Date', colSpan: 1 },
   { keyPath: ['address'], title: 'Address', colSpan: 2 },
];

interface Props {}

const Customers = ({}: Props) => {
   const handleActionClick = ({}: { event: Event; actionKey: string; item: any }) => {};

   return (
      <Table
         columns={columns}
         data={defaultCustomers}
         actions={[
            { icon: 'PhoneAngled', actionKey: 'call', toolTip: 'Call Customer', callback: handleActionClick },
            { icon: 'MessagesEdit', actionKey: 'message', toolTip: 'Message Customer', callback: handleActionClick },
         ]}
      />
   );
};

export default Customers;
