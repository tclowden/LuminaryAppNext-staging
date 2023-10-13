import React from 'react';
import { ActionsType, ColumnType, DEFAULT_COLUMN_SIZE } from '../tableTypes';

interface Props {
   actions?: ActionsType[];
   children: React.ReactNode;
   columnCount: number;
   columns: ColumnType[];
}

const TableRow = ({ actions, children, columnCount, columns }: Props) => {
   let gridColumns = columns
      .map((col) => {
         if (col.fixedWidth) return `${(col.colSpan || 1) * DEFAULT_COLUMN_SIZE}px`;
         else return `${col.colSpan || 1}fr`;
      })
      .join(' ');

   if (actions && actions.length) gridColumns += ` ${DEFAULT_COLUMN_SIZE}px`;

   return (
      <div
         className='gap-[1px]'
         style={{
            display: 'grid',
            gridTemplateColumns: `${gridColumns}`,
            position: 'relative',
         }}>
         {children}
      </div>
   );
};

export default TableRow;
