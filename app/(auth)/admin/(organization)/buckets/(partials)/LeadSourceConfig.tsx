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
   activeLeadSources: any[];
   onActiveLeadSourcesChange: (activeLeadSources: any[]) => void;
};

const columns: ColumnType[] = [
   {
      keyPath: ['name'],
      title: 'Lead Source',
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

const LeadSourceConfig = ({ onActiveLeadSourcesChange, activeLeadSources }: Props) => {
   const user = useAppSelector(selectUser);
   const userAuthToken = user.token as string;
   const [apiOffset, setApiOffset] = useState<number>(0);
   const [apiLimit, setApiLimit] = useState<number>(40);
   const [apiLeadSources, setApiLeadSources] = useState<any[]>([]);
   const [searchInput, setSearchInput] = useState<any>('');
   const [sourceTypes, setSourceTypes] = useState<any[]>([]);
   const [selectedValue, setSelectedValue] = useState<any>([]);
   const [isTableLoading, setIsTableLoading] = useState<boolean>(true);

   useEffect(() => {
      fetchData(
         `/api/v2/buckets/lead-sources?limit=${apiLimit}&offset=${apiOffset}`,
         'GET',
         userAuthToken,
         undefined
      ).then((data) => {
         const updatedSources = data.data.map((src: any) => {
            const isActive = !!activeLeadSources.find((activeSrc: any) => activeSrc.id === src.id);
            return { ...src, selected: isActive, sortType: 'source' };
         });

         setApiLeadSources(updatedSources);
         setIsTableLoading(!isTableLoading);
      });
   }, []);

   useEffect(() => {
      fetchData(`/api/v2/buckets/lead-sources/types`, 'GET', userAuthToken, undefined).then((data) =>
         setSourceTypes(data)
      );
   }, []);

   const getSourcesByType = async (type: any) => {
      const data = await fetchData(`/api/v2/buckets/lead-sources/types`, 'POST', userAuthToken, { typeId: type.id });
      const updatedSources = data.map((src: any) => {
         const isActive = !!activeLeadSources.find((activeSrc: any) => activeSrc.id === src.id);
         return { ...src, selected: isActive, sortType: 'source' };
      });
      setApiLeadSources(updatedSources);
   };

   const handleSearchBarApi = async () => {
      if (!searchInput) return;
      const data = await fetchData(
         `/api/v2/buckets/lead-sources/?name=${searchInput}`,
         'GET',
         userAuthToken,
         undefined
      );
      const updatedSources = data.data.map((src: any) => {
         const isActive = !!activeLeadSources.find((activeSrc: any) => activeSrc.id === src.id);
         return { ...src, selected: isActive, sortType: 'source' };
      });
      setApiLeadSources(updatedSources);
   };

   const handleLeadSourceSelect = (e: any, rowsSelected: Array<any>, allRowsChecked?: boolean) => {
      const selectedRow = rowsSelected[0];
      let updatedActiveLeadSources;

      console.log('selectedRow', selectedRow);

      if (selectedRow?.selected) {
         console.log('selectedRow');
         updatedActiveLeadSources = activeLeadSources.filter((src: any) => src.id !== selectedRow.id);
      } else {
         updatedActiveLeadSources = [...activeLeadSources, { ...selectedRow, selected: true }];
      }

      console.log('updatedActiveLeadSources', updatedActiveLeadSources);

      onActiveLeadSourcesChange(updatedActiveLeadSources);

      setApiLeadSources((prev) =>
         prev.map((src: any) =>
            src.id === selectedRow.id ? { ...src, selected: !selectedRow.selected, sortType: 'source' } : src
         )
      );
   };

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
         <Panel title={'Select Lead Sources'} collapsible>
            <Grid columnCount={2}>
               <DropDown
                  placeholder='Search By Source Type'
                  selectedValues={selectedValue}
                  options={sourceTypes}
                  keyPath={['typeName']}
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
               data={apiLeadSources}
               columns={columns}
               pagination
               onPaginate={() => {
                  console.log('PAGE');
               }}
               selectableRows
               selectableRowsKey='selected'
               fixedHeader
               onRowsSelect={handleLeadSourceSelect}
               tableHeight={600}
            />
         </Panel>
         {activeLeadSources && (
            <Panel title={'Active Lead Sources'} collapsible>
               <Table
                  columns={columns}
                  data={activeLeadSources}
                  selectableRows
                  pagination
                  onPaginate={() => {
                     console.log('PAGE');
                  }}
                  selectableRowsKey='selected'
                  fixedHeader
                  onRowsSelect={handleLeadSourceSelect}
                  tableHeight={600}
               />
            </Panel>
         )}
      </Grid>
   );
};

export default LeadSourceConfig;
