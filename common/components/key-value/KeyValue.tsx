'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import Grid from '../grid/Grid';

interface Props {
   objectKey: string;
   objectValue: string;
   className?: string;
}

const KeyValue = ({ objectKey, objectValue, className }: Props) => {
   return (
      // <Grid
      //    className={twMerge(`
      //       rounded hover:bg-lum-gray-50 dark:hover:bg-lum-gray-700 group
      //       ${className ? className : ''}
      //    `)}
      //    responsive
      //    columnCount={2}>
      //    <span className='text-[14px] text-lum-gray-400 dark:text-lum-gray-300 group-hover:pl-1 duration-200'>
      //       {objectKey}:
      //    </span>
      //    <span className='text-[14px] text-lum-gray-700 dark:text-lum-white'>{objectValue}</span>
      // </Grid>
      <div className='col-span-1 grid grid-cols-2 rounded-sm hover:bg-lum-gray-50 dark:hover:bg-lum-gray-700 group gap-x-[10px] gap-y-[20px]'>
         <span className='text-[14px] text-lum-gray-400 dark:text-lum-gray-300 group-hover:pl-1 duration-200'>
            {objectKey}:
         </span>
         <span className='text-[14px] text-lum-gray-700 dark:text-lum-white'>{objectValue}</span>
      </div>
   );
};

export default KeyValue;
