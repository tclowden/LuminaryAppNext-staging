'use client';
import React from 'react';
import Button from '../button/Button';
import { IconColors } from '../Icon';
import Table from '../table/Table';
import { ActionsType } from '../table/tableTypes';

interface Props {
   columns: Array<any>;
   data: Array<any>;
   rowReorder?: boolean;
   rowReorderKeyPath?: Array<string>;
   onCellEvent?: ({ event, item, column }: { event: any; item: any; column: any }) => void;
   actions?: ActionsType[];
   showChildButton?: boolean;
   childButtonText?: string;
   childButtonCallback?: (e: any) => void;
   childButtonIconName?: string;
   childButtonIconColor?: IconColors;
   showEmptyState?: boolean;
   emptyStateDisplayText?: string;
   // table title configuration
   tableTitle?: string;
   tableTitleClassName?: string;
}

const TableList = ({
   columns,
   data,
   onCellEvent,
   actions,
   rowReorderKeyPath,
   showChildButton,
   childButtonCallback,
   childButtonText,
   childButtonIconName,
   childButtonIconColor,
   showEmptyState,
   emptyStateDisplayText,
   tableTitle,
   tableTitleClassName,
}: Props) => {
   return (
      <>
         <Table
            theme='list'
            hideHeader
            stickyActions={false}
            rowReorder
            rowReorderKeyPath={rowReorderKeyPath}
            data={data}
            columns={columns}
            onCellEvent={onCellEvent}
            actions={actions}
            showEmptyState={showEmptyState}
            emptyStateDisplayText={emptyStateDisplayText}
            tableTitle={tableTitle}
            tableTitleClassName={tableTitleClassName}
         />

         {showChildButton && (
            <div className='flex justify-center items-center py-[5px] bg-lum-gray-50 dark:bg-lum-gray-700'>
               <Button
                  size='sm'
                  color='light'
                  iconName={childButtonIconName}
                  iconColor={childButtonIconColor}
                  onClick={(e: any) => {
                     childButtonCallback && childButtonCallback(e);
                  }}>
                  {childButtonText || 'Add New'}
               </Button>
            </div>
         )}
      </>
   );
};

export default TableList;
