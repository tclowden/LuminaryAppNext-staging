'use client';
import Button from '@/common/components/button/Button';
import FilterRow from '@/app/(auth)/marketing/segments/(partials)/FilterRow';
import DropDown from '@/common/components/drop-down/DropDown';
import Explainer from '@/common/components/explainer/Explainer';
import Grid from '@/common/components/grid/Grid';
import Input from '@/common/components/input/Input';
import PageContainer from '@/common/components/page-container/PageContainer';
import Panel from '@/common/components/panel/Panel';
import Table from '@/common/components/table/Table';
import { ColumnType } from '@/common/components/table/tableTypes';
import Tabs from '@/common/components/tabs/Tabs';
import ToggleSwitch from '@/common/components/toggle-switch/ToggleSwitch';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import useDebounce from '@/common/hooks/useDebounce';
import TableCellLink from '@/common/components/table-cell-link/TableCellLink';
import { revalidate } from '@/serverActions';
import { setAddToast } from '@/store/slices/toast';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';

type StartingDropDownMap = {
   columnDisplayName: string;
   valueOptions?: {
      id: string;
      columnValue: string;
   }[];
}[];

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

const tabs = [
   {
      name: 'Configure Segment',
      iconName: 'Gear',
   },
   {
      name: 'Leads',
      iconName: 'Users',
   },
];
const columns: ColumnType[] = [
   {
      keyPath: ['fullName'],
      title: 'Lead Name',
      colSpan: 1,
      render: ({ item }) => {
         return <TableCellLink path={`/marketing/leads/${item?.id}`}>{item?.fullName}</TableCellLink>;
      },
   },
   {
      keyPath: ['phoneNumber'],
      title: 'Phone Number',
      colSpan: 1,
   },
   {
      keyPath: ['status', 'name'],
      title: 'Status',
      colSpan: 1,
   },
   {
      keyPath: ['leadSource', 'name'],
      title: 'Lead Source',
      colSpan: 1,
   },
   {
      keyPath: ['createdAt'],
      title: 'Date Created',
      colSpan: 1,
   },
];
type Props = {
   columnDropDowns: StartingDropDownMap;
   segment: any;
};
export default function SingleSegmentClient({ columnDropDowns, segment }: Props) {
   const dispatch = useAppDispatch();
   const [activeNavIndex, setActiveNavIndex] = useState<number>(0);
   const user = useAppSelector(selectUser);
   const router = useRouter();
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [state, setState] = useState({
      filters: [] as Filter[],
      startingDropDownMap: columnDropDowns,
      name: '',
      leadCount: 0,
      leads: [],
      id: segment?.id || 'new',
   });

   useEffect(() => {
      if (segment) {
         // add the correct columnDropDown.valueOptions to each filter based on the filter.columnDisplayName
         const filters = segment.filter.map((filter: any) => {
            const columnDisplayName = filter.columnDisplayName;
            const valueOptions = columnDropDowns.find(
               (col) => col.columnDisplayName === columnDisplayName
            )?.valueOptions;
            return {
               ...filter,
               valueOptions,
            };
         });
         setState((prevState) => ({
            ...prevState,
            filters: [...filters],
            name: segment.name,
            leadCount: segment.leadCount,
            leads: segment.leads,
         }));
      }
   }, [segment]);

   async function queryLeadsInFilter(authToken: string | null, filter: any) {
      try {
         const response = await fetch(`/api/v2/segments/query`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(filter),
         });

         if (response.ok) {
            const data = await response.json();
            console.log('data:', data);
            setState((prevState) => ({
               ...prevState,
               leads: data.rows,
               leadCount: data.count || 0,
            }));
         } else {
            setState((prevState) => ({
               ...prevState,
               leads: [],
               leadCount: 0,
            }));
         }
      } catch (err) {
         console.log('err querying leads in filter: ', err);
      }
   }

   async function saveFilter(authToken: string | null) {
      try {
         setIsLoading(true);
         // Strip the valueOptions from the filter
         const filterWithoutValueOptions = state.filters.map((filter: any) => {
            const { valueOptions, ...rest } = filter;
            return rest;
         });
         const response = await fetch(`/api/v2/segments`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
               id: state?.id,
               name: state.name,
               filter: filterWithoutValueOptions,
            }),
         });

         if (response.ok) {
            const data = await response.json();
            const url = `/marketing/segments`;
            await revalidate({ path: url });
            router.push(url);
            setIsLoading(false);
            dispatch(
               setAddToast({
                  iconName: 'CheckMarkCircle',
                  details: [
                     {
                        label: 'Success',
                        text: 'Segment Saved!',
                     },
                  ],
                  variant: 'success',
                  autoCloseDelay: 2,
               })
            );
         } else {
            console.log('response:', response);
         }
      } catch (err) {
         console.log('err saving to db: ', err);
      }
   }

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

   useDebounce(
      async () => {
         if (state.filters.length < 1) {
            setState((prevState) => ({ ...prevState, leads: [], leadCount: 0 }));
            return;
         }
         const hasMissingColumns = state.filters.some((filter: any) => {
            if (!filter.columnDisplayName) return true;
            if (!filter.comparisonOperator) return true;
            if (!filter.columnValues.length) return true;
         });

         if (hasMissingColumns) return;

         queryLeadsInFilter(user.token, state);
      },
      [state.filters, user],
      500
   );

   return (
      <PageContainer
         breadcrumbsChildren={
            <>
               <Button color='blue' onClick={async (e) => await saveFilter(user.token)}>
                  Save
               </Button>
               <Button
                  onClick={async () => {
                     const url = `/marketing/segments`;
                     await revalidate({ path: url });
                     router.push(url);
                  }}>
                  Cancel
               </Button>
            </>
         }>
         <Grid columnCount={1} rowGap={10}>
            <Panel title='Segment Details' collapsible={false}>
               <div className='flex flex-col'>
                  <span>Leads In Segment</span>
                  <span>{state.leadCount}</span>
               </div>
            </Panel>
            <Tabs tabs={tabs} activeTabIndex={activeNavIndex} setActiveTabIndex={setActiveNavIndex} />
            {activeNavIndex === 0 && (
               <>
                  <Explainer
                     description={
                        'Give your Segment a name, if you want the leads to dynamically be added and removed over time, choose dynamic Segment Type.'
                     }>
                     <Grid columnCount={2} columnGap={10}>
                        <Input
                           label='Segment Name'
                           value={state.name}
                           placeholder='Enter Segment Name'
                           onChange={(e: any) => {
                              console.log('segment name changed');
                              setState((prevState) => ({ ...prevState, name: e.target.value }));
                           }}></Input>
                        <ToggleSwitch checked={true} disabled={true} label={'dynamic segment?'} />
                     </Grid>
                  </Explainer>
                  <Panel title={'Create Filter'} collapsible>
                     {state.filters.map((filter, index) => (
                        <FilterRow
                           key={index}
                           filter={filter}
                           startingDropDownMap={state.startingDropDownMap}
                           onFilterChange={(key, value) => handleFilterChange(index, key, value)}
                        />
                     ))}

                     <div
                        className={twMerge(
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
                     </div>
                  </Panel>
               </>
            )}

            {activeNavIndex === 1 && <Table data={state.leads} columns={columns} pagination></Table>}
         </Grid>
         <LoadingBackdrop isOpen={isLoading} />
      </PageContainer>
   );
}
