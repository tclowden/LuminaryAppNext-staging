import React, { useEffect, useState } from 'react';
import Input from '../../../../../../common/components/input/Input';
import Explainer from '../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../common/components/grid/Grid';
import TableList from '../../../../../../common/components/table-list/TableList';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { useRouter } from 'next/router';
import { selectPageContext } from '../../../../../../store/slices/pageContext';
import { ColumnType } from '../../../../../../common/components/table/tableTypes';

interface props {
   values: any;
   handleChange: (e: any) => void;
   handleBlur: (e: any) => void;
}

const BatteryTable = ({ values, handleChange, handleBlur }: props) => {
   useEffect(() => {
      console.log('use', values);
   }, [values]);

   const handleInputChange = (id: any, field: any, value: any) => {
      console.log('id, field, value, ', id, field, value);

      const updatedBatteries = values.batteries.map((battery: any) => {
         const copyBattery = battery;
         if (copyBattery.id === id) {
            let updatedBattery = copyBattery;
            updatedBattery[field] = value;
            return updatedBattery;
         }
         return copyBattery;
      });

      handleChange({ target: { type: 'text', name: 'batteries', value: updatedBatteries } });
   };

   const handleDeleteAction = ({ actionKey, item, newData }: any) => {
      const updatedBatteries = [...values.batteries].filter((battery) => battery?.id !== item?.id);
      handleChange({ target: { type: 'text', name: 'batteries', value: updatedBatteries } });
   };

   const handleAddOption = () => {
      const randomId = Math.random().toString().slice(2, 7);
      if (values?.batteries == undefined) {
         values.batteries = [];
      }
      const tempbatteries = [
         ...values.batteries,
         { id: randomId, name: '', price: '', actionsConfig: { delete: true } },
      ];

      handleChange({
         target: {
            type: 'text',
            name: 'batteries',
            value: tempbatteries,
         },
      });
   };

   const columns: ColumnType[] = [
      {
         keyPath: ['name'],
         title: 'Name',
         colSpan: 1,
         render: ({ item }) => {
            return (
               <div className='flex mb-[10px]'>
                  <div>
                     <Input
                        name={item.id + '-name'}
                        value={item.name}
                        onChange={(e) => handleInputChange(item.id, 'name', e.target.value)}
                     />
                  </div>
                  <div className='ml-[10px]'>
                     <Input
                        type='number'
                        name={item.id + '-price'}
                        value={item.price}
                        onChange={(e) => handleInputChange(item.id, 'price', e.target.value)}
                     />
                  </div>
               </div>
            );
         },
      },
   ];

   return (
      <TableList
         data={values?.batteries || []}
         columns={columns}
         showChildButton
         childButtonCallback={handleAddOption}
         childButtonText='Add Selection'
         childButtonIconName='Plus'
         childButtonIconColor='gray'
         emptyStateDisplayText='No batteries'
         actions={[
            {
               icon: 'TrashCan',
               actionKey: 'delete',
               toolTip: 'Delete Coordinator',
               callback: handleDeleteAction,
            },
         ]}
      />
   );
};

export default BatteryTable;
