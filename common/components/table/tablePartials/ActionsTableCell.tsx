import React from 'react';
import { useDispatch } from 'react-redux';
import { twMerge } from 'tailwind-merge';
import { setTippyOpen, setTippyClose } from '../../../../store/slices/tippy';
import Button from '../../button/Button';
import { ActionsType, DEFAULT_COLUMN_SIZE } from '../tableTypes';

interface Props {
   actions: ActionsType[];
   item: any;
   theme?: 'secondary' | 'list';
   stickyActions?: boolean;
   handleActionsClick?: (e: any, action: any, item: any) => void;
}

const ActionsTableCell = ({ actions, item, theme, handleActionsClick, stickyActions }: Props) => {
   return (
      <div
         className={twMerge(`
             pl-2 pr-2 rounded-r-sm text-[14px] text-lum-gray-700 bg-lum-white min-h-[44px] flex items-center dark:bg-lum-gray-700 dark:text-lum-white
             ${stickyActions ? 'sticky right-0' : ''}
             ${theme === 'secondary' && 'bg-lum-gray-50 dark:bg-lum-gray-675'}
             ${theme === 'list' && 'bg-transparent dark:bg-transparent'}
          `)}
         style={{ minWidth: `${DEFAULT_COLUMN_SIZE}px` }}>
         {actions.map((action: ActionsType, i: number) => {
            const generatedId = Math.floor(Math.random() * 10000).toString();

            // if the user didn't config the actions object inside the data array
            if (!item?.actionsConfig) return;

            let iconConfig = item.actionsConfig[action.actionKey];
            if (typeof iconConfig === 'boolean') iconConfig = { disabled: !iconConfig };

            return (
               <React.Fragment key={i}>
                  <Button
                     iconName={action.icon}
                     color={'transparent'}
                     onClick={(event: any) => {
                        if (iconConfig?.disabled) return;
                        handleActionsClick && handleActionsClick(event, action, item);
                     }}
                     id={`actionIcon-${generatedId}`}
                     disabled={iconConfig?.disabled}
                     iconColor={iconConfig?.color || (theme === 'secondary' && 'gray:300') || ''}
                     tooltipContent={iconConfig?.toolTip || action?.toolTip || ''}
                  />
               </React.Fragment>
            );
         })}
      </div>
   );
};

export default ActionsTableCell;
