'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/common/components/button/Button';
import PageContainer from '@/common/components/page-container/PageContainer';
import SearchBar from '@/common/components/search-bar/SearchBar';
import Table from '@/common/components/table/Table';
import { ColumnType, PaginationConfig, SortingConfiguration, SortingType } from '@/common/components/table/tableTypes';
import useDebounce from '@/common/hooks/useDebounce';
import { fetchDbApi, revalidate } from '@/serverActions';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import automationTriggers from './v2/triggers/triggersClient';
import TableCellLink from '@/common/components/table-cell-link/TableCellLink';



const configureActionsConfig = (arr: Array<any>, actionsConfig: any, sortConfig: any) => {
   const { column, sortType } = sortConfig;
   return arr
      ?.map((u: any, i: number) => {
         return ({
            ...u,
            statusType: (u?.statusType[0].toUpperCase() + u?.statusType.slice(1).toLowerCase()) ?? 'N/A',
            createdAt: (u?.createdAt) ?? 'N/A',
            executorId: u?.executorId ?? 'Luminary',
            actionsConfig: actionsConfig,
            trigger: Object.values(automationTriggers).reduce((acc, val) => acc.concat(val), []).find((a: any) => a.name === u.trigger)?.prettyName || u?.trigger || 'Dev Error'
         })
      })
      .sort((a: any, b: any) => {
         const valueA = column.keyPath?.reduce((acc: any, curr: any) => acc[curr as any], a)?.toLowerCase();
         const valueB = column.keyPath?.reduce((acc: any, curr: any) => acc[curr as any], b)?.toLowerCase();
         if (sortType === 0) return valueA > valueB ? 1 : -1;
         else return valueA < valueB ? 1 : -1;
      });
};

const columns: ColumnType[] = [
   { keyPath: ['statusType'], title: 'Status', colSpan: 1, sortable: true },
   {
      keyPath: ['leadId'], title: 'Lead Id', colSpan: 1, sortable: true,
      render: ({ column, item }) => {
         return (item.leadId
            ? <TableCellLink path={`/marketing/leads/${item.leadId}`}>{item.leadId}</TableCellLink>
            : 'N/A'
         );
      }
   },
   {
      keyPath: ['orderId'], title: 'Order Id', colSpan: 1, sortable: true,
      render: ({ column, item }) => {
         return (item.orderId
            ? <TableCellLink path={`/installs/work-orders/${item.orderId}`}>{item.orderId}</TableCellLink>
            : 'N/A'
         );
      }
   },
   { keyPath: ['trigger'], title: 'Trigger', colSpan: 1, sortable: true },
   { keyPath: ['executorId'], title: 'Trigger By', colSpan: 1, sortable: true },
   { keyPath: ['createdAt'], title: 'Triggered on', colSpan: 1, sortable: true },
];

interface Props {
   allAutomations: Array<any>;
   automationCount: number;
}

const defaultFetchLimit = 100;
const defaultPaginationConfig: PaginationConfig = { offset: 0, limit: defaultFetchLimit, fetch: false };
const defaultSortingConfig: SortingConfiguration = { column: columns[5], sortType: SortingType.DESC };


const AutomationRuns = ({ automationId }: { automationId: string }) => {

   const [allAutomationRuns, setAllAutomationRuns] = useState<Array<any>>([])
   const [automationCount, setAutomationCount] = useState<number>(0)


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
      const actionsConfig = { edit: false, delete: true };
      return actionsConfig;
   };

   useEffect(() => {

      fetchDbApi(`/api/v2/automations/runs/query?automationId=${automationId}`, { method: 'GET' })
         .then((automationRuns) => {
            // console.log('Automation runs', automationRuns)
            setAllAutomationRuns(automationRuns)

            if (!!automationRuns?.length) {
               const actionsConfig = getActionsConfigObj();
               const automationsToStore = configureActionsConfig(automationRuns, actionsConfig, sortConfig);
               setAutomations(automationsToStore);
            }
         })
         .catch((err) => {
            console.log(err);
         });

   }, []);

   // custom hook to fetch the server with a debounce
   // useDebounce(
   //    async () => {
   //       if (searchInput?.length < 1) return;
   //       console.log('debouncing...');
   //       const token = user?.token;
   //       const results = await fetchDbApi(`/api/v2/automations/query?type=operations&name=${searchInput}`, {
   //          method: 'GET',
   //          headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
   //       });
   //       const actionsConfig = getActionsConfigObj();
   //       const tempAutomations = configureActionsConfig(results, actionsConfig, sortConfig);
   //       setSearchResults(tempAutomations);
   //    },
   //    [searchInput],
   //    250
   // );

   // const fetchAutomations = async (offset: number, order: Array<Array<any>> | null) => {
   //    const token = user?.token;
   //    return await fetchDbApi(`/api/v2/automations/query?type=operations`, {
   //       method: 'POST',
   //       body: JSON.stringify({
   //          limit: defaultFetchLimit,
   //          offset: offset,
   //          order: order || [['createdAt', 'DESC']],
   //       }),
   //    });
   // };

   const deleteAutomation = async (id: string) => {
      return await fetchDbApi(`/api/v2/automations/${id}`, {
         method: 'DELETE',
      }).then((res) => {
         setAutomations((prevState: Array<any>) => (prevState.filter((u: any) => u.id !== id)));
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

            // const newTasks = await fetchAutomations(paginationConfig?.offset, order);
            // setAutomations((prevState: Array<any>) => {
            // const actionsConfig = getActionsConfigObj();
            // const automationsToAdd = configureActionsConfig([...newTasks], actionsConfig, sortConfig);
            // return [...prevState, ...automationsToAdd];
            // });
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

            // const newAutomations = await fetchAutomations(defaultPaginationConfig?.offset, order);

            const actionsConfig = getActionsConfigObj();
            // setAutomations(configureActionsConfig(newAutomations, actionsConfig, sortConfig));
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
            router.refresh();
            break;

         case 'rerun':
            fetchDbApi(`/api/v2/automations/runs/fire/${item.id}`, { method: 'PUT' })
               .then(async (res) => {
                  console.log('Automation Completed', res);
                  // const url = `/admin/ops-automations/932274f1-0054-48ed-b7b9-13ea547d75ef`;
                  // await revalidate({ path: url });
                  // router.replace(url);
                  // return res;
               })
               .catch((err) => {
                  console.log('Error auto running automation', err);
                  return null;
               });
            break;
         default:
            break;
      }
   };

   return (
      <>
         {/* <SearchBar
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
         /> */}

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
            emptyStateDisplayText={'No Automation Runs Created Yet...'}
            actions={[
               { icon: 'Play', actionKey: 'rerun', toolTip: 'Rerun Automation', callback: handleActionClick },
               { icon: 'MagnifyingGlass', actionKey: 'view', toolTip: 'View Automation', callback: handleActionClick },
            ]}
         />
      </>

   );
};

export default AutomationRuns