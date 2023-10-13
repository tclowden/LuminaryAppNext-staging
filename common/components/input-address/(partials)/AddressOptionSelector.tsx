'use client';
import React, { useEffect, useRef } from 'react';
import { Suggestion } from 'react-places-autocomplete';

interface Props {
   options: any[];
   getOptionItemProps: any;
   showOptions: boolean;
   setShowOptions: (bool: boolean) => void;
   siblingRef?: any; // This ref is used to determine if the user is clicking on a sibling container that should not toggle the On/Off of displaying the options (the DropDown component currently utilizes this)
}

const AddressOptionSelector = ({ options, getOptionItemProps, showOptions, setShowOptions, siblingRef }: Props) => {
   const optionContainerRef = useRef<any>();

   useEffect(() => {
      const handleClickOutside = (event: Event) => {
         if (
            siblingRef?.current &&
            !siblingRef?.current?.contains(event.target) &&
            optionContainerRef.current &&
            !optionContainerRef.current?.contains(event.target) &&
            showOptions
         ) {
            setShowOptions(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [siblingRef, optionContainerRef, showOptions, setShowOptions]);

   return (
      <>
         {showOptions && !!options?.length && (
            <div
               ref={optionContainerRef}
               className={`absolute w-full min-w-max rounded z-10 cursor-pointer bg-lum-white dark:bg-lum-gray-700 border-[1px] border-solid border-lum-gray-200 dark:border-lum-gray-650 overflow-y-auto`}
               style={{
                  boxShadow: '0px 2px 5px rgba(16, 24, 30, 0.3)',
                  top: '100%',
                  // maxHeight: `${maxHeight}px`,
                  // ...style,
               }}>
               {options?.map((option: Suggestion, i: number) => {
                  const props = getOptionItemProps(option);
                  delete props['key'];
                  return (
                     <button
                        key={i}
                        type='button'
                        className={`flex w-full py-[7px] px-[9px] first:rounded-t last:rounded-b hover:bg-lum-gray-50 active:bg-lum-gray-100 dark:hover:bg-lum-gray-675 dark:active:bg-lum-gray-800`}
                        {...props}>
                        <span
                           className={`flex flex-row items-center text-[14px] leading-[20px] text-lum-gray-600 dark:text-lum-white`}>
                           {option.description}
                        </span>
                     </button>
                  );
               })}
            </div>
         )}
      </>
   );
};

export default AddressOptionSelector;
