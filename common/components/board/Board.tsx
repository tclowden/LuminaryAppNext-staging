import React from 'react';
import BoardHeader from './boardPartials/BoardHeader';
import { ColumnType } from './boardTypes';
import BoardBody from './boardPartials/BoardBody';

interface Props {
   columns: Array<ColumnType>;
   boardHeight?: number;
   boardMinWidth?: number;
   columnHeight?: number;
   onCellEvent?: ({ event, item, column }: { event: any; item: any; column: any }) => void;
}

const Board = ({ columns, boardHeight, columnHeight, onCellEvent, boardMinWidth }: Props) => {
   return (
      <div className='flex flex-col gap-y-[2px]'>
         <div
            className='board-container overflow-x-auto'
            style={{
               ...(boardHeight && { maxHeight: `${boardHeight}px` }),
               ...(boardMinWidth && { minWidth: `${boardMinWidth}px` }),
            }}>
            <div className='flex flex-col gap-y-[2px]'>
               <div className={`board-head z-[5]`}>
                  <BoardHeader columns={columns} fixedHeader={false} />
               </div>
               <div className='table-body'>
                  <BoardBody columns={columns} columnHeight={columnHeight} onCellEvent={onCellEvent} />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Board;
