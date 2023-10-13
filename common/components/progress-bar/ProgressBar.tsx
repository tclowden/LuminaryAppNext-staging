'use client';
import React, { useState } from 'react';
import { backgroundColorObject } from '../../../utilities/colors/colorObjects';
import { IconColors } from '../Icon';

interface Data {
   tooltipContent: JSX.Element;
}

// interface CircleDim

interface Props {
   height?: number;
   progressPercentage?: number;
   strokeColor?: IconColors;
   showIndicators?: boolean;
   data?: Array<Data>;
}

const ProgressBar = ({
   height = 16,
   progressPercentage = 0,
   strokeColor = 'gray:450',
   showIndicators,
   data,
}: Props) => {
   // const [hoveredCircleDimensions, setHoveredCircleDimensions] = useState<{ [index: number]: { width: number, height: number }  }>({});

   const progressBarColorClass = backgroundColorObject[strokeColor];

   let indicatorColorClass = '';
   const [color, value] = strokeColor.split(':');
   if (!value) {
      indicatorColorClass = backgroundColorObject[`${color}:600`];
   } else {
      indicatorColorClass = backgroundColorObject[`${color}:${+value + 100}`];
   }
   return (
      <div
         style={{ height: `${height}px` }}
         className={`rounded-[8px] w-full bg-lum-gray-100 flex items-center relative`}>
         <div
            style={{
               width: `${progressPercentage}%`,
               height: `${height - 6}px`,
               marginLeft: `${4}px`,
               marginRight: `${4}px`,
            }}
            className={`
               h-full rounded-[8px]
               ${progressBarColorClass}
            `}
         />

         {showIndicators && !!data?.length && (
            <div className='flex items-center justify-between w-full absolute'>
               {data.map((val: Data, i: number) => {
                  return (
                     <div
                        key={i}
                        style={{
                           height: `${height - 7}px`,
                           width: `${height - 7}px`,
                           marginLeft: i === 0 ? `${5}px` : 0,
                           marginRight: i === data.length - 1 ? `${5}px` : 0,
                        }}
                        className={`
                        rounded-full transition duration-300 hover:scale-150 cursor-pointer
                        ${indicatorColorClass}
                     `}></div>
                  );
               })}
            </div>
         )}
      </div>
   );
};

export default ProgressBar;
