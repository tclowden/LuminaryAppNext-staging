'use client';
import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import useWebModal from '@/common/hooks/useWebModal';
import { WebModalType } from '@/common/components/webModals/modals';

type ButtonType = 'button' | 'submit' | 'reset';

const WebButton = ({
   className,
   type = 'button',
   onClick,
   children,
   openWebModal,
}: {
   className?: string | undefined;
   onClick?: string | (() => void);
   children?: ReactNode;
   openWebModal?: WebModalType;
   type?: ButtonType;
}) => {
   const { openModal } = useWebModal();

   const handleClick = () => {
      openWebModal && openModal(openWebModal);
      if (onClick && typeof onClick === 'string') {
         var actualFunction = new Function('return ' + onClick)();
         return actualFunction();
      } else if (onClick && typeof onClick === 'function') {
         onClick();
      } else {
         return null;
      }
   };

   return (
      <button
         type={type}
         className={twMerge(
            `min-h-[50px] px-6 flex place-items-center w-full max-w-[200px] rounded-md shadow-[0_1px_2px_0px_rgba(5,19,26,0.15)] hover:brightness-[1.12] active:brightness-90`,
            className
         )}
         onClick={handleClick}>
         <div className='m-auto text-center text-lum-white font-semibold leading-relaxed'>{children}</div>
      </button>
   );
};

export default WebButton;
