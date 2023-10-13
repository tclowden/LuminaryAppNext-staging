import Icon from '@/common/components/Icon';
import TableCellLink from '@/common/components/table-cell-link/TableCellLink';
import Table from '@/common/components/table/Table';
import { ColumnType } from '@/common/components/table/tableTypes';
import { getObjectProp } from '@/utilities/helpers';

type Props = {
   smsLogs: Array<any>;
};

const tableColumns: Array<ColumnType> = [
   {
      title: 'Activity',
      render: ({ item }: { item: any }) => {
         const direction = item?.direction?.toLowerCase();
         if (!direction || !['inbound', 'outbound'].includes(direction))
            return <span className='text-lum-gray-300'>N/A</span>;

         return direction === 'inbound' ? (
            <div className='flex items-center gap-[10px]'>
               <Icon name={'MessageReceived'} color={'gray'} width={14} />
               Received
            </div>
         ) : (
            <div className='flex items-center gap-[10px]'>
               <Icon name={'MessagesEdit'} color={'blue'} width={14} />
               Sent
            </div>
         );
      },
   },
   {
      title: 'Lead / Phone Number',
      render: ({ item }: { item: any }) => {
         return (
            <TableCellLink path={`/marketing/leads/${getObjectProp(item, ['lead', 'id'])}`}>
               {getObjectProp(item, ['lead', 'fullName'], item?.lead?.phoneNumber)}
            </TableCellLink>
         );
      },
   },
   {
      title: 'Date & Time',
      render: ({ item }) => {
         const formattedDate = new Date(item['createdAt']).toLocaleDateString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
         });
         return formattedDate;
      },
   },
   {
      colSpan: 3,
      title: 'Message',
      render: ({ item }) => {
         return item?.body;
      },
   },
];

const TextsTable = ({ smsLogs }: Props) => {
   return <Table data={smsLogs} columns={tableColumns} showEmptyState emptyStateDisplayText='No Text Logs' />;
};

export default TextsTable;
