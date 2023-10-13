'use client';
import Checkbox from '@/common/components/checkbox/Checkbox';
import useDebounce from '@/common/hooks/useDebounce';
import React, { useEffect, useState } from 'react';

interface Props {
   name: string;
   isChecked: boolean;
   callback: (e: any) => void;
}

const MemoizedCheckbox = React.memo(({ name, isChecked, callback }: Props) => {
   const [checkedEvent, setCheckedEvent] = useState<any>({ target: { checked: isChecked } });
   const [triggerDebounce, setTriggerDebounce] = useState<boolean>(false);

   // useEffect(() => {
   //    // setCheckedEvent({ target: { checked: isChecked } });
   //    // console.log('her?');
   //    if (isChecked !== checkedEvent?.target?.checked && !triggerDebounce) {
   //       console.log('chekced:', checkedEvent?.target?.checked);
   //       console.log('name:', name);
   //       setCheckedEvent({ target: { checked: isChecked } });
   //    }
   // }, [isChecked]);

   // useDebounce(
   //    () => {
   //       if (triggerDebounce) {
   //          callback(checkedEvent);
   //          setTriggerDebounce(false);
   //       }
   //    },
   //    [checkedEvent, triggerDebounce, isChecked],
   //    500
   // );

   return (
      <Checkbox
         name={name}
         checked={isChecked ?? false}
         onChange={(e: any) => {
            setTriggerDebounce(true);
            setCheckedEvent(e);
            callback(e);
         }}
      />
      // <Checkbox
      //    name={name}
      //    checked={checkedEvent?.target?.checked ?? false}
      //    onChange={(e: any) => {
      //       setTriggerDebounce(true);
      //       setCheckedEvent(e);
      //    }}
      // />
   );
});

export default MemoizedCheckbox;
