import React from 'react';
import { DEFAULT_COLUMN_SIZE } from '../boardTypes';
import BoardRow from './BoardRow';

interface Props {
   columns: Array<any>;
   fixedHeader?: boolean;
   columnMinWidth?: number;
}

const BoardHeader = ({ columns, fixedHeader, columnMinWidth }: Props) => {
   return (
      <BoardRow columns={columns} className={`bg-lum-gray-50 dark:dark:bg-lum-gray-650 mb-[2px]`}>
         {columns?.map((column: any, i: number) => {
            const colSpan = column.colSpan || 1;
            let COLUMN_COUNT = 1;
            if (colSpan >= 1 && colSpan <= 12) COLUMN_COUNT = colSpan;
            else if (colSpan < 1) COLUMN_COUNT = 1;
            else if (colSpan > 12) COLUMN_COUNT = 12;

            return (
               <div
                  key={i}
                  className={`
                     first:rounded-l-sm last:rounded-r-sm pl-2 pr-2 text-left h-[30px] font-medium text-[12px] z-[5] truncate w-full
                     ${!column.textCenter ? 'first:pl-4' : ''}
                     bg-lum-gray-50 text-lum-gray-500 dark:bg-lum-gray-650 dark:text-lum-gray-300
                     ${fixedHeader ? 'drop-shadow-[0_2px_1px_rgba(0,0,0,0.14)]' : ''}
                  `}
                  style={{ minWidth: `${DEFAULT_COLUMN_SIZE * COLUMN_COUNT}px` }}>
                  <span
                     className={`
                        flex flex-row items-center w-full h-full
                        ${column?.textCenter ? 'justify-center gap-x-1' : ''}
                     `}>
                     <span className={!column.textCenter ? 'flex-1' : ''}>{column.title}</span>
                  </span>
               </div>
            );
         })}
      </BoardRow>
   );
};

export default BoardHeader;
