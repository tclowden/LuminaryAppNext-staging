'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import Icon from '../../../common/components/Icon';

const BreadcrumbBtn = ({
   isActive = false,
   iconName,
   leftChevron,
   children,
   ...otherProps
}: {
   isActive?: boolean;
   iconName?: string | undefined;
   leftChevron?: boolean;
   children?: string | JSX.Element | JSX.Element[];
   [x: string]: any;
}) => {
   return (
      <>
         {leftChevron && (
            <div className='h-[40px] flex items-center justify-center'>
               <Icon
                  name='ChevronRight'
                  width={12}
                  height={12}
                  color={'gray'}
                  // className='fill-none stroke-2 stroke-lum-gray-450 dark:stroke-lum-gray-450'
               />
            </div>
         )}
         <button
            className={twMerge(`p-[10px] h-[40px] min-w-[40px] flex gap-[10px] items-center justify-center rounded shadow-012 group
         bg-lum-gray-50 hover:bg-lum-white
         dark:bg-lum-gray-750 dark:hover:bg-lum-gray-700 dark:active:bg-lum-gray-750 
         ${isActive && 'bg-lum-white dark:bg-lum-gray-700'}`)}
            {...otherProps}>
            {iconName && (
               <Icon
                  name={iconName}
                  width={16}
                  height={16}
                  className={twMerge(`fill-lum-gray-300 group-hover:fill-lum-gray-450 dark:fill-lum-gray-550
               ${isActive && ''}`)}
               />
            )}
            <div
               className={twMerge(` font-medium text-sm capitalize text-lum-gray-450 group-hover:text-lum-gray-700
            dark:text-lum-gray-450 dark:group-hover:text-lum-white
            ${isActive && 'text-lum-gray-700 dark:text-lum-white'}`)}>
               {children}
            </div>
         </button>
      </>
   );
};
export default BreadcrumbBtn;
