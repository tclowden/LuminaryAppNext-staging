'use client';
import Icon from '@/common/components/Icon';

import { DataType } from '@/common/components/table/tableTypes';

const renderCustomerName = ({ item }: { item: DataType }) => (
   <div className='w-full'>
      <span className='block ml-2 text-lum-primary font-medium'>{item.def.extendedProps.customerName}</span>
   </div>
);

const renderInstallTeam = ({ item }: { item: DataType }) => (
   <div className='w-full '>
      <span className='block ml-2 text-lum-primary font-medium'>{item.def.extendedProps.installTeam}</span>
   </div>
);

const renderInstallAddress = ({ item }: { item: DataType }) => (
   <div className='w-full '>
      <span className='block ml-2 text-lum-gray-700 dark:text-lum-white font-medium'>{item.def.extendedProps.installAddress}</span>
   </div>
)
;

const renderApptTime = ({ item }: { item: DataType }) => {
   const startDate = new Date(item.def.extendedProps.start);
   const endDate = new Date(item.def.extendedProps.end);
 
   const startTime = startDate.toLocaleTimeString('en-US', { hour12: false });
   const endTime = endDate.toLocaleTimeString('en-US', { hour12: false });
 
   const startDateStr = startDate.toLocaleDateString('en-US');
   const endDateStr = endDate.toLocaleDateString('en-US');
 
   const showEndDate = startDateStr !== endDateStr;
 
   return (
     <div className='w-full flex items-center'>
       <Icon name={'Clock'} width={18} height={18} color='gray:300' />
       <span className='block ml-2'>
         {startTime} {showEndDate ? `- ${endTime} (${endDateStr})` : `- ${endTime}`}
       </span>
     </div>
   );
 };

export const InstallDayViewColumns = [
   {
      keyPath: ['customerName'],
      title: 'Customer Name',
      colSpan: 1,
      sortable: true,
      render: renderCustomerName,
   },
   {
      keyPath: ['installAddress'],
      title: 'Install Address',
      colSpan: 2,
      render: renderInstallAddress,
   },
   {
      keyPath: ['installTeam'],
      title: 'Install Team',
      colSpan: 1,
      render: renderInstallTeam,
   },
   {
      keyPath: ['installTime'],
      title: 'Install Time',
      colSpan: 2,
      render: renderApptTime,
   },
];
