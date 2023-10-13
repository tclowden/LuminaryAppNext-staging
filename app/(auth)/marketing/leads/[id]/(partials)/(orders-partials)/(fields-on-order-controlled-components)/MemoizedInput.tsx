'use client';
import Input from '@/common/components/input/Input';
import useDebounce from '@/common/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import React, { useEffect, useState } from 'react';

interface Props {
   inputType: string;
   name: string;
   label: string;
   answer: string;
   onChange: (answer: string) => void;
   onBlur: (e: any) => void;
   required: boolean;
   errorMessage?: string;
   setDebouncingValue: (bool: boolean) => void;
}

// eslint-disable-next-line react/display-name
const ControlledInput = React.memo(
   ({ inputType, name, label, answer, onChange, onBlur, required, errorMessage, setDebouncingValue }: Props) => {
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

      const handleChange = (e: any) => {
         setTriggerDebounce(true);
         const val = e.target.value;
         setValue(val);
      };

      return (
         <Input
            type={inputType}
            name={name}
            label={label}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            required={required}
            errorMessage={errorMessage}
         />
      );
   }
);

export default ControlledInput;
