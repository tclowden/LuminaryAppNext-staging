'use client';

import { ColumnType } from '../../../../../../common/components/table/tableTypes';
import TableCellLink from '../../../../../../common/components/table-cell-link/TableCellLink';
import Table from '../../../../../../common/components/table/Table';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { Bucket } from './types';
import { useEffect, useState } from 'react';
import Grid from '@/common/components/grid/Grid';
import Panel from '@/common/components/panel/Panel';
import { selectUser } from '@/store/slices/user';
import DropDown from '@/common/components/drop-down/DropDown';
import SearchBar from '@/common/components/search-bar/SearchBar';
import Button from '@/common/components/button/Button';

const columns: ColumnType[] = [
   {
      keyPath: ['fullName'],
      title: 'User',
      colSpan: 1,
      render: ({ item }: { item: any }) => (
         <TableCellLink path={`/admin/users/${item.id}`}>{item.fullName}</TableCellLink>
      ),
   },
];

type Props = {
   onActiveUserChange: (bucketUsers: any[]) => void;
   activeBucketUsers: any[];
};

const fetchData = async (url: string, method: string = 'GET', userAuthToken: string, body?: any) => {
   const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${userAuthToken}` };
   const response = await fetch(url, { method, headers, body: JSON.stringify(body) });
   return await response.json();
};

const UsersTable = ({ onActiveUserChange, activeBucketUsers }: Props) => {
   const user = useAppSelector(selectUser);
   const userAuthToken = user.token as string;
   const [apiUsers, setApiUsers] = useState<any[]>([]);
   const [salesTeams, setSalesTeams] = useState<any[]>([]);
   const [searchInput, setSearchInput] = useState<string>('');
   const [isTableLoading, setIsTableLoading] = useState<boolean>(true);
   const [searchResults, setSearchResults] = useState<any>([]);

   useEffect(() => {
      fetchData(`/api/v2/buckets/users`, 'GET', userAuthToken, undefined).then((data) => {
         const updatedUsers = data.users.map((usr: any) => {
            const isActive = !!activeBucketUsers.find((activeUser: any) => activeUser.id === usr.id);
            return { ...usr, selected: isActive };
         });
         setApiUsers(updatedUsers);
         setSalesTeams(data.teams);
         setIsTableLoading(false);
      });
   }, []);

   const handleSearchApi = (searchParam: string, searchParamValue: string) => {
      fetchData(`/api/v2/buckets/users?${searchParam}=${searchParamValue}`, 'GET', userAuthToken, undefined).then(
         (data) => {
            const updatedUsers = data.users.map((usr: any) => {
               const isActive = !!activeBucketUsers.find((activeUser: any) => activeUser.id === usr.id);
               return { ...usr, selected: isActive };
            });
            setApiUsers(updatedUsers);
         }
      );
   };

   const handleActiveUserChange = (e: any, rowsSelected: Array<any>, allRowsChecked?: boolean) => {
      const selectedRow = rowsSelected[0];
      let updatedActiveUsers;

      if (selectedRow?.selected) {
         updatedActiveUsers = activeBucketUsers.filter((usr: any) => usr.id !== selectedRow.id);
      } else {
         updatedActiveUsers = [...activeBucketUsers, { ...selectedRow, selected: true }];
      }

      onActiveUserChange(updatedActiveUsers);

      setApiUsers((prev) =>
         prev.map((usr: any) => (usr.id === selectedRow.id ? { ...usr, selected: !selectedRow.selected } : usr))
      );
   };

   const handlePagination = () => {
      console.log('handle page');
   };

   const debounce = (func: any, wait: any) => {
      let timeout: any;
      return (...args: any) => {
         clearTimeout(timeout);
         timeout = setTimeout(() => func.apply(this, args), wait);
      };
   };

   const handleSearchApiDebounced = debounce((searchParam: string, searchParamValue: string) => {
      handleSearchApi(searchParam, searchParamValue);
   }, 300);

   return (
      <Grid>
         <Panel title={'User Select'} collapsible>
            <Grid columnCount={2}>
               <DropDown
                  placeholder='Search By Team'
                  selectedValues={[]}
                  options={salesTeams}
                  keyPath={['name']}
                  searchable
                  onOptionSelect={(e: any, team: any) => {
                     console.log('teamID: ', team.id);
                     handleSearchApi('teamId', team.id);
                  }}
               />
               <SearchBar
                  placeholder='Search By Name'
                  searchValue={searchInput}
                  searchResults={searchResults}
                  handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     setSearchInput(e.target.value);
                     handleSearchApiDebounced('userName', e.target.value);
                  }}
                  onSelectSearchResult={(e: any, result: any) => {
                     console.log('SELECTED');
                  }}
                  keyPath={['firstName']}
               />
            </Grid>
            <Table
               isLoading={isTableLoading}
               data={apiUsers}
               columns={columns}
               pagination
               onPaginate={handlePagination}
               onRowsSelect={handleActiveUserChange}
               selectableRows
               selectableRowsKey='selected'
               fixedHeader
            />
         </Panel>

         <Panel title={'Users Assigned to Bucket'} collapsible>
            <Table
               data={activeBucketUsers}
               columns={columns}
               onRowsSelect={handleActiveUserChange}
               selectableRows
               selectableRowsKey='selected'
               fixedHeader
               tableHeight={400}
            />
         </Panel>
      </Grid>
   );
};

export default UsersTable;
