import React, { useEffect, useRef } from 'react';
import Icon from '../Icon';
import { twMerge } from 'tailwind-merge';

type Props = {
   label?: string;
   errorMessage?: string;
   isRequired?: boolean;
};

const Textarea = ({
   label,
   errorMessage,
   isRequired,
   ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & Props) => {
   const textareaRef = useRef<any>(null);
   const labelHtmlFor = label ? label.replace(' ', '-').toLowerCase() : '';

   useEffect(() => {
      // Resize textarea and char count on input
      const offest = 2;
      const handleTextChange = () => {
         if (textareaRef?.current) {
            textareaRef.current.style.height = '';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + offest + 'px';
         }
      };

      // if (textareaRef?.current) {
      textareaRef?.current.addEventListener('input', handleTextChange);
      // }

      return () => {
         textareaRef?.current?.removeEventListener('input', handleTextChange);
      };
   }, []);

   return (
      <label className='relative block' htmlFor={labelHtmlFor}>
         {label && (
            <>
               <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>
                  {label}
                  {isRequired && <span className='pl-[3px]'>*</span>}
               </span>
            </>
         )}
         <div className='flex items-center rounder-md'>
            <textarea
               ref={textareaRef}
               className={twMerge(`
                  w-full min-h-[40px] p-[10px] rounded resize-none bg-lum-gray-50 dark:bg-lum-gray-700 text-lum-gray-700 dark:text-lum-white placeholder:text-lum-gray-400 border-[1px] border-solid 
                  ${errorMessage ? 'border-lum-red-500' : 'border-lum-gray-100 dark:border-lum-gray-600'}
                  ${rest?.disabled && 'opacity-70 hover:cursor-not-allowed text-lum-gray-400'}
               `)}
               id={labelHtmlFor}
               {...rest}
            />
         </div>
         {errorMessage && (
            <div className='flex pt-[6px]'>
               <Icon
                  className='min-w-[11px] min-h-[11px] fill-lum-red-500'
                  name='Warning'
                  height='11'
                  width='11'
                  viewBox='0 0 16 16'
               />
               <span className='mt-[-3px] pl-[6px] text-[11px] leading-[14px] text-lum-gray-600 dark:text-lum-gray-300'>
                  {errorMessage}
               </span>
            </div>
         )}
      </label>
   );
};

export default Textarea;
