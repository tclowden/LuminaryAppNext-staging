import Icon from '@/common/components/Icon';
import TableCellLink from '@/common/components/table-cell-link/TableCellLink';
import Table from '@/common/components/table/Table';
import { ColumnType } from '@/common/components/table/tableTypes';
import { getObjectProp } from '@/utilities/helpers';

type Props = {
   callLogs: Array<any>;
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
               <Icon name={'PhoneInbound'} color={'gray'} width={14} />
               Inbound Call
            </div>
         ) : (
            <div className='flex items-center gap-[10px]'>
               <Icon name={'PhoneOutbound'} color={'blue'} width={14} />
               Outbound Call
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
      title: 'Duration',
      render: ({ item }) => {
         const formattedDuration = new Date(item['duration'] * 1000).toISOString().substring(14, 19);
         return formattedDuration[0] === '0'
            ? formattedDuration.substring(1, formattedDuration.length)
            : formattedDuration;
      },
   },
   {
      title: 'Call Recording',
      render: ({ item }) => {
         return item?.recordingUrl ? (
            <div className='flex'>
               <audio controls src={item.recordingUrl} />
            </div>
         ) : (
            <span className='text-lum-gray-300'>N/A</span>
         );
      },
   },
];

const CallsTable = ({ callLogs }: Props) => {
   return <Table data={callLogs} columns={tableColumns} showEmptyState emptyStateDisplayText='No Call Logs' />;
};

export default CallsTable;
