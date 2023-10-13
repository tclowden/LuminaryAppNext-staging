import Icon from '../Icon';
import React from 'react';
import { ChipBackgroundColorObject } from '../../../utilities/colors/colorObjects';
import { ButtonColors } from '../button/Button';
import { twMerge } from 'tailwind-merge';

type Props = {
   value: string | number;
   removable?: boolean;
   onClick: (e: any, value: string | number) => void;
   color?: ButtonColors;
};

const Chip = React.forwardRef(({ value, removable = true, onClick, color = 'light', ...rest }: Props, ref: any) => {
   return (
      <div
         ref={ref}
         onClick={(e) => onClick(e, value)}
         className={twMerge(`
            flex items-center rounded-full max-h-[30px] py-[5px] px-[11px] first:m-0 cursor-pointer text-lum-white
            ${ChipBackgroundColorObject[color] || ChipBackgroundColorObject['light']}
         `)}
         {...rest}>
         <span className={`text-[14px] leading-[20px] pr-[8px]`}>{value}</span>
         {removable && (
            <Icon
               name='XCross'
               height='14'
               width='14'
               className={`${color ? `fill-lum-white opacity-40` : 'fill-lum-gray-400 dark:fill-lum-gray-550'}`}
            />
         )}
      </div>
   );
});

Chip.displayName = 'Chip';

export default Chip;
