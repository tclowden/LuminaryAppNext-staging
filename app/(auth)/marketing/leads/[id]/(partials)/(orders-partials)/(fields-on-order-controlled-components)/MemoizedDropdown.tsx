'use client';
import DropDown from '@/common/components/drop-down/DropDown';
import Input from '@/common/components/input/Input';
import useDebounce from '@/common/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import { getObjectProp } from '@/utilities/helpers';
import React, { useEffect, useState } from 'react';

interface Props {
   type?: 'normal' | 'configured-list';
   name: string;
   label: string;
   options: Array<any>;
   keyPath: Array<string>;
   selectedValue: any;
   selectedValueKeyPath: Array<string>;
   onChange: (answer: Array<any>) => void;
   onBlur: (e: any) => void;
   required: boolean;
   errorMessage?: string;
   setDebouncingValue: (bool: boolean) => void;
}

// eslint-disable-next-line react/display-name
const ControlledDropdown = React.memo(
   ({
      type = 'normal',
      name,
      label,
      options,
      keyPath,
      selectedValue,
      selectedValueKeyPath,
      onChange,
      onBlur,
      required,
      errorMessage,
      setDebouncingValue,
   }: Props) => {
      const [value, setValue] = useState<any>(selectedValue);
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

      const handleChange = (selectedProductFieldOption: any) => {
         setTriggerDebounce(true);
         let answer = null;
         if (type === 'normal') {
            answer = selectedProductFieldOption?.value;
         } else if (type === 'configured-list') {
            answer = getObjectProp(selectedProductFieldOption, keyPath);
            console.log('answer:', answer);
         }
         setValue({ ...selectedValue, answer: answer });
      };

      return (
         <DropDown
            name={name}
            label={label}
            searchable
            options={options}
            keyPath={keyPath}
            selectedValues={[value]}
            selectedValueKeyPath={['answer']}
            onBlur={onBlur}
            onOptionSelect={(e: any, selectedProductFieldOption: any) => {
               handleChange(selectedProductFieldOption);
            }}
            required={required}
            errorMessage={errorMessage}
         />
      );
   }
);

export default ControlledDropdown;
