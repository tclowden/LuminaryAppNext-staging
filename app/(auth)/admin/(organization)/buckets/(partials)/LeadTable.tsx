'use client';
import { ColumnType } from '../../../../../../common/components/table/tableTypes';
import TableCellLink from '../../../../../../common/components/table-cell-link/TableCellLink';
import Table from '../../../../../../common/components/table/Table';
import { PaginationOptions } from '../../../../../../common/components/table/tableTypes';
import { Bucket, Lead } from './types';

// Column definitions
const columns: ColumnType[] = [
   {
      keyPath: ['fullName'],
      title: 'Lead Name',
      colSpan: 1,
      render: ({ item }: { item: Lead }) => (
         <TableCellLink path={`/marketing/leads/${item.id}`}>{`${item.firstName} ${item.lastName}`}</TableCellLink>
      ),
   },
   { keyPath: ['phoneNumber'], title: 'Phone Number', colSpan: 1 },
   { keyPath: ['status.name'], title: 'Status', colSpan: 1 },
   { keyPath: ['leadSource.name'], title: 'Lead Source', colSpan: 1 },
   { keyPath: ['createdAt'], title: 'Created At', colSpan: 1 },
];

type Props = {
   bucketLeads: any[];
   isLeadsTableLoading: boolean;
};
// LeadTable component
const LeadTable = ({ bucketLeads, isLeadsTableLoading }: Props) => {
   return (
      <Table
         isLoading={isLeadsTableLoading}
         pagination
         data={bucketLeads || []}
         columns={columns}
         onPaginate={() => {
            console.log('PAGE');
         }}></Table>
   );
};

export default LeadTable;
