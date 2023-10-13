'use client';
import React from 'react';
import Explainer from '../../../../../../../common/components/explainer/Explainer';
import ToggleSwitch from '../../../../../../../common/components/toggle-switch/ToggleSwitch';

interface Props {
   values: any;
   errors: any;
   handleChange: (e: any) => void;
   handleBlur: (e: any) => void;
}

const NetMetering = ({ values, errors, handleBlur, handleChange }: Props) => {
   return (
      <Explainer description={'Does this electric company allow net metering?'}>
         {/* <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Name & State</div> */}
         <ToggleSwitch
            textOptions='yes/no'
            checked={values?.netMeter ?? false}
            onChange={handleChange}
            onBlur={handleBlur}
            label='Net Metering'
            name='netMeter'
            errorMessage={errors?.netMeter}
         />
      </Explainer>
   );
};

export default NetMetering;
