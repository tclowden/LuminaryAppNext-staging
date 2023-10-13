'use client';
import React from 'react';
import { getObjectProp } from '../../../../utilities/helpers';
import { ColumnType } from '../boardTypes';

interface Props {
   item: any;
   column: ColumnType;
   onCellEvent?: ({ event, item, column }: { event: any; item: any; column: any }) => void;
}

const BoardCard = ({ item, column, onCellEvent }: Props) => {
   const DEFAULT_COLUMN_SIZE: number = 130;

   const callback = (event: any) => {
      onCellEvent && onCellEvent({ event, item, column });
   };

   let value;
   if (column.render) value = column.render({ column, item, callback });
   else if (column.keyPath && !!getObjectProp(item, column.keyPath)) {
      value = getObjectProp(item, column.keyPath);
   } else value = <span className='text-lum-gray-300'>N/A</span>;

   const colSpan = column?.colSpan || 1;
   let COLUMN_COUNT = 1;
   if (colSpan >= 1 && colSpan <= 12) COLUMN_COUNT = colSpan;
   else if (colSpan < 1) COLUMN_COUNT = 1;
   else if (colSpan > 12) COLUMN_COUNT = 12;

   return (
      <div
         className='board-card-container'
         style={{
            minWidth: `${DEFAULT_COLUMN_SIZE * COLUMN_COUNT}px`,
         }}>
         <span>{value}</span>
      </div>
   );
};

export default BoardCard;
