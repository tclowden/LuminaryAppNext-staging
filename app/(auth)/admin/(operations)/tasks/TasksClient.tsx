'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Button from '../../../../../common/components/button/Button';
import ConfirmModal from '../../../../../common/components/confirm-modal/ConfirmModal';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import SearchBar from '../../../../../common/components/search-bar/SearchBar';
import Table from '../../../../../common/components/table/Table';
import {
   ColumnType,
   PaginationConfig,
   SortingConfiguration,
   SortingType,
} from '../../../../../common/components/table/tableTypes';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import { selectUser } from '../../../../../store/slices/user';
import { fetchDbApi, revalidate } from '@/serverActions';
import useDebounce from '@/common/hooks/useDebounce';

const configureActionsConfig = (arr: Array<any>, actionsConfig: any, sortConfig: any) => {
   const { column, sortType } = sortConfig;
   return arr
      ?.map((u: any, i: number) => ({
         ...u,
         actionsConfig: actionsConfig,
      }))
      .sort((a: any, b: any) => {
         const valueA = column.keyPath?.reduce((acc: any, curr: any) => acc[curr as any], a)?.toLowerCase();
         const valueB = column.keyPath?.reduce((acc: any, curr: any) => acc[curr as any], b)?.toLowerCase();
         if (sortType === 0) return valueA > valueB ? 1 : -1;
         else return valueA < valueB ? 1 : -1;
      });
};

const columns: ColumnType[] = [
   { keyPath: ['name'], title: 'Task Name', colSpan: 2, sortable: true },
   { keyPath: ['description'], title: 'Task Description', colSpan: 3, sortable: true },
];

interface Props {
   allTasks: Array<any>;
   taskCount: number | string;
}

const defaultFetchLimit = 100;
const defaultPaginationConfig: PaginationConfig = { offset: 0, limit: defaultFetchLimit, fetch: false };
const defaultSortingConfig: SortingConfiguration = { column: columns[0], sortType: SortingType.ASC };

const TasksClient = ({ allTasks, taskCount }: Props) => {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const [tasks, setTasks] = useState<Array<any>>([]);

   const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>(defaultPaginationConfig);
   const [sortConfig, setSortConfig] = useState<SortingConfiguration>(defaultSortingConfig);

   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<any[]>([]);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [taskToRemove, setTaskToRemove] = useState<any>({});

   const getActionsConfigObj = () => {
      const actionsConfig = { edit: true, delete: true };
      return actionsConfig;
   };

   useEffect(() => {
      if (!!allTasks?.length) {
         const actionsConfig = getActionsConfigObj();
         const tasksToStore = configureActionsConfig(allTasks, actionsConfig, sortConfig);
         setTasks(tasksToStore);
      }
   }, []);

   // custom hook to fetch the server with a debounce
   useDebounce(
      async () => {
         if (searchInput?.length < 1) return;
         console.log('debouncing...');
         const token = user?.token;
         const results = await fetchDbApi(`/api/v2/products/tasks/query?name=${searchInput}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
         });
         const actionsConfig = getActionsConfigObj();
         const tempTasks = configureActionsConfig(results, actionsConfig, sortConfig);
         setSearchResults(tempTasks);
      },
      [searchInput],
      500
   );

   const fetchTasks = async (offset: number, order: Array<Array<any>> | null) => {
      const token = user?.token;
      return await fetchDbApi(`/api/v2/products/tasks/query`, {
         method: 'POST',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
         cache: 'no-store',
         body: JSON.stringify({
            limit: defaultFetchLimit,
            offset: offset,
            order: order || [['name', 'ASC']],
         }),
      });
   };

   useEffect(() => {
      async function runAsync() {
         if (paginationConfig?.fetch) {
            let order: any;
            let colToOrderBy: any;

            const { column, sortType } = sortConfig;
            colToOrderBy = column.keyPath ? column.keyPath[0] : 'name';

            if (sortType === 0) order = [[colToOrderBy, 'ASC']];
            else order = [[colToOrderBy, 'DESC']];

            const newTasks = await fetchTasks(paginationConfig?.offset, order);
            setTasks((prevState: Array<any>) => {
               const actionsConfig = getActionsConfigObj();
               const tasksToAdd = configureActionsConfig([...newTasks], actionsConfig, sortConfig);
               return [...prevState, ...tasksToAdd];
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

            const newTasks = await fetchTasks(defaultPaginationConfig?.offset, order);

            const actionsConfig = getActionsConfigObj();
            setTasks(configureActionsConfig(newTasks, actionsConfig, sortConfig));
            setSortConfig((prevState: SortingConfiguration) => ({ ...prevState, fetch: false }));
         }
      }
      runAsync();
   }, [sortConfig]);

   const handleSearchInput = async (e: any) => {
      const searchVal = e.target.value;
      setSearchInput(searchVal);
   };

   const handleArchiveProductStage = async (id: number) => {
      if (!id) return;
      const userAuthToken = user.token;
      if (!userAuthToken) return;

      // archive the productStage by the id
      await fetchDbApi(`/api/v2/products/tasks/${id}`, {
         method: 'DELETE',
         headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
      })
         .then((res) => {
            setTasks((prevState: Array<any>) => {
               return [...prevState].filter((t: any) => t.id !== id);
            });
            dispatch(
               setAddToast({
                  details: [{ label: 'Success', text: 'Task Successfully Deleted' }],
                  iconName: 'CheckMarkCircle',
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
         })
         .catch((err: any) => {
            console.log('Error archiving product task:', err);
            const errMsg = err.response?.data?.error?.errorMessage || 'Changes Not Saved';
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: errMsg }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const handleActionClick = async ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            const url = `/admin/tasks/${item.id}`;
            await revalidate({ path: url });
            router.push(url);
            break;
         case 'delete':
            // handleArchiveProductStage(item.id);
            setTaskToRemove(item);
            setOpenConfirmModal(true);
            break;
         default:
            break;
      }
   };

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button
                     data-test={'createBtn'}
                     iconName='Plus'
                     color='blue'
                     onClick={() => {
                        router.push(`/admin/tasks/new`);
                     }}>
                     New Task
                  </Button>
                  <SearchBar
                     placeholder={'Search Tasks...'}
                     searchValue={searchInput}
                     handleChange={handleSearchInput}
                     searchResults={searchResults}
                     onSelectSearchResult={(e: any, task: any) => {
                        if (task.id) router.push(`/admin/tasks/${task.id}`);
                        else console.log('hmmm.... no task id for result:', task);
                     }}
                     keyPath={['name']}
                  />
               </>
            }>
            <Table
               columns={columns}
               data={tasks}
               pagination
               paginationTotalCount={+taskCount}
               onPaginate={(paginationOptions, pageState) => {
                  const { rowsPerPage } = paginationOptions;
                  const { currPage, prevPage } = pageState;
                  if (currPage != prevPage) {
                     // page change
                     let on2ndToLastPage = false;
                     const dataLength = tasks?.length;
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
                  setTasks(sortedData);
                  setSortConfig({ column: column, sortType: direction, fetch: true });
               }}
               emptyStateDisplayText={'No Tasks Created Yet...'}
               actions={[
                  { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Field', callback: handleActionClick },
                  { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Field', callback: handleActionClick },
               ]}
            />
         </PageContainer>
         <ConfirmModal
            zIndex={101}
            open={openConfirmModal}
            handleOnClose={(e: any) => {
               setOpenConfirmModal(!openConfirmModal);
            }}
            handleOnConfirm={(e: any) => {
               setOpenConfirmModal(false);
               handleArchiveProductStage(taskToRemove.id);
            }}
            value={'task, "' + taskToRemove?.name + '"'}
         />
      </>
   );
};

export default TasksClient;
