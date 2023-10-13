'use client';
import { useState, memo } from 'react';

import Icon from '@/common/components/Icon';

import { DataType } from '@/common/components/table/tableTypes';

interface ToggleIconCellProps {
   item: DataType;
   field: string;
}

const ToggleIconCell = memo(({ item, field }: ToggleIconCellProps) => {
   const [toggle, setToggle] = useState(item.def.extendedProps[field]);

   return (
      <div className='w-full'>
         <Icon
            name={toggle ? 'CheckMarkCircle' : 'XMarkCircle'}
            width={20}
            height={20}
            color={toggle ? 'green' : 'gray'}
            style={{ cursor: 'default' }}
         />
      </div>
   );
});

ToggleIconCell.displayName = 'ToggleIconCell';

const renderCustomerName = ({ item }: { item: DataType }) => (
   <div className='w-full'>
      <span className='block ml-2 text-lum-primary font-medium'>{item.def.extendedProps.customerName}</span>
   </div>
);

const renderConsultant = ({ item }: { item: DataType }) => (
   <div className='w-full '>
      <span className='block ml-2 text-lum-primary font-medium'>{item.def.extendedProps.consultant}</span>
   </div>
);

const renderApptTime = ({ item }: { item: DataType }) => (
   <div className='w-full flex items-center'>
      <Icon name={'Clock'} width={18} height={18} color='gray:300' />
      <span className='block ml-2'>{new Date(item.def.extendedProps.start).toLocaleTimeString()} - {new Date(item.def.extendedProps.end).toLocaleTimeString()}</span>
   </div>
);

export const PitchDayViewColumns = [
   {
      keyPath: ['customerName'],
      title: 'Customer Name',
      colSpan: 2,
      sortable: true,
      render: renderCustomerName,
   },
   {
      keyPath: ['consultant'],
      title: 'Consultant',
      colSpan: 2,
      render: renderConsultant,
   },
   {
      keyPath: ['apptTime'],
      title: 'Appt Time',
      colSpan: 2,
      render: renderApptTime,
   },
   {
      keyPath: ['appointmentKept'],
      title: 'Appointment Kept?',
      colSpan: 1,
      render: ({ item }: { item: DataType }) => <ToggleIconCell item={item} field='kept' />,
   },
];
