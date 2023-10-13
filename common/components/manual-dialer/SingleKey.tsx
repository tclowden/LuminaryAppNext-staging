'use client';
import React from 'react';

interface Props {
   digit: string;
   subText: string;
   handleKeyClick: (digit: string) => void;
}

const SingleKey = ({ digit, subText, handleKeyClick }: Props) => {
   return (
      <div
         className='flex min-w-[60px] min-h-[60px] text-lum-gray-700 cursor-pointer text-[22px] w-1/4 justify-center items-center p-[10px] hover:bg-lum-gray-100 active:bg-lum-gray-150 dark:hover:bg-lum-gray-750 dark:active:bg-lum-gray-775 rounded-[4px]'
         onClick={() => handleKeyClick(digit)}>
         <div className='flex flex-col h-full justify-start items-center leading-none'>
            <p className='flex flex-col text-[22px] dark:text-lum-white items-center justify-center'>{digit}</p>
            {subText && <p className='flex justify-center items-center text-lum-gray-350 text-[12px]'>{subText}</p>}
         </div>
      </div>
   );
};

export default SingleKey;
