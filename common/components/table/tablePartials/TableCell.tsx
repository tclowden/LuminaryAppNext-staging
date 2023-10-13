import React, { useEffect, useId, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { getObjectProp } from '../../../../utilities/helpers';
import Button from '../../button/Button';
import Checkbox from '../../checkbox/Checkbox';
import Icon from '../../Icon';
import Tooltip from '../../tooltip/Tooltip';
import { ColumnType, DEFAULT_COLUMN_SIZE, RowConfig } from '../tableTypes';
import { backgroundColorObject, backgroundOpacityObject } from '../../../../utilities/colors/colorObjects';

interface Props {
   item: any;
   column: ColumnType;
   showExpandableRowIcon?: boolean;
   expandableRowIconName?: string;
   expandableRows?: boolean;
   onExpandRowClick?: (item: object) => void;
   marginLeftCell?: boolean;
   isNested?: boolean;
   nestedAmount?: number;
   theme?: 'secondary' | 'list';
   onCellEvent?: ({ event, item, column }: { event: any; item: any; column: any }) => void;
   selectableRows?: boolean;
   selectableRowsKey?: string;
   onRowsSelect?: (e: any, rowsSelected: Array<any>) => void;
}

const TableCell = React.memo(
   ({
      item,
      column,
      showExpandableRowIcon,
      expandableRowIconName,
      onExpandRowClick,
      marginLeftCell,
      isNested,
      nestedAmount,
      onCellEvent,
      theme,
      selectableRows,
      selectableRowsKey,
      onRowsSelect,
   }: Props) => {
      const generatedId = useId();
      const valueRef = useRef<any>();
      const [tooltipDisabled, setTooltipDisabled] = useState<boolean>(true);
      const ICON_SIZE = 20;

      const callback = (event: any) => {
         onCellEvent && onCellEvent({ event, item, column });
      };

      let value;
      if (column.render) value = column.render({ column, item, callback });
      // else if (column?.keyPath && column?.checkbox) value = <Checkbox checked={false} />;
      else if (column.keyPath && !!getObjectProp(item, column.keyPath)) {
         value = getObjectProp(item, column.keyPath);
      } else value = <span className='text-lum-gray-300'>N/A</span>;

      useEffect(() => {
         const handleWindowResize = (e?: any) => {
            if (valueRef.current.offsetWidth < valueRef.current.scrollWidth) {
               setTooltipDisabled(false);
            } else setTooltipDisabled(true);
         };

         if (valueRef.current) {
            handleWindowResize();
         }

         window.addEventListener('resize', handleWindowResize);
         return () => {
            window.removeEventListener('resize', handleWindowResize);
         };
      }, [valueRef]);

      const colSpan = column?.colSpan || 1;
      let COLUMN_COUNT = 1;
      if (colSpan >= 1 && colSpan <= 12) COLUMN_COUNT = colSpan;
      else if (colSpan < 1) COLUMN_COUNT = 1;
      else if (colSpan > 12) COLUMN_COUNT = 12;

      return (
         <div
            // docs on `suppressHydrationWarning` --> https://reactjs.org/docs/dom-elements.html#suppresshydrationwarning
            suppressHydrationWarning
            // border-[1px] border-lum-gray-100 dark:border-lum-gray-800
            className={twMerge(`
            first:rounded-l-sm last:rounded-r-sm pl-2 pr-2 text-[14px] text-lum-gray-700 bg-lum-white min-h-[44px] dark:bg-lum-gray-700 dark:text-lum-white
            ${!column.textCenter ? 'first:pl-4' : ''}
            ${isNested && nestedAmount && nestedAmount === 1 && 'bg-lum-gray-25 dark:bg-lum-gray-775'}
            ${isNested && nestedAmount && nestedAmount >= 2 && 'bg-lum-gray-50 dark:bg-lum-gray-750'}
            ${theme === 'secondary' && 'bg-lum-gray-50 dark:bg-lum-gray-675'}
            ${theme === 'list' && 'bg-transparent dark:bg-transparent first:pl-0 last:pr-0'}
            ${item?.rowConfig?.color && backgroundColorObject[item?.rowConfig?.color as keyof object]}
            ${item?.rowConfig?.opacity && backgroundOpacityObject[item?.rowConfig?.opacity as keyof object]}
         `)}
            style={{
               minWidth: marginLeftCell
                  ? `${DEFAULT_COLUMN_SIZE * COLUMN_COUNT - 16}px`
                  : `${DEFAULT_COLUMN_SIZE * COLUMN_COUNT}px`,
               marginLeft: marginLeftCell && nestedAmount ? `${16 * nestedAmount}px` : '',
            }}>
            <>
               <div
                  className={`
                  w-full h-full flex items-center
                  ${column.textCenter ? 'justify-center' : ''}
               `}
                  id={`tableCell-${generatedId}`}>
                  {selectableRows && selectableRowsKey && (
                     <Checkbox
                        checked={item[selectableRowsKey as keyof object] ?? false}
                        onChange={(e) => {
                           e.stopPropagation();
                           onRowsSelect && onRowsSelect(e, [item]);
                        }}
                     />
                  )}
                  {React.isValidElement(value) ? (
                     <>
                        <span
                           ref={valueRef}
                           className={`
                              ${column.ellipsis !== false ? 'truncate' : 'break-word py-[10px]'}
                              ${column.textCenter ? 'text-center ' : 'text-left flex-1'}
                           `}>
                           {value}
                        </span>
                     </>
                  ) : (
                     <Tooltip content={typeof value !== 'object' ? value : value?.value} disabled={tooltipDisabled}>
                        <span
                           ref={valueRef}
                           className={`
                           ${column.ellipsis !== false ? 'truncate' : 'break-word py-[10px]'}
                           ${column.textCenter ? 'text-center ' : 'text-left flex-1'}
                        `}
                           style={{
                              ...(value?.iconConfig && {
                                 display: 'grid',
                                 gridTemplateColumns: `${ICON_SIZE}px auto`,
                                 alignItems: 'center',
                                 columnGap: '8px',
                              }),
                           }}>
                           {typeof value !== 'object' && <>{value !== null || value !== undefined ? value : ''}</>}
                           {typeof value === 'object' && (
                              <>
                                 {value?.iconConfig && (
                                    <Icon
                                       name={value.iconConfig.name}
                                       color={value.iconConfig?.color || 'gray'}
                                       width={ICON_SIZE}
                                       height={ICON_SIZE}
                                    />
                                 )}
                                 {value?.value || ''}
                              </>
                           )}
                        </span>
                     </Tooltip>
                  )}
                  {showExpandableRowIcon && (
                     <Button
                        iconName={expandableRowIconName}
                        onClick={(e) => {
                           onExpandRowClick && onExpandRowClick(item);
                        }}
                        color={'transparent'}
                        style={{ marginLeft: 'auto' }}
                     />
                  )}
               </div>
            </>
         </div>
      );
   }
);
export default TableCell;
