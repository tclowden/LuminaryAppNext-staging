'use client'
import React from 'react';
import Icon, { IconColors } from '../Icon';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { LuminaryColors } from '../../types/LuminaryColors';
import { buttonColorsObject, buttonIconColorObject } from '../../../utilities/colors/colorObjects';
import Tooltip, { TooltipDelay, TooltipPosition } from '../tooltip/Tooltip';

export type ButtonColors =
   | LuminaryColors
   | 'light'
   | 'dark'
   | 'light:dark'
   | 'transparent'
   | 'none'
   | `${string}:${number}`;

export type ButtonSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type Props = {
   size?: ButtonSizes;
   color?: ButtonColors;
   iconName?: string;
   iconColor?: IconColors;
   children?: React.ReactNode;
   onClick?: (e: any) => void;
   href?: string;
   shadow?: boolean;
   tooltipContent?: string | React.ReactNode;
   tooltipPosition?: TooltipPosition;
   tooltipOpenDelay?: TooltipDelay;
   tooltipCloseDelay?: TooltipDelay;
};

const Button = React.forwardRef(
   (
      {
         size,
         color = 'none',
         iconName,
         iconColor,
         children,
         onClick,
         href,
         shadow,
         tooltipContent,
         tooltipPosition,
         tooltipOpenDelay,
         tooltipCloseDelay,
         ...rest
      }: React.ButtonHTMLAttributes<HTMLButtonElement> & Props,
      ref: any
   ) => {
      const router = useRouter();

      const buttonSizeClasses = {
         xs: 'min-h-[24px] max-h-[24px] px-[10px] text-[13px]',
         sm: 'min-h-[30px] max-h-[30px] px-[20px] text-[14px]',
         md: 'min-h-[40px] max-h-[40px] px-[20px] text-[14px]',
         lg: 'min-h-[50px] max-h-[50px] px-[24px] text-[18px]',
         xl: 'min-h-[60px] max-h-[60px] px-[24px] text-[20px]',
      };
      const iconButtonSizeClasses = {
         xs: 'min-h-[24px] max-h-[24px] min-w-[24px] max-w-[24px]',
         sm: 'min-h-[30px] max-h-[30px] min-w-[30px] max-w-[30px]',
         md: 'min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px]',
         lg: 'min-h-[50px] max-h-[50px] min-w-[50px] max-w-[50px]',
         xl: 'min-h-[60px] max-h-[60px] min-w-[60px] max-w-[60px]',
      };
      const iconSize = {
         xs: 12,
         sm: 16,
         md: 18,
         lg: 20,
         xl: 22,
      };

      const button = (
         <button
            ref={ref && ref}
            className={twMerge(`
               group rounded text-lum-white disabled:cursor-not-allowed disabled:opacity-25
               ${shadow && 'shadow-012'}
               ${children && buttonSizeClasses[size || 'md']}
               ${!children && iconButtonSizeClasses[size || 'sm']}
               ${buttonColorsObject[color] || buttonColorsObject['none']}
               ${rest?.className && rest?.className}
            `)}
            onClick={(e) => {
               e.preventDefault();
               onClick && onClick(e);
               href && router.push(href);
            }}
            {...rest}>
            <span className='flex items-center justify-center'>
               {iconName && (
                  <Icon
                     name={iconName || 'Warning'}
                     width={iconSize[size || 'sm']}
                     height={iconSize[size || 'sm']}
                     className={twMerge(`fill-lum-white
                     m-auto
                     ${children && 'mr-[5px]'}
                     ${
                        color === 'transparent' &&
                        'fill-lum-gray-450 group-hover:fill-lum-gray-500 group-active:fill-lum-gray-500 dark:group-hover:fill-lum-gray-200'
                     }
                     ${
                        color === 'light:dark' &&
                        'fill-lum-gray-300 group-hover:fill-lum-gray-300 group-active:fill-lum-gray-400 dark:fill-lum-gray-450 dark:group-hover:fill-lum-gray-450 dark:group-active:fill-lum-gray-550'
                     }
                     ${iconColor && buttonIconColorObject[iconColor]}
                  `)}
                  />
               )}
               {children}
            </span>
         </button>
      );

      return tooltipContent ? (
         <Tooltip
            content={tooltipContent}
            position={tooltipPosition}
            openDelay={tooltipOpenDelay}
            closeDelay={tooltipCloseDelay}>
            {button}
         </Tooltip>
      ) : (
         button
      );
   }
);

Button.displayName = 'Button';

export default Button;
