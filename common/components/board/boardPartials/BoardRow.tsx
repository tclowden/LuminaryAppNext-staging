import React from 'react';
import { twMerge } from 'tailwind-merge';
import { DEFAULT_COLUMN_SIZE } from '../boardTypes';

interface Props {
   columns: Array<any>;
   className?: string;
   children: React.ReactNode;
}

const BoardRow = ({ columns, children, className }: Props) => {
   let gridColumns = columns
      .map((col: any) => {
         if (col.fixedWidth) return `${(col.colSpan || 1) * DEFAULT_COLUMN_SIZE}px`;
         else return `${col.colSpan || 1}fr`;
      })
      .join(' ');

   return (
      <div
         className={twMerge(`
            gap-[2px]
            ${className && className}
         `)}
         style={{
            display: 'grid',
            gridTemplateColumns: `${gridColumns}`,
            position: 'relative',
         }}>
         {children}
      </div>
   );
};

export default BoardRow;
