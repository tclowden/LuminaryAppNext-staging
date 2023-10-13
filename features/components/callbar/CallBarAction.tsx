'use client';

import React, { useEffect, useState } from 'react';
import Icon from '../../../common/components/Icon';
interface Props {
   IconName: string;
   handleCallAction: () => void;
   isMuted?: boolean;
}

const CallBarAction = ({ IconName, isMuted, handleCallAction }: Props) => {
   return (
      <div
         className='flex flex-row items-center max-h-[40px] max-w-[40px] p-[10px] hover:bg-lum-green-500 cursor-pointer rounded-[4px]'
         onClick={handleCallAction}>
         {!isMuted ? (
            <Icon name={IconName} className='flex fill-lum-white max-h-[40px] max-w-[20px]'></Icon>
         ) : (
            <Icon name={IconName} className='flex fill-lum-gray-500 max-h-[40px] max-w-[20px]'></Icon>
         )}
      </div>
   );
};

export default CallBarAction;
