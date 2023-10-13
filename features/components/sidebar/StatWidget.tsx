'use client';
import React from 'react';

interface StatsWidgetProps {
   value: string;
   bgColor: string;
   title: string;
   width: number;
}

const StatWidget = ({ value, bgColor, title, width }: StatsWidgetProps) => {
   return (
      <div className='flex flex-col justify-center items-center px-[8px] pt-[9px] rounded bg-lum-gray-700'>
         <span className='text-lum-white text-[20px] pb-[6px]'>{value}</span>
         <div className='w-full rounded-full h-[3px] bg-lum-black'>
            <div className={`h-full rounded-full ${bgColor || 'bg-lum-blue-500'}`} style={{ width: `${width}%` }}></div>
         </div>
         <span className='text-lum-gray-350 text-[10px] py-[4px]'>{title}</span>
      </div>
   );
};

export default StatWidget;
