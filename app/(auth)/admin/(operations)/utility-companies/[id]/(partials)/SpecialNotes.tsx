'use client';
import React from 'react';
import Explainer from '../../../../../../../common/components/explainer/Explainer';
import Textarea from '../../../../../../../common/components/textarea/Textarea';

interface Props {
   values: any;
   errors: any;
   handleChange: (e: any) => void;
   handleBlur: (e: any) => void;
}

const SpecialNotes = ({ values, errors, handleBlur, handleChange }: Props) => {
   return (
      <Explainer
         description={
            'Enter any special notes or circumstances here. When this Energy Company is selected in the proposal configuration these notes will display for the user.'
         }>
         {/* <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Name & State</div> */}
         <Textarea
            data-test={'specialNotes'}
            label='Special Notes'
            name='specialNotes'
            value={values?.specialNotes || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={'Any special notes?'}
            errorMessage={errors?.specialNotes}
         />
      </Explainer>
   );
};

export default SpecialNotes;
