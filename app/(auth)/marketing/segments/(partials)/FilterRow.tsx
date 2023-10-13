import React, { useCallback } from 'react';
import Button from '../../../../../common/components/button/Button';
import DropDown from '../../../../../common/components/drop-down/DropDown';

type Props = {
   filter: any;
   startingDropDownMap: any[];
   onFilterChange: (key: any, arg: any) => void;
};
const comparisonOperators = [
   {
      comparisonOperator: 'Is',
   },
   {
      comparisonOperator: 'Is Not',
   },
   {
      comparisonOperator: 'Is In',
   },
   {
      comparisonOperator: 'Is Not In',
   },
];

export default function FilterRow({ filter, startingDropDownMap, onFilterChange }: Props) {
   console.log('filter:', filter);
   const handleOptionSelect = useCallback(
      (key: string, value: any) => {
         onFilterChange(key, value);
      },
      [onFilterChange]
   );

   return (
      <div className='border-t-[1px] border-lum-gray-500 pt-[20px] mb-[10px]'>
         <div className='flex flex-wrap justify-space gap-[10px]'>
            <DropDown
               keyPath={['columnDisplayName']}
               placeholder='Select Field'
               selectedValues={filter.columnDisplayName ? [filter] : []}
               options={startingDropDownMap}
               onOptionSelect={(e, arg) => handleOptionSelect('columnDisplayNameChange', arg)}
            />

            <DropDown
               keyPath={['comparisonOperator']}
               selectedValues={filter.comparisonOperator ? [filter] : []}
               placeholder='Select Operator'
               options={comparisonOperators}
               onOptionSelect={(e, arg) => handleOptionSelect('comparisonOperatorChange', arg)}
            />

            {filter.columnValues.length > 0 ? (
               filter.columnValues.map((columnValue: any, index: any) => (
                  <div className='flex flex-row' key={index}>
                     <DropDown
                        searchable
                        key={index}
                        keyPath={['columnValue']}
                        selectedValues={columnValue ? [columnValue] : []}
                        placeholder='Select Value'
                        options={filter.valueOptions ? filter?.valueOptions : []}
                        onOptionSelect={(e, arg) => {
                           const oldAndNewColVals = {
                              oldValue: columnValue,
                              newValue: arg,
                           };
                           handleOptionSelect('updateValueOption', oldAndNewColVals);
                        }}
                     />

                     {(filter.comparisonOperator === 'Is In' || filter.comparisonOperator === 'Is Not In') && (
                        <p className='flex items-end ml-[5px]'>,</p>
                     )}

                     {(filter.comparisonOperator === 'Is In' || filter.comparisonOperator === 'Is Not In') &&
                        index === filter.columnValues.length - 1 && (
                           <DropDown
                              searchable
                              keyPath={['columnValue']}
                              selectedValues={[]}
                              placeholder='Select Value'
                              options={filter.valueOptions ? filter?.valueOptions : []}
                              onOptionSelect={(e, arg) => handleOptionSelect('newValueOption', arg)}
                           />
                        )}
                  </div>
               ))
            ) : (
               <DropDown
                  searchable
                  keyPath={['columnValue']}
                  selectedValues={[]}
                  placeholder='Select Value'
                  options={filter.valueOptions ? filter?.valueOptions : []}
                  onOptionSelect={(e, arg) => handleOptionSelect('newValueOption', arg)}
               />
            )}

            <div className='flex flex-row items-center justify-end ml-auto'>
               <Button
                  iconName='TrashCan'
                  size='sm'
                  onClick={() => {
                     handleOptionSelect('delete', true);
                  }}
               />
            </div>
         </div>
      </div>
   );
}
