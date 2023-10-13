'use client';
import {
   ColumnType,
   PaginationConfig,
   SortingConfiguration,
   SortingType,
} from '../../../../common/components/table/tableTypes';
import { useEffect, useState } from 'react';
import Table from '../../../../common/components/table/Table';
import Button from '../../../../common/components/button/Button';
import PageContainer from '../../../../common/components/page-container/PageContainer';
import TableCellLink from '../../../../common/components/table-cell-link/TableCellLink';
import NewLeadModal from './(partials)/NewLeadModal';
import { formatPostgresTimestamp, getTimeDuration } from '../../../../utilities/helpers';
import { fetchDbApi } from '@/serverActions';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import axios from 'axios';
import SearchBar from '@/common/components/search-bar/SearchBar';
import { useRouter } from 'next/navigation';
import useDebounce from '@/common/hooks/useDebounce';

const configureActionsConfig = (arr: Array<any>, actionsConfig: any, sortConfig?: SortingConfiguration) => {
   let newArr = arr?.map((l: any, i: number) => ({ ...l, actionsConfig: actionsConfig }));
   if (sortConfig) {
      const { column, sortType } = sortConfig;
      newArr = newArr.sort((a: any, b: any) => {
         // const valueA = columns[0].keyPath?.reduce((acc, curr) => acc[curr as any], a);
         // const valueB = columns[0].keyPath?.reduce((acc, curr) => acc[curr as any], b);
         // return valueA > valueB ? 1 : -1;
         const valueA = column.keyPath?.reduce((acc, curr) => acc[curr as any], a)?.toLowerCase();
         const valueB = column.keyPath?.reduce((acc, curr) => acc[curr as any], b)?.toLowerCase();

         if (sortType === 0) return valueA > valueB ? 1 : -1;
         else return valueA < valueB ? 1 : -1;
      });
   }
   return newArr;
};

const columns: ColumnType[] = [
   {
      keyPath: ['id'],
      title: 'Lead ID',
      colSpan: 1,
      // sortable: true,
      render: ({ item }: { item: any }) => (
         <TableCellLink path={`/marketing/leads/${item.id}`}>{item.id}</TableCellLink>
      ),
   },
   {
      keyPath: ['fullName'],
      title: 'Lead Name',
      colSpan: 1,
      // sortable: true,
      render: ({ item }: { item: any }) => {
         return !!item?.fullName ? (
            <TableCellLink path={`/marketing/leads/${item.id}`}>{`${item.fullName}`}</TableCellLink>
         ) : (
            <span className='text-lum-gray-300'>N/A</span>
         );
      },
   },
   {
      keyPath: ['owner', 'firstName'],
      title: 'Consultant',
      colSpan: 1,
      // sortable: true,
      render: ({ item }: { item: any }) => {
         return item.owner ? (
            <TableCellLink path={`/admin/users/${item?.owner?.id}`}>{`${item?.owner?.fullName}`}</TableCellLink>
         ) : (
            <span className='text-lum-gray-300'>N/A</span>
         );
      },
   },
   { keyPath: ['leadSource', 'name'], title: 'Lead Source', colSpan: 1 },
   { keyPath: ['status', 'name'], title: 'Status', colSpan: 1 },
   {
      // sortable: true,
      title: 'Age',
      colSpan: 1,
      render: ({ item }) => {
         const seconds = Math.abs(new Date(item?.createdAt).getTime() - new Date().getTime()) / 1000;
         const age = getTimeDuration(seconds);
         return age ? age : <span className='text-lum-gray-300'>N/A</span>;
      },
   },
   {
      keyPath: ['createdAt'],
      title: 'Created',
      colSpan: 1,
      sortable: true,
      render: ({ item }) => <>{formatPostgresTimestamp(item?.createdAt)}</>,
   },
   // {
   //    keyPath: ['createdAtPretty'], // createdAtPretty is a VIRTUAL field
   //    title: 'Created',
   //    colSpan: 1,
   //    sortable: true,
   // },
];

const defaultFetchLeadLimit = 100;
const defaultPaginationConfig: PaginationConfig = { offset: 0, limit: defaultFetchLeadLimit, fetch: false };
const defaultSortingConfig: SortingConfiguration = { column: {}, sortType: SortingType.DESC, fetch: false };

type LeadsProps = { allLeads: Array<any>; totalLeadCount?: number };
const LeadsClient = ({ allLeads, totalLeadCount }: LeadsProps) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);

   const [leads, setLeads] = useState<Array<any>>([...allLeads]);

   const [tableLoading, setTableLoading] = useState<boolean>(false);

   const [sortConfig, setSortConfig] = useState<SortingConfiguration>(defaultSortingConfig);
   const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>(defaultPaginationConfig);

   const [searchValue, setSearchValue] = useState<string>('');
   const [searchResults, setSearchResults] = useState<Array<string>>([]);

   const [showAddLeadModal, setShowAddLeadModal] = useState<boolean>(false);

   const getActionsConfigObj = () => {
      // const userCanArchiveUser = selectUserHasPermission(user, '0f52b67a-e684-41d0-8abe-d620a8eefd8b');
      // const userCanEditUser = selectUserHasPermission(user, '1c6bfe82-0d2a-4287-8507-457fd8892de9');
      const actionsConfig = { edit: true, duplicate: true, delete: true };
      return actionsConfig;
   };

   useEffect(() => {
      if (allLeads?.length) {
         const tempState = [...allLeads]?.map((lead: any) => ({ ...lead, selected: false }));
         const actionsConfig = getActionsConfigObj();
         const dataToStore = configureActionsConfig(tempState, actionsConfig);
         // setLeads(dataToStore);
         setLeads(dataToStore);
      }
   }, []);

   // custom hook to fetch the server with a debounce
   useDebounce(
      async () => {
         if (searchValue?.length < 1) return;
         const token = user?.token;
         const results = await axios
            .get(`/api/v2/leads/query?fullName=${searchValue}`, {
               headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
            })
            .catch((err: any) => {
               console.log('err seraching leads by name:', err);
            });

         const actionsConfig = getActionsConfigObj();
         const tempLeads = configureActionsConfig(results?.data, actionsConfig, sortConfig);

         // setLeads(tempLeads);
         setSearchResults(tempLeads);
      },
      [searchValue],
      500
   );

   const fetchLeads: any = async (offset: number, order: Array<Array<string>> | null) => {
      const token = user?.token;
      return await fetchDbApi(`/api/v2/leads/query`, {
         method: 'POST',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
         cache: 'no-store',
         body: JSON.stringify({
            offset: offset,
            limit: defaultFetchLeadLimit,
            order: order || [['createdAt', 'DESC']],
            include: [
               { model: 'leadSources', as: 'leadSource', required: false }, // for some reason this broke leads for me
               { model: 'statuses', as: 'status', required: false },
               { model: 'users', as: 'owner', required: false },
               { model: 'users', as: 'createdBy', required: false },
               { model: 'users', as: 'setterAgent', required: false },
               {
                  model: 'fieldsOnLeads',
                  include: [{ model: 'leadFields', as: 'leadField', required: false }],
                  required: false,
               },
            ],
         }),
      }).catch((err) => console.log('err:', err));
   };

   useEffect(() => {
      async function runAsync() {
         if (paginationConfig?.fetch) {
            setTableLoading(true);
            let order: any;
            let colToOrderBy: any;

            const { column, sortType } = sortConfig;
            if (column?.keyPath?.includes('createdAtPretty')) colToOrderBy = 'createdAt';
            else colToOrderBy = column.keyPath ? column.keyPath[0] : 'createdAt';

            if (sortType === 0) order = [[colToOrderBy, 'ASC']];
            else order = [[colToOrderBy, 'DESC']];

            const newLeads = await fetchLeads(defaultPaginationConfig?.offset, order);

            setLeads((prevState: Array<any>) => {
               const actionsConfig = getActionsConfigObj();
               const leadsToAdd = configureActionsConfig([...newLeads], actionsConfig, sortConfig);
               return [...prevState, ...leadsToAdd];
            });
            setPaginationConfig((prevState: any) => ({ ...prevState, fetch: false }));
            setTableLoading(false);
         }
      }
      runAsync();
   }, [paginationConfig]);

   useEffect(() => {
      async function runAsync() {
         if (sortConfig?.fetch) {
            setTableLoading(true);
            let order: any;
            let colToOrderBy: any;

            const { column, sortType } = sortConfig;
            if (column?.keyPath?.includes('createdAtPretty')) colToOrderBy = 'createdAt';
            else colToOrderBy = column.keyPath ? column.keyPath[0] : 'createdAt';

            if (sortType === SortingType.ASC) order = [[colToOrderBy, 'ASC']];
            else order = [[colToOrderBy, 'DESC']];

            // reset the pagination config
            setPaginationConfig(defaultPaginationConfig);

            // need to change 'createdAtPretty' to 'createdAt' while sorting
            // because you can't sort a
            const sortConfigCopy = { ...sortConfig };
            // if (sortConfig?.column?.keyPath?.includes('createdAtPretty')) {
            //    sortConfigCopy['column']['keyPath'] = ['createdAt'];
            // }
            const newLeads = await fetchLeads(defaultPaginationConfig?.offset, order);

            const actionsConfig = getActionsConfigObj();
            setLeads(configureActionsConfig(newLeads, actionsConfig, sortConfigCopy));
            setSortConfig((prevState: SortingConfiguration) => ({ ...prevState, fetch: false }));
            setTableLoading(false);
         }
      }
      runAsync();
   }, [sortConfig]);

   const handleRowsSelect = (e: any, rowsSelected: Array<any>, allRowsChecked?: boolean) => {
      if (rowsSelected.length <= 1) {
         // one row selected
         setLeads((prevState: Array<any>) => {
            const copy = [...prevState];
            const foundRowIndex = copy.findIndex((item: any) => item.id === rowsSelected[0]?.id);
            if (foundRowIndex === -1) return [...prevState];
            copy[foundRowIndex].selected = !rowsSelected[0].selected;
            return [...copy];
         });
      } else {
         if (typeof allRowsChecked === undefined) return;
         // every row selected
         setLeads((prevState: Array<any>) => {
            return [...prevState].map((item) => ({ ...item, selected: !allRowsChecked }));
         });
      }
   };

   const handleSearch = async (e: any) => {
      const searchString = e.target.value;
      setSearchValue(searchString);
      // handleQueryLeadsByString(searchString);
      // setLeads(tempLeads);

      // setLeads(() => {
      //    const tempState = [...leads].filter((lead) =>
      //       lead?.fullName.toLowerCase().includes(searchString.toLowerCase())
      //    );
      //    return tempState;
      // });
   };

   return (
      <PageContainer
         breadcrumbsChildren={
            <>
               <Button
                  iconName='Plus'
                  color='blue'
                  onClick={() => {
                     setShowAddLeadModal(true);
                  }}>
                  New Lead
               </Button>
               <Button color='light:dark' iconName='Funnel' size='md' shadow />
               {/* <Input iconName='MagnifyingGlass' value={searchValue} onChange={handleSearch} border shadow /> */}
               <SearchBar
                  placeholder={'Search Leads...'}
                  searchValue={searchValue}
                  handleChange={handleSearch}
                  searchResults={searchResults}
                  onSelectSearchResult={(e: any, result: any) => {
                     if (result.id) router.push(`/marketing/leads/${result.id}`);
                     else console.log('hmmm.... no lead id for result:', result);
                  }}
                  keyPath={['fullName']}
               />
            </>
         }>
         <Table
            columns={columns}
            data={leads}
            // isLoading={tableLoading}
            sortingConfig={sortConfig}
            onTableSort={(column: ColumnType, direction: SortingType, sortedData: Array<any>) => {
               // setLeads(sortedData);
               setSortConfig({ column: column, sortType: direction, fetch: true });
            }}
            pagination
            paginationTotalCount={totalLeadCount}
            onPaginate={(paginationOptions, pageState) => {
               const { rowsPerPage } = paginationOptions;
               const { currPage, prevPage } = pageState;
               if (currPage != prevPage) {
                  // page change
                  let on2ndToLastPage = false;
                  const dataLength = leads?.length;
                  const totalPages = dataLength / rowsPerPage;
                  on2ndToLastPage = totalPages - 1 <= currPage;
                  if (on2ndToLastPage) {
                     console.log('on 2nd to last page on pagination...');
                     setPaginationConfig((prevState: any) => ({
                        ...prevState,
                        offset: prevState?.limit + prevState?.offset,
                        fetch: true,
                     }));
                  }
               }
            }}
            selectableRows
            allRowsSelectable
            selectableRowsKey='selected'
            onRowsSelect={handleRowsSelect}
         />
         <NewLeadModal isOpen={showAddLeadModal} setIsOpen={setShowAddLeadModal} />
      </PageContainer>
   );
};

export default LeadsClient;
