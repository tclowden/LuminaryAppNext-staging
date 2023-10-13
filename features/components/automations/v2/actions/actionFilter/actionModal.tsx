'use client'
import FilterRow from '@/app/(auth)/marketing/segments/(partials)/FilterRow';
import { ActionProps } from './actionData'
import Input from '@/common/components/input/Input'
import { fetchDbApi } from '@/serverActions';
import React, { useState, useEffect } from 'react'
import Grid from '@/common/components/grid/Grid';
import DropDown from '@/common/components/drop-down/DropDown';
import { twMerge } from 'tailwind-merge';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';

type Filter = {
   id?: string;
   columnDisplayName: string;
   comparisonOperator: 'Is' | 'Is Not' | 'Is In' | 'Is Not In' | null;
   columnValues: {
      id: string;
      columnValue: string;
   }[];
   valueOptions: any[];
};

export const ActionModal = ({ options, onData }: ActionProps) => {
   const [filterData] = useState<any[]>(options?.filterData || [])
   const [isLoading, setIsLoading] = useState<boolean>(options?.filterData.length > 0 ? true : false);
   const [state, setState] = useState({
      filters: [] as Filter[],
      startingDropDownMap: [],
      name: '',
      leadCount: 0,
      leads: [],
      id: 'actionFilter',
   });

   useEffect(() => {
      // Strip the valueOptions from the filter
      const filterData = state.filters.map((filter: any) => {
         const { valueOptions, ...rest } = filter;
         return rest;
      });

      onData({ filterData })
   }, [state])

   useEffect(() => {

      fetchDbApi(`/api/v2/segments/settings`, {
         method: 'GET',
      }).then((columnDropDowns) => {

         if (filterData) {
            // add the correct columnDropDown.valueOptions to each filter based on the filter.columnDisplayName
            const filters = filterData.map((filter: any) => {
               const columnDisplayName = filter.columnDisplayName;
               const valueOptions = columnDropDowns.find(
                  (col: any) => col.columnDisplayName === columnDisplayName
               )?.valueOptions;
               return {
                  ...filter,
                  valueOptions,
               };
            });
            setState((prevState) => ({
               ...prevState,
               filters: [...filters],
            }));
         }

         setState(prev => ({ ...prev, startingDropDownMap: columnDropDowns }))
         setIsLoading(false);
      });

      return () => {
      }
   }, [filterData])

   const handleFilterChange = (
      index: number,
      key: string,
      value: {
         columnDisplayName: any;
         valueOptions: any;
         newValue: any;
         oldValue: { id: string };
         comparisonOperator: any;
      }
   ) => {
      // Special handling for 'delete' case and 'newRow' case
      if (key === 'delete') {
         setState((prevState) => ({ ...prevState, filters: prevState.filters.filter((_, i) => i !== index) }));
         return;
      }

      if (key === 'newRow') {
         const newFilter: Filter = {
            columnDisplayName: value.columnDisplayName,
            comparisonOperator: null,
            columnValues: [],
            valueOptions: value.valueOptions,
         };
         setState((prevState) => ({ ...prevState, filters: [...prevState.filters, newFilter] }));
         return;
      }
      setState((prevState) => ({
         ...prevState,
         filters: prevState.filters.map((filter, i) => {
            if (i !== index) return filter; // If not the target filter, return it unchanged

            // Define mappings here, to update the filter object based on the provided key
            const mappings: any = {
               columnDisplayNameChange: () => ({
                  ...filter,
                  columnDisplayName: value.columnDisplayName,
                  valueOptions: value.valueOptions,
                  columnValues: [],
                  comparisonOperator: null,
               }),
               newValueOption: () => ({
                  ...filter,
                  columnValues: [...filter.columnValues, value],
               }),
               updateValueOption: () => ({
                  ...filter,
                  columnValues: [
                     value.newValue,
                     ...filter.columnValues.filter((colVal) => colVal.id !== value.oldValue.id),
                  ],
               }),
               comparisonOperatorChange: () => ({
                  ...filter,
                  comparisonOperator: value.comparisonOperator,
               }),
            };

            const updatedFilter: any = mappings[key] ? mappings[key]() : filter;
            return updatedFilter;
         }),
      }));
   };

   return (
      <>
         <div className='mb-3'>Continue the flow if...</div>

         {state.filters.map((filter, index) => (
            <FilterRow
               key={index}
               filter={filter}
               startingDropDownMap={state.startingDropDownMap}
               onFilterChange={(key, value) => handleFilterChange(index, key, value)}
            />
         ))}

         <div className={twMerge(
            `border-t-[1px] border-b-[1px] border-lum-gray-500 pt-[20px] pb-[20px] mb-[15px]`
         )}>
            <Grid columnCount={5}>
               <DropDown
                  keyPath={['columnDisplayName']}
                  className='bg-color-white min-w-[160px]'
                  placeholder='+ New Filter'
                  selectedValues={[]}
                  options={state.startingDropDownMap}
                  onOptionSelect={(e, arg) => handleFilterChange(0, 'newRow', arg)}
               />
            </Grid>
            <LoadingBackdrop isOpen={isLoading} />
         </div>
      </>
   )
}

export default ActionModal