'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PageContainer from '../../../../common/components/page-container/PageContainer';
import SearchBar from '../../../../common/components/search-bar/SearchBar';
import TableCellLink from '../../../../common/components/table-cell-link/TableCellLink';
import Table from '../../../../common/components/table/Table';
import {
   ColumnType,
   PaginationConfig,
   SortingConfiguration,
   SortingType,
} from '../../../../common/components/table/tableTypes';
import { formatPostgresTimestamp } from '@/utilities/helpers';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { fetchDbApi, revalidate } from '@/serverActions';
import useDebounce from '@/common/hooks/useDebounce';

const configureActionsConfig = (arr: Array<any>, actionsConfig: any, sortConfig?: SortingConfiguration) => {
   let newArr = arr?.map((l: any, i: number) => ({ ...l, actionsConfig: actionsConfig }));
   if (sortConfig) {
      const { column, sortType } = sortConfig;
      newArr = newArr.sort((a: any, b: any) => {
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
      title: 'Order Id',
      colSpan: 1,
      render: ({ item }) => <TableCellLink path={`/installs/work-orders/${item.id}`}>{item.id}</TableCellLink>,
   },
   {
      keyPath: ['lead', 'fullName'],
      title: 'Customer',
      colSpan: 1,
      render: ({ item }) => {
         return <TableCellLink path={`/marketing/leads/${item.lead?.id}`}>{item.lead?.fullName}</TableCellLink>;
      },
   },
   { keyPath: ['product', 'name'], title: 'Product', colSpan: 1 },
   { keyPath: ['stage', 'name'], title: 'Stage', colSpan: 1 },
   {
      keyPath: ['owner', 'fullName'],
      title: 'Sales Rep',
      colSpan: 1,
      render: ({ item }) => {
         if (item?.owner) {
            return <TableCellLink path={`/admin/users/${item.owner?.id}`}>{item.owner?.fullName}</TableCellLink>;
         }
      },
   },
   {
      keyPath: ['installSignedDate'],
      title: 'Purchase Date',
      colSpan: 1,
      sortable: true,
      render: ({ item }) => formatPostgresTimestamp(item?.installSignedDate),
   },
   { keyPath: ['daysInStage'], title: 'Days In Stage', colSpan: 1 },
];

const defaultFetchLimit = 100;
const defaultPaginationConfig: PaginationConfig = { offset: 0, limit: defaultFetchLimit, fetch: false };
const defaultSortingConfig: SortingConfiguration = { column: {}, sortType: SortingType.DESC, fetch: false };

interface Props {
   allOrders: Array<any>;
   totalOrderCount: number;
}
const WorkOrdersClient = ({ allOrders, totalOrderCount }: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);

   const [orders, setOrders] = useState<Array<any>>([]);

   const [tableLoading, setTableLoading] = useState<boolean>(false);

   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<Array<string>>([]);

   const [sortConfig, setSortConfig] = useState<SortingConfiguration>(defaultSortingConfig);
   const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>(defaultPaginationConfig);

   const getActionsConfigObj = () => {
      const actionsConfig = { edit: true, duplicate: true, delete: true };
      return actionsConfig;
   };

   useEffect(() => {
      if (!!allOrders?.length) {
         const actionsConfig = getActionsConfigObj();
         const dataToStore = configureActionsConfig(allOrders, actionsConfig);
         setOrders(dataToStore);
      }
   }, []);

   // custom hook to fetch the server with a debounce
   useDebounce(
      async () => {
         if (searchInput?.length < 1) return;
         const token = user?.token;
         const results = await fetchDbApi(`/api/v2/orders/query?leadName=${searchInput}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
         });
         const actionsConfig = getActionsConfigObj();
         const tempOrders = configureActionsConfig(results, actionsConfig, sortConfig);

         setSearchResults(tempOrders);
      },
      [searchInput],
      500
   );

   const fetchOrders: any = async (offset: number, order: Array<Array<string>> | null) => {
      const token = user?.token;
      return await fetchDbApi(`/api/v2/orders/query`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
         body: JSON.stringify({
            limit: defaultFetchLimit,
            offset: offset,
            order: order || [['createdAt', 'DESC']],
            include: [
               { model: 'users', as: 'owner', required: false },
               { model: 'users', as: 'createdBy', required: false },
               { model: 'productsLookup', as: 'product', required: false },
               { model: 'leads', as: 'lead', required: false },
               { model: 'financiersLookup', as: 'financier', required: false },
               { model: 'utilityCompaniesLookup', as: 'utilityCompany', required: false },
            ],
         }),
      });
   };

   useEffect(() => {
      async function runAsync() {
         if (paginationConfig?.fetch) {
            setTableLoading(true);
            let order: any;
            let colToOrderBy: any;

            const { column, sortType } = sortConfig;
            colToOrderBy = column.keyPath ? column.keyPath[0] : 'createdAt';

            if (sortType === 0) order = [[colToOrderBy, 'ASC']];
            else order = [[colToOrderBy, 'DESC']];

            const newOrders = await fetchOrders(defaultPaginationConfig?.offset, order);

            setOrders((prevState: Array<any>) => {
               const actionsConfig = getActionsConfigObj();
               // instead of reconfiguring all orders, just configure the new orders
               const ordersToAdd = configureActionsConfig([...newOrders], actionsConfig, sortConfig);
               // then append to the current state so the current state doesn't reload on the table
               return [...prevState, ...ordersToAdd];
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
            colToOrderBy = column.keyPath ? column.keyPath[0] : 'createdAt';

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
            const newOrders = await fetchOrders(defaultPaginationConfig?.offset, order);

            const actionsConfig = getActionsConfigObj();
            setOrders(configureActionsConfig(newOrders, actionsConfig, sortConfigCopy));
            setSortConfig((prevState: SortingConfiguration) => ({ ...prevState, fetch: false }));
            setTableLoading(false);
         }
      }
      runAsync();
   }, [sortConfig]);

   const handleSearchInput = (e: any) => {
      const searchVal = e.target.value;
      setSearchInput(searchVal);
   };

   const handleActionClick = (e: any, actionKey: string, item: any) => {};

   const handleColumnCallback = ({ item, column }: { item: any; column: any }) => {
      console.log(item, column, 'clicked');
   };

   return (
      <PageContainer
         breadcrumbsChildren={
            <>
               <SearchBar
                  placeholder='Search Orders by Lead'
                  keyPath={['id']}
                  searchValue={searchInput}
                  handleChange={handleSearchInput}
                  searchResults={searchResults}
                  onSelectSearchResult={async (e, result) => {
                     const url = `/installs/work-orders/${result.id}`;
                     await revalidate({ path: url });
                     if (result?.id) router.push(url);
                     else console.log('hmm... no order id for result:', result);
                  }}
               />
            </>
         }>
         <Table
            columns={columns}
            data={orders}
            // isLoading={tableLoading}
            sortingConfig={sortConfig}
            onTableSort={(column: any, direction: any, sortedData: Array<any>) => {
               // setOrders(sortedData);
               setSortConfig({ column: column, sortType: direction, fetch: true });
            }}
            onCellEvent={handleColumnCallback}
            pagination
            paginationTotalCount={totalOrderCount}
            onPaginate={(paginationOptions, pageState) => {
               const { rowsPerPage } = paginationOptions;
               const { currPage, prevPage } = pageState;

               if (currPage != prevPage) {
                  // page change
                  let on2ndToLastPage = false;
                  const dataLength = orders?.length;
                  const totalPages = dataLength / rowsPerPage;
                  on2ndToLastPage = totalPages - 1 <= currPage;

                  if (on2ndToLastPage) {
                     console.log('on last page on pagination...');
                     setPaginationConfig((prevState: any) => ({
                        ...prevState,
                        offset: prevState?.limit + prevState?.offset,
                        fetch: true,
                     }));
                  }
               }
            }}
         />
      </PageContainer>
   );
};

export default WorkOrdersClient;
