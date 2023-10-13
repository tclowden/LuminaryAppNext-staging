'use client';
import Button from '@/common/components/button/Button';
import { findMinMaxValueInArray } from '@/utilities/helpers';
import React, { useEffect, useState } from 'react';
import DropDown from '../../../../../common/components/drop-down/DropDown';
import Input from '../../../../../common/components/input/Input';
import Panel from '../../../../../common/components/panel/Panel';

interface Props {
   handleChange: any;
   setMultiValues: any;
   formData: any;
   productConfig: any;
}

const Battery = ({ handleChange, setMultiValues, formData, productConfig }: Props) => {
   const [batteryProductConfig, setBatteryProductConfig] = useState<any[]>([{}]);

   useEffect(() => {
      if (formData.battery == undefined) {
         handleChange({
            target: {
               name: 'battery',
               type: 'text',
               value: [{ tempId: crypto.randomUUID(), quantity: 0, displayOrder: 0 }],
            },
         });
      }
   }, []);

   useEffect(() => {
      const filteredProductConfig = productConfig.filter((e: any) => {
         console.log(e);
         return e.product.name == 'Battery';
      });

      setBatteryProductConfig(filteredProductConfig);
   }, ['productConfig']);

   const handleAddAction = (e: any) => {
      const tempBatterySelections = formData?.battery?.length ? [...formData?.battery] : [];

      const { max } = findMinMaxValueInArray(tempBatterySelections, ['displayOrder']);

      setMultiValues({
         ...formData,
         battery: [
            ...tempBatterySelections,
            { tempId: crypto.randomUUID(), quantity: 0, displayOrder: (max || 0) + 1 },
         ],
      });
   };

   const handleDeleteAction = (action: any) => {
      if (action?.tempId) {
         return setMultiValues({
            ...formData,
            battery: [...formData?.battery.filter((item: any) => item?.tempId !== action.tempId)],
         });
      }
   };

   return (
      <Panel title='Battery'>
         <div className='grid gap-[1px]'>
            <div className='mt-[1px] grid gap-[1px]'>
               {formData?.battery &&
                  formData?.battery
                     // .filter((action: ActionOnCallRoute) => !action?.archived)
                     // .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
                     .map((singleBattery: any, index: number) => (
                        <div key={index} className='flex gap-[1px]'>
                           <div className='flex w-[80%] px-[12px] py-[5px] bg-lum-gray-50 rounded-r-sm'>
                              <div className='grid grid-flow-col grid-cols-2 gap-x-[5px] w-[90%]'>
                                 <DropDown
                                    placeholder='Select Battery Type'
                                    label='Battery'
                                    options={batteryProductConfig}
                                    selectedValues={singleBattery?.name ? [singleBattery?.name] : []}
                                    onOptionSelect={(e: any, option: any) => {
                                       const foundBattery = formData?.battery.find((action: any) =>
                                          singleBattery?.id
                                             ? action?.id === singleBattery?.id
                                             : action?.tempId === singleBattery?.tempId
                                       );
                                       foundBattery['name'] = option;
                                       foundBattery['batteryId'] = option.id;
                                       setMultiValues({
                                          ...formData,
                                       });
                                    }}
                                    searchable
                                    keyPath={['name']}
                                 />

                                 <Input
                                    name={'name'}
                                    value={singleBattery?.quantity ?? ''}
                                    label='Quantity'
                                    onChange={(e) => {
                                       const foundAction = formData?.battery.find((action: any) =>
                                          singleBattery?.id
                                             ? action?.id === singleBattery?.id
                                             : action?.tempId === singleBattery?.tempId
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
                                       handleDeleteAction(singleBattery);
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

         <Input
            type='number'
            label='Battery Override Price'
            name='batteryOverridePrice'
            onChange={handleChange}
            value={formData?.batteryOverridePrice ? formData?.batteryOverridePrice : 0}
         />
      </Panel>
   );
};

export default Battery;
