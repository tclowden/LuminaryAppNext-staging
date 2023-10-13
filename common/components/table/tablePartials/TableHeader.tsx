import React from 'react';
import { ActionsType, ColumnType, DEFAULT_COLUMN_SIZE, SortingConfiguration, SortingType } from '../tableTypes';
import TableRow from './TableRow';
import Icon from '../../Icon';
import Checkbox from '../../checkbox/Checkbox';

interface Props {
   actions?: ActionsType[];
   stickyActions?: boolean;
   columns: ColumnType[];
   sortingConfig?: SortingConfiguration;
   onTableSort?: (column: ColumnType, direction: SortingType) => void;
   fixedHeader?: boolean;
   allRowsSelectable?: boolean;
   onRowsSelect?: (e: any, allRowsChecked: boolean) => void;
   selectableRowsChecked?: boolean;
   theme?: 'secondary' | 'list';
}

const TableHeader = ({
   actions,
   columns,
   onTableSort,
   fixedHeader,
   sortingConfig,
   allRowsSelectable,
   onRowsSelect,
   selectableRowsChecked,
   theme,
   stickyActions,
}: Props) => {
   return (
      <TableRow actions={actions} columnCount={columns.length} columns={columns}>
         {columns?.map((column, i) => {
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
                        ${column.sortable ? 'hover:bg-lum-white hover:dark:bg-lum-gray-600 cursor-pointer' : ''}
                        ${
                           column.title === sortingConfig?.column.title && column.sortable
                              ? 'bg-lum-white text-lum-gray-700 dark:bg-lum-gray-600 dark:text-lum-white'
                              : 'bg-lum-gray-50 text-lum-gray-500 dark:bg-lum-gray-650 dark:text-lum-gray-300'
                        }
                        ${fixedHeader ? 'drop-shadow-[0_2px_1px_rgba(0,0,0,0.14)]' : ''}
                        ${theme === 'secondary' && 'bg-lum-gray-100'}
                        ${theme === 'list' && 'bg-transparent dark:bg-transparent'}
                     `}
                  style={{ minWidth: `${DEFAULT_COLUMN_SIZE * COLUMN_COUNT}px` }}
                  onClick={(e: any) => {
                     if (!column.sortable) return;
                     const directionToSort =
                        sortingConfig?.sortType === SortingType.ASC ? SortingType.DESC : SortingType.ASC;
                     onTableSort && onTableSort(column, directionToSort);
                  }}>
                  <span
                     className={`
                     flex flex-row items-center w-full h-full
                     ${column.textCenter ? 'justify-center gap-x-1' : ''}
                  `}>
                     {allRowsSelectable && i == 0 && (
                        <Checkbox
                           checked={selectableRowsChecked || false}
                           onChange={(e: any) => {
                              onRowsSelect && onRowsSelect(e, selectableRowsChecked || false);
                           }}
                        />
                     )}
                     <span className={!column.textCenter ? 'flex-1' : ''}>{column.title}</span>
                     {sortingConfig && column.sortable && column.title === sortingConfig.column.title && (
                        <Icon
                           name='DownArrow'
                           style={{
                              transform: `rotate(${sortingConfig.sortType === SortingType.ASC ? '180deg' : '0deg'})`,
                              marginTop: sortingConfig.sortType === SortingType.ASC ? '-2px' : '',
                           }}
                           className='w-[12px] h-[13px]'
                        />
                     )}
                  </span>
               </div>
            );
         })}
         {actions && actions.length && (
            <div
               // border-[1px] border-lum-gray-100 dark:border-lum-gray-800
               className={`
                     first:pl-4 rounded-r-sm pl-2 pr-2 text-left h-[30px] font-medium text-[12px] z-[5] truncate w-full bg-lum-gray-50 dark:bg-lum-gray-650 text-lum-gray-500 dark:text-lum-gray-300
                     ${fixedHeader ? 'drop-shadow-[0_2px_1px_rgba(0,0,0,0.14)]' : ''}
                     ${stickyActions ? 'sticky right-0' : ''}
                     ${theme === 'secondary' && 'bg-lum-gray-100 dark:bg-lum-gray-650'}
                     ${theme === 'list' && 'bg-transparent dark:bg-transparent'}
                  `}
               style={{ minWidth: `${DEFAULT_COLUMN_SIZE}px` }}>
               <span className={`flex flex-row items-center w-full h-full flex-1 justify-between`}>
                  <span>Actions</span>
               </span>
            </div>
         )}
      </TableRow>
   );
};

export default TableHeader;
