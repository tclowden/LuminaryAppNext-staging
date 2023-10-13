'use client';
import React, { useState } from 'react';
import TableCellLink from '../../../../../common/components/table-cell-link/TableCellLink';
import Table from '../../../../../common/components/table/Table';
import { ColumnType, PaginationOptions } from '../../../../../common/components/table/tableTypes';

const columns: ColumnType[] = [
   {
      keyPath: ['fullName'],
      title: 'Lead Name',
      colSpan: 1,
      render: ({ item }) => {
         return <TableCellLink path={`/marketing/leads/${item?.id}`}>{item?.fullName}</TableCellLink>;
      },
   },
   { keyPath: ['phoneNumber'], title: 'Phone Number', colSpan: 1 },
   { keyPath: ['status', 'name'], title: 'Status', colSpan: 1 },
   { keyPath: ['lastAppointment', 'appointmentTime'], title: 'Last Appointment', colSpan: 1 },
];

interface Props {
   usersPipe: Array<any>;
}

const ListView = ({ usersPipe }: Props) => {
   const [paginationOptions, setPaginationOptions] = useState({
      rowsPerPage: 15,
      selectAllRows: true,
   });

   const handleActionClick = ({ event, actionKey, item }: any) => {
      switch (actionKey) {
         case 'edit':
            break;
         case 'delete':
            break;
         default:
            break;
      }
   };

   return (
      <Table
         actions={[
            { icon: 'PhoneAngled', actionKey: 'call', toolTip: 'Call Lead', callback: handleActionClick },
            { icon: 'Messages', actionKey: 'message', toolTip: 'Message Lead', callback: handleActionClick },
            // { icon: 'Duplicate', actionKey: 'duplicate', toolTip: 'Duplicate Role', callback: handleActionClick },
         ]}
         columns={columns}
         data={usersPipe}
         pagination
         // paginationOptions={paginationOptions}
         // onPaginationOptionsChange={(paginationOptions: PaginationOptions) => {
         //    setPaginationOptions(paginationOptions);
         // }}
         // onTableSort={onTableSort}
         // sortingConfig={sortConfig}
      />
   );
};

export default ListView;
