'use client';
import DatePicker from '@/common/components/date-picker/DatePicker';
import useDebounce from '@/common/hooks/useDebounce';
import React, { useEffect, useState } from 'react';

interface Props {
   name: string;
   label: string;
   answer: Date;
   onChange: (answer: string) => void;
   onBlur: (e: any) => void;
   required: boolean;
   errorMessage?: string;
   setDebouncingValue: (bool: boolean) => void;
}

// eslint-disable-next-line react/display-name
const MemoizedDatePicker = React.memo(
   ({ name, label, answer, onChange, onBlur, required, errorMessage, setDebouncingValue }: Props) => {
      const [value, setValue] = useState<any>(answer);
      const [triggerDebounce, setTriggerDebounce] = useState<boolean>(false);

      useDebounce(
         () => {
            if (triggerDebounce) {
               onChange(value);
               setTriggerDebounce(false);
            }
         },
         [value, triggerDebounce],
         500
      );

      useEffect(() => {
         if (triggerDebounce) setDebouncingValue(true);
         else setDebouncingValue(false);
      }, [triggerDebounce]);

      const handleChange = (selectedDateStr: any) => {
         setTriggerDebounce(true);
         setValue(selectedDateStr);
      };

      return (
         <DatePicker
            name={name}
            label={label}
            date={answer}
            onBlur={onBlur}
            onDateSelect={(date: any, dateStr: string) => {
               handleChange(dateStr);
               // console.log('date:', date);
               // console.log('dateStr:', dateStr);
               // //  handleChange({ target: { type: 'text', name: 'dueAt', value: dateStr } });
               // handleInputChange(dateStr, i);
            }}
            dateFormat={'Y-m-d H:i:S'}
            errorMessage={errorMessage}
            required={required}
         />
      );
   }
);

export default MemoizedDatePicker;
