'use client';
import React, { useEffect, useState } from 'react';
import Input from '../../../../../common/components/input/Input';
import Checkbox from '../../../../../common/components/checkbox/Checkbox';
import Radio from '../../../../../common/components/radio/Radio';
import Panel from '../../../../../common/components/panel/Panel';

interface Props {
   includedProducts: object;
   proposalTypes: string[];
   handleChange: any;
   formData: any;
   tabs: any;
   setTabs: any;
}

const Products = ({ includedProducts, proposalTypes, handleChange, formData, tabs, setTabs }: Props) => {
   const handleProductChange = (e: any) => {
      handleChange(e);

      const productSelected = e.target.name;
      const productChecked = e.target.checked;

      if (productChecked) {
         setTabs((tabsCopy: any) => {
            // Add in the product
            let tc = [{ name: 'Products' }, { name: 'Energy Usage' }, { name: 'Payment' }];

            // Add in products one at a time in order, plus the one we've got.
            if (formData['Solar'] || productSelected.toLowerCase() == 'solar') tc.push({ name: 'Solar' });
            if (formData['Energy Efficiency'] || productSelected.toLowerCase() == 'energy efficiency')
               tc.push({ name: 'EE' });
            if (formData['HVAC'] || productSelected.toLowerCase() == 'hvac') tc.push({ name: 'HVAC' });
            if (formData['Battery'] || productSelected.toLowerCase() == 'battery') tc.push({ name: 'Battery' });

            tc.push({ name: 'Review' });

            return tc;
         });
      } else {
         // Remove from tabs
         setTabs((tabsCopy: any) => {
            const tc = [...tabsCopy];
            return tc.filter((productName: any) => productName.name.toLowerCase() !== productSelected.toLowerCase());
         });
      }
   };

   return (
      <Panel title={'Products'}>
         <h3>Select Products</h3>
         {Object.keys(includedProducts).map((keyName, index) => (
            <div className='flex justify-between items-center w-[500px]'>
               <Checkbox
                  key={index}
                  label={keyName.charAt(0).toUpperCase() + keyName.slice(1)}
                  checked={!!formData[keyName as keyof Object]}
                  onChange={handleProductChange}
                  name={keyName}
               />
               {keyName == 'HVAC' && (
                  <div className='flex justify-right w-[200px]'>
                     <Checkbox
                        key={index}
                        label={'Display ' + keyName.charAt(0).toUpperCase() + keyName.slice(1)}
                        checked={!!formData[(keyName + 'Display') as keyof Object]} // hvacDisplay
                        onChange={handleProductChange}
                        name={keyName + 'Display'}
                     />
                  </div>
               )}
            </div>
         ))}

         <h3 className='mt-[30px]'>Proposal Type</h3>
         {proposalTypes.map((keyName: any, index: any) => (
            <Radio
               key={index}
               checked={formData['proposalType'] === keyName}
               name='proposalType'
               label={keyName}
               value={keyName}
               onChange={(e: any) => {
                  handleChange({
                     target: {
                        name: 'proposalType',
                        type: 'text',
                        value: e.target.value,
                     },
                  });
               }}
            />
         ))}
      </Panel>
   );
};

export default Products;
