import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
   className?: string;
}

const Hr = ({ className }: Props) => {
   return (
      <hr
         className={twMerge(`
            bt-[1px] dark:border-lum-gray-650 border-lum-gray-100 w-full
            ${className ? className : ''}
         `)}
      />
   );
};

export default Hr;
