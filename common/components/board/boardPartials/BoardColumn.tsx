import React from 'react';
import { DEFAULT_COLUMN_SIZE } from '../boardTypes';

interface Props {
   columnHeight?: number;
   children: React.ReactNode;
   columnCount: number;
}

const BoardColumn = ({ children, columnHeight, columnCount }: Props) => {
   const colMinWidth = `${DEFAULT_COLUMN_SIZE * columnCount}px`;

   return (
      <div
         className='flex flex-col gap-y-2 bg-lum-gray-50 dark:bg-lum-gray-750 overflow-y-auto px-2 py-2 rounded'
         style={{
            ...(columnHeight && { maxHeight: columnHeight }),
            minWidth: colMinWidth,
         }}>
         {children}
      </div>
   );
};

export default BoardColumn;
