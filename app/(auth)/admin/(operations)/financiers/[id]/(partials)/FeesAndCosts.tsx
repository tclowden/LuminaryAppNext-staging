'use client';
import React from 'react';
import Explainer from '../../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../../common/components/grid/Grid';
import Input from '../../../../../../../common/components/input/Input';

interface Props {
   values: any;
   errors: any;
   handleChange: (e: any) => void;
   handleBlur: (e: any) => void;
}

const FeesAndCosts = ({ handleChange, handleBlur, values, errors }: Props) => {
   return (
      <Explainer description='Enter connection fee and any additional costs. If no additional costs, leave blank.'>
         <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Fees & Costs</div>
         <Grid columnCount={2} responsive>
            <Input
               type={'number'}
               data-test={'connectionFee'}
               label={'Connection Fee'}
               value={values?.connectionFee ?? ''}
               onChange={handleChange}
               onBlur={handleBlur}
               name={'connectionFee'}
               placeholder={'100.00'}
               required
               errorMessage={errors?.connectionFee}
            />
            <Input
               type={'number'}
               data-test={'additionalCost'}
               label={'Additional Cost'}
               value={values?.additionalCost ?? ''}
               onChange={handleChange}
               onBlur={handleBlur}
               name={'additionalCost'}
               placeholder={'100.00'}
               errorMessage={errors?.additionalCost}
            />
         </Grid>
      </Explainer>
   );
};

export default FeesAndCosts;
