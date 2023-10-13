import React from 'react';
import { twMerge } from 'tailwind-merge';
import Button from '../button/Button';
import Icon from '../Icon';

type Props = {
   label?: string;
   iconName?: string;
   errorMessage?: string;
   required?: boolean;
   textCentered?: boolean;
   border?: boolean;
   shadow?: boolean;
   onChange?: (e: any) => void;
   onClearInput?: (e: any) => void;
   customInputClasses?: string;
};

const Input = React.forwardRef(
   (
      {
         label,
         iconName,
         errorMessage,
         required,
         textCentered,
         border = true,
         shadow = false,
         onChange,
         onClearInput,
         customInputClasses,
         ...rest
      }: React.InputHTMLAttributes<HTMLInputElement> & Props,
      ref: any
   ) => {
      const labelHtmlFor = label ? label.replace(' ', '-').toLowerCase() : '';

      // const handleCurrencyChange = (e: any) => {
      //    const val = e.target.value;
      //    if (val === '') {
      //       return onChange && onChange(e);
      //    }
      //    const rg = new RegExp(/^\d+(\.|\,)\d{2}$/);
      //    // const rg = new RegExp(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/);
      //    const strToCurrency = (value: string): any => (rg.test(value) ? value : null);
      //    e.target.value = strToCurrency(val) || e.target.value.slice(0, -1);
      //    return onChange && onChange(e);
      // };

      const handleInputChange = (e: any) => {
         // remove any non-numeric characters except the decimal point
         if (rest.type === 'currency') {
            let newValue = e.target.value.replace(/[^0-9.]/g, '');
            e.target.value = newValue;
         }
         console.log('e.target.value:', e.target.value);
         if (onChange) onChange(e);
      };

      // const handleInputBlur = (e: any) => {
      //    if (value) {
      //       setValue(Number(value).toFixed(2)); // format the value to two decimal places
      //     }
      //     if (props.onBlur) {
      //       props.onBlur();
      //     }
      // }

      return (
         <label className='relative block' htmlFor={labelHtmlFor} ref={ref}>
            {label && (
               <>
                  <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>
                     {label}
                     {required && <span className='pl-[3px]'>*</span>}
                  </span>
               </>
            )}
            <div className='flex items-center'>
               {iconName && (
                  <Icon
                     className='absolute left-[10px] fill-lum-gray-300 dark:fill-lum-gray-450'
                     name={iconName || 'MagnifyingGlass'}
                     height='16'
                     width='16'
                  />
               )}
               <input
                  className={twMerge(`
                     w-full min-h-[40px] max-h-[40px] p-[10px] rounded
                   bg-lum-gray-50 dark:bg-lum-gray-700 text-lum-gray-700 dark:text-lum-white placeholder:text-lum-gray-400 border-[1px] border-solid
                     ${!border && 'border-none'}
                     ${shadow && 'shadow-012'}
                     ${iconName && 'pl-[36px]'}
                     ${
                        errorMessage
                           ? 'border-[1px] border-solid border-lum-red-500'
                           : 'border-lum-gray-100 dark:border-lum-gray-600'
                     }
                     ${textCentered && 'text-center'}
                     ${rest?.disabled && 'opacity-70 hover:cursor-not-allowed text-lum-gray-400'}
                     ${customInputClasses}
                  `)}
                  type='text'
                  pattern={rest.type === 'currency' ? '^$d{1,3}(,d{3})*(.d+)?$' : ''}
                  id={labelHtmlFor}
                  required={required}
                  onChange={(e: any) => {
                     onChange && onChange(e);
                     // handleInputChange(e);
                  }}
                  {...rest}
               />
               {onClearInput && !!`${rest?.value}`?.length && (
                  <span className={'absolute right-[10px]'}>
                     <Button
                        onClick={(e: any) => onClearInput && onClearInput(e)}
                        color='transparent'
                        size='xs'
                        iconName='XCross'
                        iconColor='gray:300'
                     />
                  </span>
               )}
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
   }
);

Input.displayName = 'Input'; // Need to add component displayName manually if setting component to React.forwardRef()

export default Input;
