import React from 'react';
import { ColumnType } from '../boardTypes';
import BoardCard from './BoardCard';
import BoardColumn from './BoardColumn';
import BoardRow from './BoardRow';

interface Props {
   columns: Array<ColumnType>;
   columnHeight?: number;
   onCellEvent?: ({ event, item, column }: { event: any; item: any; column: any }) => void;
}

const BoardBody = ({ columns, columnHeight, onCellEvent }: Props) => {
   return (
      <BoardRow columns={columns}>
         {columns?.map((column: any, i: number) => {
            const colSpan = column.colSpan || 1;
            let COLUMN_COUNT = 1;
            if (colSpan >= 1 && colSpan <= 12) COLUMN_COUNT = colSpan;
            else if (colSpan < 1) COLUMN_COUNT = 1;
            else if (colSpan > 12) COLUMN_COUNT = 12;

            return (
               <BoardColumn key={i} columnHeight={columnHeight} columnCount={colSpan}>
                  {column?.items?.map((item: any, j: number) => (
                     <React.Fragment key={j}>
                        <BoardCard item={item} column={column} onCellEvent={onCellEvent} />
                     </React.Fragment>
                  ))}
               </BoardColumn>
            );
         })}
      </BoardRow>
   );
};

export default BoardBody;
