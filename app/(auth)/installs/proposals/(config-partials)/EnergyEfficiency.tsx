'use client';
import React, { useState } from 'react';
import Input from '../../../../../common/components/input/Input';
import Panel from '../../../../../common/components/panel/Panel';

interface Props {
   handleChange: any;
   formData: any;
}
const EnergyEfficiency = ({ handleChange, formData }: Props) => {
   return (
      <Panel title='Energy Efficiency'>
         <Input
            type='number'
            label='Square Footage'
            name='eeSquareFootage'
            onChange={handleChange}
            value={formData?.eeSquareFootage ? formData?.eeSquareFootage : ''}
         />
         <Input
            type='number'
            label='Override Offset'
            name='eeOverrideOffset'
            onChange={handleChange}
            value={formData?.eeOverrideOffset ? formData?.eeOverrideOffset : ''}
         />
         <Input
            type='number'
            label='Price'
            name='eeOverridePrice'
            onChange={handleChange}
            value={formData?.eeOverridePrice ? formData?.eeOverridePrice : ''}
         />
         <Input
            type='number'
            label='Additional Cost'
            name='eeAdditionalCost'
            onChange={handleChange}
            value={formData?.eeAdditionalCost ? formData?.eeAdditionalCost : ''}
         />

         <Input
            type='text'
            label='EE notes'
            name='eeNotes'
            onChange={handleChange}
            value={formData?.eeNotes ? formData?.eeNotes : ''}
         />
      </Panel>
   );
};

export default EnergyEfficiency;
