'use client';
import React from 'react';
import { strokeColorObject } from '../../../utilities/colors/colorObjects';
import { IconColors } from '../Icon';

interface Props {
   width: number;
   strokeWidth: number;
   strokeColor: IconColors;
   progressPercentage: number;
   children: React.ReactNode;
   defaultStrokeColor?: IconColors;
}

const ProgressCircle = ({
   strokeColor,
   width = 320,
   strokeWidth = 10,
   progressPercentage = 25,
   children,
   defaultStrokeColor,
}: Props) => {
   const centerX = width / 2;
   const centerY = width / 2;
   const circumference = width;
   const center = circumference / 2;
   const radius = center - strokeWidth;
   const arcLength = 2 * Math.PI * radius;
   const arcOffset = arcLength * ((100 - progressPercentage) / 100);

   return (
      <div className='relative' style={{ width: `${circumference}px`, height: `${circumference}px` }}>
         <svg style={{ width: `${circumference}px`, height: `${circumference}px` }} className='-rotate-90'>
            <circle
               className='text-lum-gray-100 dark:text-lum-gray-600'
               strokeWidth={strokeWidth}
               stroke={defaultStrokeColor ? defaultStrokeColor : 'currentColor'}
               fill='transparent'
               r={radius}
               cx={centerX}
               cy={centerY}
            />
            <circle
               className={`
                  ${strokeColorObject[strokeColor]}
               `}
               strokeWidth={strokeWidth}
               strokeLinecap={'round'}
               stroke='currentColor'
               fill='transparent'
               r={radius}
               cx={centerX}
               cy={centerY}
               strokeDasharray={arcLength}
               strokeDashoffset={arcOffset}
            />
         </svg>
         {/* CENTER THE CHILDREN */}
         <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>{children}</div>
      </div>
   );
};

export default ProgressCircle;
