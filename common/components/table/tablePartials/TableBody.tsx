import React, { useEffect, useState } from 'react';
import TableCell from './TableCell';
import TableRow from './TableRow';
import { ActionsType, ColumnType } from '../tableTypes';
import ActionsTableCell from './ActionsTableCell';

interface Props {
   actions?: ActionsType[];
   stickyActions?: boolean;
   data: Array<any>;
   columns: ColumnType[];
   numberOfRows?: number;
   paginationIndex?: number;
   expandableRows?: boolean;
   expandAllRows?: { value: boolean; timestamp: Date };
   isNested?: boolean;
   nestedAmount?: number;
   theme?: 'secondary' | 'list';
   onCellEvent?: ({ event, item, column }: { event: any; item: any; column: any }) => void;
   selectableRows?: boolean;
   selectableRowsKey?: string;
   onRowsSelect?: (e: any, rowsSelected: Array<any>) => void;
   handleActionsClick?: (e: any, action: any, item: any) => void;
}

const TableBody = ({
   actions,
   data,
   columns,
   numberOfRows,
   paginationIndex,
   expandableRows,
   expandAllRows,
   isNested,
   nestedAmount,
   onCellEvent,
   theme,
   selectableRows,
   selectableRowsKey,
   onRowsSelect,
   handleActionsClick,
   stickyActions,
}: Props) => {
   // need to slice
   // starting index... should be top row
   // number of rows to show...
   // if length of array is less than the starting index + number of rows to show, then index from the back
   //? ie) starting index: 5, rows to show: 3, array length: 7
   //? starting index is now the array.length - rows to show

   // starting index ==== numberOfRows
   // rows to show === numberOfRows * paginationIndex + numberOfRows
   // length of array === data.length

   let startingIndexMin =
      paginationIndex !== undefined && numberOfRows !== undefined ? paginationIndex * numberOfRows : null;
   let rowsToShowMax =
      paginationIndex !== undefined && numberOfRows !== undefined
         ? numberOfRows * paginationIndex + numberOfRows
         : null;

   if (startingIndexMin && rowsToShowMax && data.length <= startingIndexMin) {
      startingIndexMin = numberOfRows ? data.length - numberOfRows : null;
      rowsToShowMax = data.length;
   }

   const dataToRender =
      startingIndexMin !== null && rowsToShowMax !== null ? data.slice(startingIndexMin, rowsToShowMax) : [...data];
   const [expandRow, setExpandRow] = useState<number[]>([]);
   const NESTED_AMOUNT = nestedAmount ? nestedAmount + 1 : 1;

   useEffect(() => {
      if (typeof expandAllRows?.value === 'boolean') {
         setExpandRow((prevState: Array<number>) => {
            if (expandAllRows?.value) {
               return dataToRender?.map((_: any, i: number) => i);
               // return [...arr, arr.length];
            } else return [];
         });
      }
   }, [expandAllRows, data]);

   return (
      <>
         {dataToRender.map((item, i: number) => (
            <React.Fragment key={i}>
               <TableRow actions={actions} columnCount={columns.length} columns={columns}>
                  <>
                     {columns.map((col, j) => (
                        <TableCell
                           item={item}
                           column={col}
                           key={j}
                           isNested={isNested}
                           nestedAmount={nestedAmount}
                           marginLeftCell={j === 0 && isNested}
                           showExpandableRowIcon={expandableRows && !!item.expandableData?.length && j === 0}
                           expandableRowIconName={expandRow.includes(i) ? 'Minus' : 'Plus'}
                           onExpandRowClick={(itemToExpand: object) => {
                              setExpandRow((prevState: number[]) => {
                                 const rowIndex = [...prevState].indexOf(i);
                                 if (rowIndex === -1) return [...prevState, i];
                                 return [...prevState].filter((ri) => ri !== i);
                              });
                           }}
                           onCellEvent={onCellEvent}
                           theme={theme}
                           selectableRows={selectableRows && j === 0}
                           selectableRowsKey={selectableRowsKey}
                           onRowsSelect={onRowsSelect}
                        />
                     ))}
                     {actions && actions.length && (
                        <ActionsTableCell
                           handleActionsClick={handleActionsClick}
                           actions={actions}
                           stickyActions={stickyActions}
                           item={item}
                           theme={theme}
                        />
                     )}
                  </>
               </TableRow>
               {/* EXPANDABLE ROW LOGIC */}
               {expandableRows && expandRow.includes(i) && !!item.expandableData && (
                  <TableBody
                     data={item.expandableData}
                     columns={columns}
                     actions={actions}
                     handleActionsClick={handleActionsClick}
                     isNested
                     nestedAmount={NESTED_AMOUNT}
                     onCellEvent={onCellEvent}
                     expandableRows
                     expandAllRows={expandAllRows}
                  />
               )}
            </React.Fragment>
         ))}
      </>
   );
};

export default TableBody;
