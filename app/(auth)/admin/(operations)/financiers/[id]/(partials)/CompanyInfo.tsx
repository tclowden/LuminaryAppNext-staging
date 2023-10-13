'use client';
import React from 'react';
import DropDown from '../../../../../../../common/components/drop-down/DropDown';
import Explainer from '../../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../../common/components/grid/Grid';
import Input from '../../../../../../../common/components/input/Input';
import { useAppSelector } from '../../../../../../../store/hooks';
import { selectPageContext } from '../../../../../../../store/slices/pageContext';

interface Props {
   handleChange: (e: any) => void;
   handleBlur: (e: any) => void;
   values: any;
   errors: any;
}

const CompanyInfo = ({ values, handleBlur, handleChange, errors }: Props) => {
   const { states } = useAppSelector(selectPageContext);

   return (
      <Explainer
         title='Utility Company Info'
         description='What is the name of the Utility Company and what state does the Utility Company belong in?'>
         <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Name & State</div>
         <Grid columnCount={2} responsive>
            <Input
               type={'text'}
               data-test={'name'}
               label={'Utitlity Company Name'}
               value={values?.name ?? ''}
               onChange={handleChange}
               onBlur={handleBlur}
               name={'name'}
               placeholder={'ex) Electro Dogs'}
               required
               errorMessage={errors?.name}
            />
            <DropDown
               placeholder='ex) Arkansas'
               options={states}
               keyPath={['name']}
               name={'state'}
               required
               label='State'
               onOptionSelect={(e: any, selectedState: any) => {
                  handleChange({ target: { type: 'text', value: selectedState, name: 'state' } });
                  handleChange({ target: { type: 'text', value: selectedState.id, name: 'stateId' } });
               }}
               selectedValues={values?.state ? [values.state] : []}
               errorMessage={errors?.state}
               onBlur={handleBlur}
            />
         </Grid>
      </Explainer>
   );
};

export default CompanyInfo;
