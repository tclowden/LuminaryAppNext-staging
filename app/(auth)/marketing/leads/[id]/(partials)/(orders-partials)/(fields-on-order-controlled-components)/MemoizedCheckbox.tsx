'use client';
import Checkbox from '@/common/components/checkbox/Checkbox';
import Input from '@/common/components/input/Input';
import useDebounce from '@/common/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import React, { useEffect, useState } from 'react';

interface Props {
   name: string;
   label: string;
   onChange: (answer: boolean) => void;
   checked: boolean;
   required: boolean;
   setDebouncingValue: (bool: boolean) => void;
}

const ControlledCheckbox = React.memo(({ name, label, onChange, checked, required, setDebouncingValue }: Props) => {
   const [value, setValue] = useState<any>(checked);
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
      const val = e.target.checked;
      setValue(val);
   };

   return <Checkbox name={name} label={label} onChange={handleChange} checked={value || false} required={required} />;
});

export default ControlledCheckbox;
