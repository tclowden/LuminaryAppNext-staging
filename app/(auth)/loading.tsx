'use client';
import LoadingSpinner from '@/common/components/loaders/loading-spinner/LoadingSpinner';
import React from 'react';

interface Props {}

const Loading = ({}: Props) => {
   return (
      <div className='h-screen w-full grid place-items-center'>
         <LoadingSpinner isOpen={true} size={150} />
      </div>
   );
};

export default Loading;
