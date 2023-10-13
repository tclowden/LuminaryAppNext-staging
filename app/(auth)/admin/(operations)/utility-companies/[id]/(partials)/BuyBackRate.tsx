'use client';
import React from 'react';
import DropDown from '../../../../../../../common/components/drop-down/DropDown';
import Explainer from '../../../../../../../common/components/explainer/Explainer';
import { useAppSelector } from '../../../../../../../store/hooks';
import { selectPageContext } from '../../../../../../../store/slices/pageContext';

interface Props {
   values: any;
   errors: any;
   handleChange: (e: any) => void;
   handleBlur: (e: any) => void;
}

const BuyBackRate = ({ values, errors, handleBlur, handleChange }: Props) => {
   const { netMeteringTypes } = useAppSelector(selectPageContext);

   return (
      <Explainer
         description={
            <>
               <div>
                  <span className='font-medium'>Full Benefit:</span> Credit you generate covers electric costs
                  throughout the year. 1-1 and drop off at the end of the year. (Generally Arkansas comanpies have this)
               </div>
               <div>
                  <span className='font-medium'>Lose it:</span> If you don’t use all the power you produce in the same
                  month, it doesn’t carry over. (Generally Oklahoma comanpies have this)
               </div>
            </>
         }>
         {/* <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Name & State</div> */}
         <DropDown
            placeholder='Select buy back rate'
            options={netMeteringTypes}
            keyPath={['name']}
            name={'netMeteringType'}
            required
            label='Buy Back Rate'
            onOptionSelect={(e: any, selectedNetMeteringType: any) => {
               handleChange({ target: { type: 'text', value: selectedNetMeteringType, name: 'netMeteringType' } });
               handleChange({ target: { type: 'text', value: selectedNetMeteringType.id, name: 'netMeteringTypeId' } });
            }}
            onBlur={handleBlur}
            selectedValues={values?.netMeteringType ? [values.netMeteringType] : []}
            errorMessage={errors?.netMeteringType}
         />
      </Explainer>
   );
};

export default BuyBackRate;
