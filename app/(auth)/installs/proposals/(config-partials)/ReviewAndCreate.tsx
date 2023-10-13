'use client';
import React, { useState } from 'react';
import Input from '../../../../../common/components/input/Input';
import Button from '../../../../../common/components/button/Button';
import Panel from '../../../../../common/components/panel/Panel';

interface Props {
   handleChange: any;
   formData: any;
   handleSubmit: any;
   isNew: boolean;
}
const ReviewAndCreate = ({ handleChange, formData, handleSubmit, isNew }: Props) => {
   return (
      <Panel title='Review And Create'>
         <Input
            type='text'
            label='Proposal Name'
            name='name'
            onChange={handleChange}
            value={formData?.name ? formData?.name : ''}
         />

         <Button color='blue' onClick={handleSubmit}>
            {isNew ? 'Create Proposal' : 'Update Proposal'}
         </Button>
      </Panel>
   );
};

export default ReviewAndCreate;
