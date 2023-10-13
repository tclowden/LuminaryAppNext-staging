import TableCellLink from '@/common/components/table-cell-link/TableCellLink';
import Table from '@/common/components/table/Table';
import { ColumnType } from '@/common/components/table/tableTypes';
import { getObjectProp } from '@/utilities/helpers';

type Props = {
   auditLogs: Array<any>;
};

const tableColumns: Array<ColumnType> = [
   {
      title: 'Lead',
      render: ({ item }: { item: any }) => {
         return (
            <TableCellLink path={`/marketing/leads/${getObjectProp(item, ['updatedRecord', 'id'])}`}>
               {getObjectProp(item, ['updatedRecord', 'fullName'])}
            </TableCellLink>
         );
      },
   },
   {
      title: 'Date & Time',
      render: ({ item }) => {
         const formattedDate = new Date(item['modifiedAt']).toLocaleDateString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
         });
         return formattedDate;
      },
   },
   {
      title: 'Status Changed From',
      render: ({ item }) => {
         try {
            const parsedOriginalValue = JSON.parse(item?.originalValue);
            if (parsedOriginalValue?.statusName) return parsedOriginalValue?.statusName;
            throw new Error('Value does not exist. Display N/A instead');
         } catch (err: any) {
            return <span className='text-lum-gray-300'>N/A</span>;
         }
      },
   },
   {
      title: 'Status Changed To',
      render: ({ item }) => {
         try {
            const parsedNewValue = JSON.parse(item?.newValue);
            if (parsedNewValue?.statusName) return parsedNewValue?.statusName;
            throw new Error('Value does not exist. Display N/A instead');
         } catch (err: any) {
            return <span className='text-lum-gray-300'>N/A</span>;
         }
      },
   },
];

const StatusUpdatesTable = ({ auditLogs }: Props) => {
   return <Table data={auditLogs} columns={tableColumns} showEmptyState emptyStateDisplayText='No Status Updates' />;
};

export default StatusUpdatesTable;
