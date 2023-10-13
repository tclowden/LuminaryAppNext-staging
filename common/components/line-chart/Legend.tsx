'use client';

import React, { useEffect, useRef, useState } from 'react';
import { backgroundColorObject } from '../../../utilities/colors/colorObjects';
import useWindowSize from '../../hooks/useWindowSize';
import Tooltip from '../tooltip/Tooltip';
import { Data, Title } from './LineChart';

interface Props {
   data: Data[];
   width?: number;
   title: Title;
}

const Legend = ({ data, width, title }: Props) => {
   const [disableTooltip, setDisableTooltipTooltip] = useState<boolean>(true);
   const { windowWidth } = useWindowSize();
   const titleRef = useRef<any>();

   useEffect(() => {
      const { offsetWidth, scrollWidth } = titleRef.current;

      if (offsetWidth < scrollWidth && disableTooltip) setDisableTooltipTooltip(false);
      if (offsetWidth >= scrollWidth && !disableTooltip) setDisableTooltipTooltip(true);
   }, [windowWidth, disableTooltip]);

   return (
      <div
         className={`items-center flex flex-row justify-between`}
         style={{
            width: width ? width - 40 : 'inherit',
            gridArea: 'legend',
         }}>
         <div
            className={`
            flex-1
            ${title.placement === 'left' && 'order-2 text-center'}
            ${title.placement === 'center' && 'order-1 text-left'}
            ${title.placement === 'right' && 'order-2 text-center'}
         `}
         />
         <Tooltip content={title.value} disabled={disableTooltip}>
            <div
               ref={titleRef}
               className={`
                  text-lum-gray-700 dark:text-lum-gray-400 text-[16px] flex-1 truncate
                  ${title.placement === 'left' && 'order-1 text-left'}
                  ${title.placement === 'center' && 'order-2 text-center'}
                  ${title.placement === 'right' && 'order-3 text-right'}
               `}>
               {title.value}
            </div>
         </Tooltip>
         <div
            className={`
            flex flex-row items-center gap-x-2 flex-1
            ${title.placement === 'left' && 'order-3 justify-end'}
            ${title.placement === 'center' && 'order-3 justify-end'}
            ${title.placement === 'right' && 'order-1 justify-start'}
         `}>
            {data.map((lineData: Data, i: number) => (
               <div key={i} className='flex flex-row items-center gap-x-1'>
                  <div
                     className={`
                           h-[6px] w-[20px] rounded-full
                           ${backgroundColorObject[lineData.config.strokeColor] || backgroundColorObject['gray:450']}
                        `}></div>
                  <div className='text-[14px] text-lum-gray-450 dark:text-lum-gray-450'>{lineData.config.title}</div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default Legend;
