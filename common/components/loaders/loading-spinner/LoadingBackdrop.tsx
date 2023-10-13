'use client';
import React from 'react';
import { createPortal } from 'react-dom';
import LoadingSpinner from './LoadingSpinner';

interface Props {
   isOpen: boolean;
   zIndex?: number;
}

const LoadingBackdrop = ({ isOpen, zIndex = 100 }: Props) => {
   if (isOpen)
      return createPortal(
         <>
            <div
               className='absolute top-0 left-0 w-screen h-screen bg-lum-black opacity-50 dark:opacity-75'
               style={{
                  zIndex: zIndex,
               }}></div>
            <div
               onClick={(e) => e.stopPropagation()}
               className={`
                  absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]
               `}
               style={{
                  zIndex: zIndex + 1,
               }}>
               <LoadingSpinner isOpen={isOpen} size={50} />
            </div>
         </>,
         document.body
      );
   return null;
};

export default LoadingBackdrop;
