import React from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import Icon from '../Icon';

type Props = {
   date?: Date;
   setDate?: React.Dispatch<React.SetStateAction<Date>>;
   onDateSelect?: (date: Date, formattedDateString: string) => void;
   onBlur?: (e: any) => void;
   inputStyles?: string;
   dateFormat: 'Y-m-d' | string;
   name?: string;
   label?: string;
   placeholder?: string;
   required?: boolean;
   errorMessage?: string;
   enableTime?: boolean;
   minDate?: string;
   iconName?: string;
   iconWidth?: string;
   iconHeigth?: string;
   iconStyles?: string
};

const DatePicker = ({
   date,
   setDate,
   onDateSelect,
   onBlur,
   inputStyles,
   dateFormat,
   name,
   label,
   placeholder,
   required,
   errorMessage,
   minDate = 'today',
   enableTime = true,
   iconName = 'Calendar',
   iconWidth = '16',
   iconHeigth = '16',
   iconStyles
}: Props) => {
   const handleDateChange = (date: Date[], currDateString: string, self: any) => {
      setDate && setDate(date[0]);
      onDateSelect && onDateSelect(date[0], currDateString);
   };

   return (
      <label className='relative block'>
         {label && (
            <>
               <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>
                  {label}
                  {required && <span className='pl-[3px]'>*</span>}
               </span>
            </>
         )}
         <div className='flex items-center'>
            <Flatpickr
               name={name}
               data-enable-time
               value={date}
               onBlur={(e: any) => {
                  onBlur && onBlur(e);
               }}
               onChange={(date, currDateString, self) => handleDateChange(date, currDateString, self)}
               placeholder={placeholder || 'Select a date'}
               options={{
                  minDate: minDate,
                  enableTime: enableTime,
                  dateFormat: dateFormat,
               }}
               className={`
                     w-full bg-lum-gray-50 dark:bg-lum-gray-700 text-lum-gray-700 dark:text-lum-white placeholder:text-lum-gray-400 border-[1px] border-solid min-h-[40px] max-h-[40px] p-[10px] rounded
                     ${
                        errorMessage
                           ? 'border-[1px] border-solid border-lum-red-500'
                           : 'border-lum-gray-100 dark:border-lum-gray-600'
                     }
                     ${inputStyles ? inputStyles : ''}
                  `}
            />
            <Icon
               className={`${iconStyles ? iconStyles : 'absolute right-[10px] fill-lum-gray-300 dark:fill-lum-gray-450'}`}
               name={iconName}
               height={iconHeigth}
               width={iconWidth}
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


export default DatePicker; 