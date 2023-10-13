'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import Explainer from '../../../../../../common/components/explainer/Explainer';
import Input from '../../../../../../common/components/input/Input';
import ToggleSwitch from '../../../../../../common/components/toggle-switch/ToggleSwitch';
import Grid from '../../../../../../common/components/grid/Grid';
import DropDown from '../../../../../../common/components/drop-down/DropDown';
import { useAppSelector } from '../../../../../../store/hooks';
import { selectUser } from '@/store/slices/user';
import Button from '@/common/components/button/Button';

type Props = {
   bucketName: string;
   isDefaultBucket: boolean;
   bucketType: any;
   activeStatuses: any;
   activeLeadSources: any;
   orderCriteria: any;
   onBucketNameUpdate: (value: string) => void;
   onDefaultBucketUpdate: (isDefault: boolean) => any;
   onBucketTypeUpdate: (e: any, items: any) => any;
   onBucketOrderUpdate: (updatedOrder: any) => any;
};

const Settings = ({
   bucketName,
   isDefaultBucket,
   activeStatuses,
   activeLeadSources,
   bucketType,
   orderCriteria,
   onBucketNameUpdate,
   onDefaultBucketUpdate,
   onBucketTypeUpdate,
   onBucketOrderUpdate,
}: Props) => {
   const user = useAppSelector(selectUser);
   const userAuthToken = user.token;
   const [bucketTypeOptions, setBucketTypeOptions] = useState<any[]>([]);

   useEffect(() => {
      async function getBucketTypes() {
         let req = await fetch('/api/v2/buckets/types', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userAuthToken}` },
         });
         let bucketTypesResponse = await req.json();
         setBucketTypeOptions(bucketTypesResponse);
      }
      getBucketTypes();
   }, []);

   // Helper function to generate orderCriteria.
   const generateOrderCriteria = () => {
      const combinedItems = [...activeLeadSources, ...activeStatuses];
      return combinedItems.map((item, index) => ({
         ...item,
         displayOrder: index + 1,
      }));
   };

   // Initialize orderCriteria on first mount only
   useEffect(() => {
      // if (!orderCriteria.length) {
      const initialOrderCriteria = generateOrderCriteria();
      onBucketOrderUpdate(initialOrderCriteria);
      // }
   }, []);

   // Handle adding and removing items from the order criteria
   useEffect(() => {
      if (orderCriteria.length !== 0) {
         const existingIds = new Set(orderCriteria.map((item: any) => item.id));
         const newItems = [...activeLeadSources, ...activeStatuses].filter((item) => !existingIds.has(item.id));
         if (newItems.length > 0) {
            const newItemsWithOrder = newItems.map((item, index) => ({
               ...item,
               displayOrder: orderCriteria.length + index + 1,
            }));
            const updatedOrderCriteria = [...orderCriteria, ...newItemsWithOrder];
            onBucketOrderUpdate(updatedOrderCriteria);
         }
      }
   }, [activeLeadSources, activeStatuses]);

   // Handle changes to the order criteria
   const moveItem = (currentIndex: number, direction: number) => {
      // Calculate the new index of the item after moving.
      const newIndex = currentIndex + direction;

      // Check if the new index would be out of bounds. If so, exit the function.
      if (newIndex < 0 || newIndex >= orderCriteria.length) return;

      // Create a shallow copy of the existing orderCriteria array.
      const newArray = [...orderCriteria];

      // Swap the elements at the current and new indices.
      [newArray[currentIndex], newArray[newIndex]] = [newArray[newIndex], newArray[currentIndex]];

      // Update the displayOrder property for each item based on its new index.
      const updatedArray = newArray.map((item, index) => ({
         ...item,
         displayOrder: index + 1,
      }));

      // Update the state with the rearranged array.
      onBucketOrderUpdate(updatedArray);
   };

   const explainerDescription =
      'Give your bucket a name and select whether it is the default bucket. Only one bucket can be the default bucket';

   return (
      <>
         {/* Bucket Info */}
         <Explainer title='Bucket Info' description={explainerDescription}>
            <Grid columnCount={2}>
               <Input
                  label='Bucket Name'
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                     onBucketNameUpdate(e.target.value);
                  }}
                  value={bucketName}
                  placeholder='Enter Bucket Name...'
               />
               <div className={'flex justify-end'}>
                  <ToggleSwitch
                     checked={isDefaultBucket}
                     onChange={(e: any) => onDefaultBucketUpdate(e.target.checked)}
                     label={'Default Bucket?'}
                  />
               </div>
               <DropDown
                  keyPath={['typeName']}
                  placeholder={'Choose Bucket Type'}
                  selectedValues={bucketType[0]?.id ? bucketType : []}
                  label='Bucket Type'
                  options={bucketTypeOptions}
                  onOptionSelect={(e: any, items: any) => onBucketTypeUpdate(e, items)}
               />
            </Grid>
         </Explainer>
         {/* Priority config, list of lead sources and statuses for now */}
         <Explainer title='Prioritization' description='Select the order that leads will come out of this bucket'>
            <Grid className='p-[30px]' columnCount={1}>
               {orderCriteria &&
                  orderCriteria.map((item: any, index: number) => {
                     return (
                        <div key={index} className='flex flex-row items-center'>
                           <div className='flex'>
                              <span className='p-[10px]'>{item.displayOrder}</span>
                              <span className='p-[10px]'>{item.name}</span>
                           </div>

                           <div className='flex ml-auto'>
                              <Button
                                 color='gray'
                                 onClick={() => moveItem(index, -1)}
                                 iconName={'UnionUp'}
                                 disabled={index === 0}
                              />
                              <div className='p-[5px]'></div>
                              <Button
                                 color='gray'
                                 onClick={() => moveItem(index, 1)}
                                 iconName={'UnionDown'}
                                 disabled={index === orderCriteria.length - 1}
                              />
                           </div>
                        </div>
                     );
                  })}
            </Grid>
         </Explainer>
      </>
   );
};

export default Settings;
