'use client';
import React, { useEffect, useState } from 'react';
import Input from '../../../../../common/components/input/Input';
import Checkbox from '../../../../../common/components/checkbox/Checkbox';
import Panel from '../../../../../common/components/panel/Panel';
import DropDown from '../../../../../common/components/drop-down/DropDown';
import Button from '@/common/components/button/Button';
import { findMinMaxValueInArray } from '@/utilities/helpers';

interface Props {
   handleChange: any;
   setMultiValues: any;
   formData: any;
   productConfig: any;
}

const Hvac = ({ handleChange, setMultiValues, formData, productConfig }: Props) => {
   const [selectedValues, setSelectedValues] = useState<any[]>([]);
   const [hvacProductConfig, setHVACProductConfig] = useState<any[]>([{}]);
   useEffect(() => {
      if (formData.hvac == undefined) {
         handleChange({
            target: {
               name: 'hvac',
               type: 'text',
               value: [{ tempId: crypto.randomUUID(), quantity: 0, displayOrder: 0 }],
            },
         });
      }
   }, []);

   useEffect(() => {
      const filteredProductConfig = productConfig.filter((e: any) => {
         console.log(e);
         return e.product.name == 'HVAC';
      });

      setHVACProductConfig(filteredProductConfig);
   }, ['productConfig']);

   const handleAddAction = (e: any) => {
      const tempHvacSelections = formData?.hvac?.length ? [...formData?.hvac] : [];

      const { max } = findMinMaxValueInArray(tempHvacSelections, ['displayOrder']);

      setMultiValues({
         ...formData,
         hvac: [...tempHvacSelections, { tempId: crypto.randomUUID(), quantity: 0, displayOrder: (max || 0) + 1 }],
      });

      // handleChange({ target: { name: 'hvac', type: 'text', value: updatedFormData } });
   };

   const handleDeleteAction = (action: any) => {
      if (action?.tempId) {
         return setMultiValues({
            ...formData,
            hvac: [...formData?.hvac.filter((item: any) => item?.tempId !== action.tempId)],
         });
      }
   };

   return (
      <Panel title='HVAC'>
         <div className='grid gap-[1px]'>
            <div className='mt-[1px] grid gap-[1px]'>
               {formData?.hvac &&
                  formData?.hvac
                     // .filter((action: ActionOnCallRoute) => !action?.archived)
                     // .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
                     .map((singleHvac: any, index: number) => (
                        <div key={index} className='flex gap-[1px]'>
                           <div className='flex w-[80%] px-[12px] py-[5px] bg-lum-gray-50 rounded-r-sm'>
                              <div className='grid grid-flow-col grid-cols-2 gap-x-[5px] w-[90%]'>
                                 <DropDown
                                    placeholder='Select HVAC Type'
                                    label='HVAC'
                                    options={hvacProductConfig}
                                    selectedValues={singleHvac?.name ? [singleHvac?.name] : []}
                                    onOptionSelect={(e: any, option: any) => {
                                       const foundHvac = formData?.hvac.find((action: any) =>
                                          singleHvac?.id
                                             ? action?.id === singleHvac?.id
                                             : action?.tempId === singleHvac?.tempId
                                       );
                                       foundHvac['name'] = option;
                                       foundHvac['hvacId'] = option.id;
                                       setMultiValues({
                                          ...formData,
                                       });
                                    }}
                                    searchable
                                    keyPath={['name']}
                                 />

                                 <Input
                                    name={'name'}
                                    value={singleHvac?.quantity ?? ''}
                                    label='Quantity'
                                    onChange={(e) => {
                                       const foundAction = formData?.hvac.find((action: any) =>
                                          singleHvac?.id
                                             ? action?.id === singleHvac?.id
                                             : action?.tempId === singleHvac?.tempId
                                       );
                                       foundAction['quantity'] = e.target.value;
                                       setMultiValues({
                                          ...formData,
                                       });
                                    }}
                                 />
                              </div>
                              <div className='w-[10%] flex justify-center items-center'>
                                 <Button
                                    iconName={'TrashCan'}
                                    color={'transparent'}
                                    onClick={(e: any) => {
                                       console.log('Delete!');
                                       handleDeleteAction(singleHvac);
                                    }}
                                    iconColor='gray:300'
                                    tooltipContent='Delete Action'
                                 />
                              </div>
                           </div>
                        </div>
                     ))}
               <div className='flex justify-center items-center py-[5px] bg-lum-gray-50'>
                  <Button color='light' size='sm' onClick={handleAddAction}>
                     Add Action
                  </Button>
               </div>
            </div>
         </div>

         <Checkbox
            checked={formData?.dualFuelUpgrade ? formData?.dualFuelUpgrade : false}
            onChange={handleChange}
            name={'dualFuelUpgrade'}
            label='Duel Fuel Upgrade?'
         />

         <Input
            type='number'
            label='Price'
            name='hvacOverridePrice'
            onChange={handleChange}
            value={formData?.hvacOverridePrice ? formData?.hvacOverridePrice : 0}
         />
         <Input
            type='number'
            label='Additional Cost'
            name='hvacAdditionalCost'
            onChange={handleChange}
            value={formData?.hvacAdditionalCost ? formData?.hvacAdditionalCost : 0}
         />
         <Input
            type='number'
            label='HVAC Offset Override %'
            name='hvacOverrideOffset'
            onChange={handleChange}
            value={formData?.hvacOverrideOffset ? formData?.hvacOverrideOffset : 0}
         />

         <Input
            type='text'
            label='HVAC Notes'
            name='hvacNotes'
            onChange={handleChange}
            value={formData?.hvacNotes ? formData?.hvacNotes : ''}
         />
      </Panel>
   );
};

export default Hvac;
