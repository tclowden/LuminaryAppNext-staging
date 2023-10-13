import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { getObjectProp, setObjectProp } from '../../../utilities/helpers';
import LoadingSpinner from '../loaders/loading-spinner/LoadingSpinner';
import PaginationBar from './tablePartials/PaginationBar';
import TableBody from './tablePartials/TableBody';
import TableHeader from './tablePartials/TableHeader';

import {
   ActionsType,
   ColumnType,
   DataType,
   DEFAULT_COLUMN_SIZE,
   PaginationOptions,
   PaginationPageState,
   SortingConfiguration,
   SortingType,
} from './tableTypes';

const defaultPaginationOptions: PaginationOptions = { rowsPerPage: 15, selectAllRows: true };

interface Props {
   data: DataType[] | object[];
   columns: ColumnType[];
   actions?: ActionsType[];
   stickyActions?: boolean;
   tableHeight?: number; // must set a table height for the fixed header to work...
   theme?: 'secondary' | 'list';

   expandableRows?: boolean;
   // need this to be an object..
   // timestamp allows the client to rerender if you wanted to set false to false or true to true
   // if it's just a boolean & you had 1 row open & then wanted to collapse all the rows, it wouldn't work because you'd be setting the same state inside the parent component
   // use 'RoleClient.tsx' as an example
   expandAllRows?: { value: boolean; timestamp: Date };

   // all sorting configuration
   sortingConfig?: SortingConfiguration;
   onTableSort?: (column: ColumnType, direction: SortingType, sortedData: Array<any>) => void;

   // when using the moveup/movedown btns... automatically handle the logic
   rowReorder?: boolean;
   rowReorderKeyPath?: Array<string>;

   // header configuration
   fixedHeader?: boolean;
   hideHeader?: boolean;

   // table title configuration
   tableTitle?: string;
   tableTitleClassName?: string;

   // Empty State configuration
   showEmptyState?: boolean;
   emptyStateDisplayText?: string;

   // Loading State Configuration
   isLoading?: boolean;
   loadingTableHeight?: number;

   // all pagination props
   pagination?: boolean;
   onPaginate?: (paginationOptions: PaginationOptions, pageState: PaginationPageState) => void; // whenever the user turns the page to load more data on the table, this is the callback
   paginationTotalCount?: number;
   // onPaginate?: (paginationOptions: PaginationOptions, pageToNavigateTo: number) => void; // whenever the user turns the page to load more data on the table, this is the callback
   // // depricated props, for now... simplicity sakes
   // paginationOptions?: PaginationOptions;
   // onPaginationOptionsChange?: (paginationOptions: PaginationOptions) => void;

   // render function callback
   // any sort of event that happens on the cell (click, change, onMouseEnter, etc...)
   onCellEvent?: ({ event, item, column }: { event: any; item: any; column: any }) => void;

   // all checkbox row configuration
   selectableRows?: boolean;
   allRowsSelectable?: boolean;
   onRowsSelect?: (e: any, rowsSelected: Array<any>, allRowsChecked?: boolean) => void;
   selectableRowsKey?: string;
}

const Table = React.forwardRef(
   (
      {
         actions,
         columns,
         data,
         sortingConfig,
         onTableSort,
         rowReorder,
         rowReorderKeyPath,
         fixedHeader,
         tableHeight,
         pagination,
         paginationTotalCount,
         onPaginate,
         // paginationOptions,
         // onPaginationOptionsChange,
         tableTitle,
         tableTitleClassName,
         showEmptyState = true,
         emptyStateDisplayText = 'No Table Data',
         isLoading,
         loadingTableHeight,
         expandableRows,
         expandAllRows,
         onCellEvent,
         theme,
         selectableRows,
         allRowsSelectable,
         onRowsSelect,
         selectableRowsKey,
         hideHeader,
         stickyActions = true,
      }: Props,
      ref: any
   ) => {
      const [paginationIndex, setPaginationIndex] = useState<number>(0);

      if (paginationTotalCount) defaultPaginationOptions['totalCount'] = paginationTotalCount;
      else delete defaultPaginationOptions['totalCount'];
      const [paginationOptions, setPaginationOptions] = useState<PaginationOptions>(defaultPaginationOptions);
      const [activePage, setActivePage] = useState(1);

      // const [tableRows, setTableRows] = useState<Array<any>>([]);
      // useEffect(() => {
      //    if (!!data?.length && !tableRows?.length) setTableRows(data);
      // }, [data, tableRows]);

      const colSpans = columns.reduce((acc, curr) => acc + (curr.colSpan || 1), 0);
      const tableMinWidth = DEFAULT_COLUMN_SIZE * colSpans;

      const handleTableSort = (column: ColumnType, direction: SortingType) => {
         const sortData = (column: ColumnType, direction: SortingType, dataToSort: Array<any>) => {
            return [...dataToSort]
               .map((d) => {
                  if (d?.expandableData?.length && sortingConfig?.sortExpandableData) {
                     d.expandableData = sortData(column, direction, d.expandableData);
                  }
                  return d;
               })
               .sort((a: any, b: any) => {
                  if (!column.keyPath) return 0; // By returning 0, the sort function will leave the comparison as is, and continue to the next one

                  let valueA, valueB;

                  // !Array.isArray(a[column.keyPath as keyof object])
                  // don't need to test b.. because they are all the same objects... just different values
                  // see if the value is an iconConfig object type or just a string
                  const valIsIconConfigObj =
                     typeof a[column.keyPath as keyof object] === 'object' && a[column.keyPath as keyof object]?.value;
                  if (valIsIconConfigObj) {
                     valueA = getObjectProp(a, [...column['keyPath'], 'value']);
                     valueB = getObjectProp(b, [...column['keyPath'], 'value']);
                  } else {
                     valueA = getObjectProp(a, column.keyPath);
                     valueB = getObjectProp(b, column.keyPath);
                  }

                  // This now checks whether values are numbers or strings and sorts accordingly.
                  // Use toLocaleLowerCase() method on string to handle UTF-8 sorting issues
                  if (direction === SortingType.ASC) {
                     if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return valueA - valueB;
                     } else if (typeof valueA === 'string' && typeof valueB === 'string') {
                        return valueA.toLocaleLowerCase() > valueB.toLocaleLowerCase() ? 1 : -1;
                     } else return 0;
                  } else {
                     if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return valueB - valueA;
                     } else if (typeof valueA === 'string' && typeof valueB === 'string') {
                        return valueA.toLocaleLowerCase() < valueB.toLocaleLowerCase() ? 1 : -1;
                     } else return 0;
                  }
               });
         };

         if (onTableSort) {
            let sortedData: any = null;

            if (!column.keyPath) sortedData = data;
            else sortedData = sortData(column, direction, data);

            onTableSort(column, direction, sortedData);
            // reset the active page
            setActivePage(1);
            // reset the pagination index so we give a fresh 15 (rows per page)
            // without this, if you went to the last page & say it was only showing 7 rows, then it would sort, with the first page being 7 rows
            setPaginationIndex(0);
         }
      };

      // based on action icons click... here, add default behavior and/or just pass the items through
      const handleActionsClick = (event: any, action: any, item: any) => {
         let newDataToReturn: Array<any> = [];
         // this will reorder the data based on the movedown or moveup actionKey
         // you could also handle it in your feature if it needs to be more specific... but this should work
         if (rowReorder && rowReorderKeyPath && !!rowReorderKeyPath.length) {
            // utility to sort the data && map it into a new array to pass back
            const sortAndMap = (dataToOrganize: Array<any>) => {
               // get the max value or the rowReorderKeyPath
               const maxVal = [...dataToOrganize].reduce((acc: any, val: any) => {
                  const order = getObjectProp(val, rowReorderKeyPath);
                  return (acc = acc > order ? acc : order);
               }, 0);
               // sort & organize the data
               return [...dataToOrganize]
                  .sort((a: any, b: any) => {
                     const aOrder = getObjectProp(a, rowReorderKeyPath);
                     const bOrder = getObjectProp(b, rowReorderKeyPath);
                     return aOrder - bOrder;
                  })
                  .map((val: any, i: number) => {
                     const order = getObjectProp(val, rowReorderKeyPath);
                     return {
                        ...val,
                        actionsConfig: {
                           ...val.actionsConfig,
                           moveup: i === 0 ? false : true,
                           movedown: order === maxVal ? false : true,
                        },
                     };
                  });
            };

            // utility to reorder the data
            const reorderData = (otherIndexDiff: 1 | -1) => {
               const copy = [...data];

               // get the index of the curr item in the array
               const currPositionIndex = copy.findIndex((obj: any) => {
                  const valueToOrderByOne = getObjectProp(obj, rowReorderKeyPath);
                  const valueToOrderByTwo = getObjectProp(item, rowReorderKeyPath);
                  return valueToOrderByOne === valueToOrderByTwo;
               });

               // get the index of the item in the array to replace with (swapping with)
               const otherPosIndex = currPositionIndex + otherIndexDiff;

               // get the two values to change
               const val1 = getObjectProp(copy[otherPosIndex], rowReorderKeyPath);
               const val2 = getObjectProp(copy[currPositionIndex], rowReorderKeyPath);
               // change the data array to match
               setObjectProp(copy[currPositionIndex], rowReorderKeyPath, val1);
               setObjectProp(copy[otherPosIndex], rowReorderKeyPath, val2);

               const temp = copy[currPositionIndex];
               copy[currPositionIndex] = copy[otherPosIndex];
               copy[otherPosIndex] = temp;

               return copy;
            };

            switch (action.actionKey) {
               case 'movedown':
                  newDataToReturn = sortAndMap(reorderData(1));
                  break;
               case 'moveup':
                  newDataToReturn = sortAndMap(reorderData(-1));
                  break;
               default:
                  break;
            }
         }

         return action.callback({ event, actionKey: action.actionKey, item, newData: newDataToReturn });
      };

      return (
         <div className='flex flex-col gap-y-[2px]' ref={ref}>
            {tableTitle && (
               <p
                  className={twMerge(`
                  mb-[7px] text-[18px] leading-[20px] text-lum-gray-500 dark:text-lum-gray-300
                  ${tableTitleClassName ? tableTitleClassName : ''}
               `)}>
                  {tableTitle}
               </p>
            )}
            {/* TABLE CONTAINER */}
            <div
               className={`table-container overflow-x-auto`}
               style={{ ...(tableHeight && { maxHeight: `${tableHeight}px` }) }}>
               {/* TABLE */}
               <div
                  className='flex flex-col gap-y-[2px]'
                  style={{ ...(!hideHeader && { minWidth: `${tableMinWidth}px` }) }}>
                  {!hideHeader && (
                     <div
                        className={`
                           table-head z-[5]
                           ${fixedHeader ? 'sticky top-0' : ''}
                        `}>
                        {!!data?.length && (
                           <TableHeader
                              columns={columns}
                              sortingConfig={sortingConfig}
                              onTableSort={onTableSort && handleTableSort}
                              fixedHeader={fixedHeader}
                              actions={actions && actions}
                              stickyActions={stickyActions}
                              theme={theme}
                              allRowsSelectable={selectableRows && allRowsSelectable}
                              selectableRowsChecked={
                                 allRowsSelectable && selectableRows && selectableRowsKey && data && data.length
                                    ? data.every((d) => d[selectableRowsKey as keyof object])
                                    : undefined
                              }
                              onRowsSelect={(e: any, allRowsChecked: boolean) => {
                                 allRowsSelectable && onRowsSelect && onRowsSelect(e, data, allRowsChecked);
                              }}
                           />
                        )}
                     </div>
                  )}
                  <div className={`table-body flex flex-col gap-y-[1px]`}>
                     {!!data?.length && !isLoading ? (
                        <TableBody
                           data={data}
                           columns={columns}
                           numberOfRows={pagination ? paginationOptions?.rowsPerPage : undefined}
                           paginationIndex={paginationIndex}
                           actions={actions && actions}
                           stickyActions={stickyActions}
                           handleActionsClick={actions && handleActionsClick}
                           expandableRows={expandableRows}
                           expandAllRows={expandAllRows}
                           onCellEvent={onCellEvent}
                           theme={theme}
                           selectableRows={selectableRows}
                           selectableRowsKey={selectableRowsKey}
                           onRowsSelect={(e: any, rowsSelected: Array<any>) => {
                              onRowsSelect && onRowsSelect(e, rowsSelected);
                           }}
                        />
                     ) : showEmptyState ? (
                        <div
                           className={twMerge(`flex items-center justify-center min-h-[80px] rounded-sm bg-lum-white dark:bg-lum-gray-700 text-lum-gray-450
                           ${theme === 'secondary' && 'bg-lum-gray-50 dark:bg-lum-gray-675'}
                        `)}>
                           {isLoading ? (
                              <div className='grid place-items-center' style={{ height: `${200}px` }}>
                                 <LoadingSpinner size={80} isOpen={isLoading} />
                              </div>
                           ) : (
                              <>{emptyStateDisplayText}</>
                           )}
                        </div>
                     ) : (
                        <></>
                     )}
                  </div>
               </div>
               {/* END TABLE */}
            </div>
            {/* END TABLE CONTAINER */}
            {/* PAGINATION BAR */}
            {pagination && paginationOptions && !!data?.length && (
               <PaginationBar
                  options={paginationOptions}
                  onPaginationOptionsChange={(newPaginationOptions: PaginationOptions) => {
                     // onPaginationOptionsChange(newPaginationOptions)
                     setPaginationOptions(newPaginationOptions);
                     onPaginate && onPaginate(newPaginationOptions, { prevPage: activePage, currPage: activePage });
                  }}
                  data={data}
                  paginationIndex={paginationIndex}
                  // paginate={(pageToNavigateTo) => {
                  //    // subtracting because we are keeping track of the index inside this component, not the page number
                  //    setPaginationIndex(pageToNavigateTo - 1);
                  //    onPagination && onPagination(pageToNavigateTo);
                  // }}
                  setActivePage={(newActivePage: number) => {
                     setPaginationIndex(newActivePage - 1);
                     setActivePage(newActivePage);
                     onPaginate && onPaginate(paginationOptions, { prevPage: activePage, currPage: newActivePage });
                  }}
                  activePage={activePage}
               />
            )}
            {/* END PAGINATION BAR */}
         </div>
      );
   }
);

Table.displayName = 'Table';
export default Table;
