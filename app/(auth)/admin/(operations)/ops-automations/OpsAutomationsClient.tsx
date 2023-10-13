'use client';
import Button from '@/common/components/button/Button';
import PageContainer from '@/common/components/page-container/PageContainer';
import SearchBar from '@/common/components/search-bar/SearchBar';
import Table from '@/common/components/table/Table';
import { PaginationConfig, SortingConfiguration, SortingType } from '@/common/components/table/tableTypes';
import useDebounce from '@/common/hooks/useDebounce';
import { fetchDbApi, revalidate } from '@/serverActions';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const configureActionsConfig = (arr: Array<any>, actionsConfig: any, sortConfig: any) => {
   const { column, sortType } = sortConfig;
   return arr
      ?.map((u: any, i: number) => ({
         ...u,
         triggers: u?.triggers?.length,
         actions: u?.actions?.length,
         isActive: u?.isActive ? 'Yes' : 'No',
         actionsConfig: actionsConfig,
      }))
      .sort((a: any, b: any) => {
         const valueA = column.keyPath?.reduce((acc: any, curr: any) => acc[curr as any], a)?.toLowerCase();
         const valueB = column.keyPath?.reduce((acc: any, curr: any) => acc[curr as any], b)?.toLowerCase();
         if (sortType === 0) return valueA > valueB ? 1 : -1;
         else return valueA < valueB ? 1 : -1;
      });
};

const columns: Array<any> = [
   { keyPath: ['name'], title: 'Flow Name', colSpan: 2, sortable: true },
   { keyPath: ['triggers'], title: 'Triggers', colSpan: 1, sortable: true },
   { keyPath: ['actions'], title: 'Actions', colSpan: 1, sortable: true },
   { keyPath: ['isActive'], title: 'Active?', colSpan: 1, sortable: false },
];

interface Props {
   allAutomations: Array<any>;
   automationCount: number;
}

const defaultFetchLimit = 100;
const defaultPaginationConfig: PaginationConfig = { offset: 0, limit: defaultFetchLimit, fetch: false };
const defaultSortingConfig: SortingConfiguration = { column: columns[0], sortType: SortingType.ASC };

const OpsAutomationsClient = ({ allAutomations, automationCount }: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   // console.log('automations:', allAutomations);
   // console.log('automationCount:', typeof automationCount);
   const [automations, setAutomations] = useState<Array<any>>([]);

   const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>(defaultPaginationConfig);
   const [sortConfig, setSortConfig] = useState<SortingConfiguration>(defaultSortingConfig);

   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<any[]>([]);

   const getActionsConfigObj = () => {
      const actionsConfig = { edit: true, delete: true };
      return actionsConfig;
   };

   useEffect(() => {
      if (!!allAutomations?.length) {
         const actionsConfig = getActionsConfigObj();
         const automationsToStore = configureActionsConfig(allAutomations, actionsConfig, sortConfig);
         setAutomations(automationsToStore);
      }
   }, []);

   // custom hook to fetch the server with a debounce
   useDebounce(
      async () => {
         if (searchInput?.length < 1) return;
         console.log('debouncing...');
         const token = user?.token;
         const results = await fetchDbApi(`/api/v2/automations/query?type=operations&name=${searchInput}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
         });
         const actionsConfig = getActionsConfigObj();
         const tempAutomations = configureActionsConfig(results, actionsConfig, sortConfig);
         setSearchResults(tempAutomations);
      },
      [searchInput],
      250
   );

   const fetchAutomations = async (offset: number, order: Array<Array<any>> | null) => {
      const token = user?.token;
      return await fetchDbApi(`/api/v2/automations/query?type=operations`, {
         method: 'POST',
         body: JSON.stringify({
            limit: defaultFetchLimit,
            offset: offset,
            order: order || [['createdAt', 'DESC']],
         }),
      });
   };

   const deleteAutomation = async (id: string) => {
      return await fetchDbApi(`/api/v2/automations/${id}`, {
         method: 'DELETE',
      }).then((res) => {
         setAutomations((prevState: Array<any>) => ( prevState.filter((u: any) => u.id !== id) ));
      });
   }

   useEffect(() => {
      async function runAsync() {
         if (paginationConfig?.fetch) {
            let order: any;
            let colToOrderBy: any;

            const { column, sortType } = sortConfig;
            colToOrderBy = column.keyPath ? column.keyPath[0] : 'name';

            if (sortType === 0) order = [[colToOrderBy, 'ASC']];
            else order = [[colToOrderBy, 'DESC']];

            const newTasks = await fetchAutomations(paginationConfig?.offset, order);
            setAutomations((prevState: Array<any>) => {
               const actionsConfig = getActionsConfigObj();
               const automationsToAdd = configureActionsConfig([...newTasks], actionsConfig, sortConfig);
               return [...prevState, ...automationsToAdd];
            });
            setPaginationConfig((prevState: any) => ({ ...prevState, fetch: false }));
         }
      }
      runAsync();
   }, [paginationConfig]);

   useEffect(() => {
      async function runAsync() {
         if (sortConfig?.fetch) {
            let order: any;
            let colToOrderBy: any;

            const { column, sortType } = sortConfig;
            colToOrderBy = column.keyPath ? column.keyPath[0] : 'name';

            if (sortType === 0) order = [[colToOrderBy, 'ASC']];
            else order = [[colToOrderBy, 'DESC']];

            // reset the pagination config
            setPaginationConfig(defaultPaginationConfig);

            const newAutomations = await fetchAutomations(defaultPaginationConfig?.offset, order);

            const actionsConfig = getActionsConfigObj();
            setAutomations(configureActionsConfig(newAutomations, actionsConfig, sortConfig));
            setSortConfig((prevState: SortingConfiguration) => ({ ...prevState, fetch: false }));
         }
      }
      runAsync();
   }, [sortConfig]);

   const handleSearchInput = (e: any) => {
      const searchVal = e.target.value;
      setSearchInput(searchVal);
   };

   const handleActionClick = async ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            const url = `/admin/ops-automations/${item.id}`;
            await revalidate({ path: url });
            router.push(url);
            break;
         case 'delete':
            console.log('delete item:', item, automations);
            await deleteAutomation(item.id);
            // setOpenConfirmModal(true);
            break;
         default:
            break;
      }
   };

   return (
      <PageContainer
         breadcrumbsChildren={
            <>
               <Button
                  data-test={'createBtn'}
                  iconName='Plus'
                  color='blue'
                  onClick={() => {
                     router.push(`/admin/ops-automations/new`);
                  }}>
                  New Operation
               </Button>
               <SearchBar
                  disabled={!automations?.length}
                  placeholder={'Search Fields...'}
                  searchValue={searchInput}
                  handleChange={handleSearchInput}
                  searchResults={searchResults}
                  onSelectSearchResult={async (e: any, result: any) => {
                     const url = `/admin/ops-automations/${result.id}`;
                     await revalidate({ path: url });
                     if (result.id) router.push(url);
                     else console.log('hmmm.... no field id for result:', result);
                  }}
                  keyPath={['name']}
               />
            </>
         }>
         <Table
            columns={columns}
            data={automations}
            pagination
            paginationTotalCount={+automationCount}
            onPaginate={(paginationOptions, pageState) => {
               const { rowsPerPage } = paginationOptions;
               const { currPage, prevPage } = pageState;
               if (currPage != prevPage) {
                  // page change
                  let on2ndToLastPage = false;
                  const dataLength = automations?.length;
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
            sortingConfig={sortConfig}
            onTableSort={async (column, direction, sortedData) => {
               // setAutomations(sortedData);
               setSortConfig({ column: column, sortType: direction, fetch: true });
            }}
            emptyStateDisplayText={'No Tasks Created Yet...'}
            actions={[
               { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Automation', callback: handleActionClick },
               { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Automation', callback: handleActionClick },
            ]}
         />
      </PageContainer>
   );
};

export default OpsAutomationsClient;
