'use client';
import DropDown from '@/common/components/drop-down/DropDown';
import Grid from '@/common/components/grid/Grid';
import Panel from '@/common/components/panel/Panel';
import SearchBar from '@/common/components/search-bar/SearchBar';
import Table from '@/common/components/table/Table';
import { ColumnType } from '@/common/components/table/tableTypes';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import React, { useEffect, useState } from 'react';
import { Bucket } from './types';

type Props = {
   activeStatuses: any[];
   onActiveStatusesChange: (activeStatuses: any[]) => void;
};

const columns: ColumnType[] = [
   {
      keyPath: ['name'],
      title: 'Status Name',
   },
   {
      keyPath: ['leadCount'],
      title: 'Count',
   },
];

const fetchData = async (url: string, method: string = 'GET', userAuthToken: string, body?: any) => {
   const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${userAuthToken}` };
   const response = await fetch(url, { method, headers, body: JSON.stringify(body) });
   return await response.json();
};

const StatusConfig = ({ onActiveStatusesChange, activeStatuses }: Props) => {
   const user = useAppSelector(selectUser);
   const userAuthToken = user.token as string;
   const [apiStatuses, setApiStatuses] = useState<any[]>([]);
   const [sourceTypes, setSourceTypes] = useState<any[]>([]);
   const [selectedValue, setSelectedValue] = useState<any>([]);
   const [isTableLoading, setIsTableLoading] = useState<boolean>(true);
   const [searchInput, setSearchInput] = useState<string>('');

   useEffect(() => {
      fetchData(`/api/v2/buckets/statuses`, 'GET', userAuthToken, undefined).then((data) => {
         const updatedStatues = data.data.map((stat: any) => {
            const isActive = !!activeStatuses.find((activeStat: any) => activeStat.id === stat.id);
            return { ...stat, selected: isActive, sortType: 'status' };
         });
         setApiStatuses(updatedStatues);
         setIsTableLoading(!isTableLoading);
      });
   }, []);

   useEffect(() => {
      fetchData(`/api/v2/buckets/statuses/types`, 'GET', userAuthToken, undefined).then((data) => setSourceTypes(data));
   }, []);

   const getSourcesByType = async (type: any) => {
      const data = await fetchData(`/api/v2/buckets/statuses/types`, 'POST', userAuthToken, { typeId: type.id });
      const updatedStatues = data.map((stat: any) => {
         const isActive = !!activeStatuses.find((activeStat: any) => activeStat.id === stat.id);
         return { ...stat, selected: isActive, sortType: 'status' };
      });
      setApiStatuses(updatedStatues);
   };

   const handleSearchBarApi = async () => {
      if (!searchInput) return;
      const data = await fetchData(`/api/v2/buckets/statuses/?name=${searchInput}`, 'GET', userAuthToken, undefined);
      const updatedStatuses = data.data.map((stat: any) => {
         const isActive = !!activeStatuses.find((activeStat: any) => activeStat.id === stat.id);
         return { ...stat, selected: isActive, sortType: 'status' };
      });
      setApiStatuses(updatedStatuses);
   };

   const handleStatusSelect = (e: any, rowsSelected: Array<any>, allRowsChecked?: boolean) => {
      const selectedRow = rowsSelected[0];
      let updatedActiveStatuses;

      if (selectedRow?.selected) {
         updatedActiveStatuses = activeStatuses.filter((src: any) => src.id !== selectedRow.id);
      } else {
         updatedActiveStatuses = [...activeStatuses, { ...selectedRow, selected: true }];
      }

      onActiveStatusesChange(updatedActiveStatuses);

      setApiStatuses((prev) =>
         prev.map((src: any) =>
            src.id === selectedRow.id ? { ...src, selected: !selectedRow.selected, sortType: 'status' } : src
         )
      );
   };

   const handlePagination = () => {};

   const debounce = (func: any, wait: any) => {
      let timeout: any;
      return (...args: any) => {
         clearTimeout(timeout);
         timeout = setTimeout(() => func.apply(this, args), wait);
      };
   };

   const handleSearchApiDebounced = debounce(() => {
      handleSearchBarApi();
   }, 300);

   return (
      <Grid>
         <Panel title={'Select Statuses'} collapsible>
            <Grid columnCount={2}>
               <DropDown
                  placeholder='Search By Status Type'
                  selectedValues={selectedValue}
                  options={sourceTypes}
                  keyPath={['name']}
                  searchable
                  onOptionSelect={(e: any, type: any) => {
                     getSourcesByType(type);
                     setSelectedValue([type]);
                  }}
               />
               <SearchBar
                  searchValue={searchInput}
                  placeholder='Search By Name'
                  searchResults={[]}
                  handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     setSearchInput(e.target.value);
                     handleSearchApiDebounced(e.target.value);
                  }}
                  onSelectSearchResult={(e: any, result: any) => {}}
                  keyPath={['N/A']}
               />
            </Grid>
            <Table
               isLoading={isTableLoading}
               data={apiStatuses}
               columns={columns}
               selectableRows
               selectableRowsKey='selected'
               pagination
               onPaginate={handlePagination}
               fixedHeader
               onRowsSelect={handleStatusSelect}
               tableHeight={1000}
            />
         </Panel>
         {activeStatuses && (
            <Panel title={'Active Statuses'} collapsible>
               <Table
                  columns={columns}
                  data={activeStatuses}
                  selectableRows
                  selectableRowsKey='selected'
                  fixedHeader
                  onRowsSelect={handleStatusSelect}
                  tableHeight={600}
               />
            </Panel>
         )}
      </Grid>
   );
};

export default StatusConfig;
