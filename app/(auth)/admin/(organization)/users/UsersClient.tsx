'use client';
import React, { useEffect, useState } from 'react';
import { ColumnType, PaginationConfig, PaginationOptions } from '../../../../../common/components/table/tableTypes';
import Table from '../../../../../common/components/table/Table';
import { SortingConfiguration, SortingType } from '../../../../../common/components/table/tableTypes';
import { useRouter } from 'next/navigation';
import Button from '../../../../../common/components/button/Button';
import SearchBar from '../../../../../common/components/search-bar/SearchBar';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import { selectUser, selectUserHasPermission } from '../../../../../store/slices/user';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import ConfirmModal from '../../../../../common/components/confirm-modal/ConfirmModal';
import LoadingBackdrop from '../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import { fetchDbApi, revalidate } from '@/serverActions';
import useDebounce from '@/common/hooks/useDebounce';

const configureActionsConfig = (arr: Array<any>, actionsConfig: any, sortConfig: SortingConfiguration) => {
   const { column, sortType } = sortConfig;
   return arr
      ?.map((u: any, i: number) => ({
         ...u,
         actionsConfig: actionsConfig,
      }))
      .sort((a: any, b: any) => {
         // const valueA = columns[0].keyPath?.reduce((acc, curr) => acc[curr as any], a);
         // const valueB = columns[0].keyPath?.reduce((acc, curr) => acc[curr as any], b);
         // return valueA > valueB ? 1 : -1;
         const valueA = column.keyPath?.reduce((acc, curr) => acc[curr as any], a)?.toLowerCase();
         const valueB = column.keyPath?.reduce((acc, curr) => acc[curr as any], b)?.toLowerCase();

         if (sortType === 0) return valueA > valueB ? 1 : -1;
         else return valueA < valueB ? 1 : -1;
      });
};

const columns: ColumnType[] = [
   { keyPath: ['fullName'], title: 'Name', colSpan: 1, sortable: true },
   {
      keyPath: ['rolesOnUser'],
      title: 'Roles',
      colSpan: 1,
      render: ({ item }) => {
         // hide the default role
         const roles = item.rolesOnUser
            .filter((roleOnUser: any) => roleOnUser?.role?.id !== '1df5344f-99f0-4450-a1ad-7a752e61aab8')
            .map((roleOnUser: any) => roleOnUser.role?.name)
            .join(', ');
         return (
            <>{roles?.length ? roles : <div className='text-lum-gray-500 italic'>No roles attached to user...</div>}</>
         );
      },
   },
   { keyPath: ['emailAddress'], title: 'Email', colSpan: 1 },
];

interface Props {
   allUsers: Array<any>;
   totalUserCount: number;
}

const defaultFetchLimit = 100;
const defaultPaginationConfig: PaginationConfig = { offset: 0, limit: defaultFetchLimit, fetch: false };
const defaultSortingConfig: SortingConfiguration = { column: columns[0], sortType: SortingType.ASC, fetch: false };
// const defaultPaginationOptions: PaginationOptions = { rowsPerPage: 15, selectAllRows: true };

const UsersClient = ({ allUsers, totalUserCount }: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();

   const [users, setUsers] = useState<any[]>([]);
   const [userToArchive, setUserToArchive] = useState<any>({});

   const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>(defaultPaginationConfig);

   const [sortConfig, setSortConfig] = useState<SortingConfiguration>(defaultSortingConfig);

   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<Array<string>>([]);

   const [loading, setLoading] = useState<boolean>(false);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

   const getActionsConfigObj = () => {
      const userCanArchiveUser = selectUserHasPermission(user, '0f52b67a-e684-41d0-8abe-d620a8eefd8b');
      const userCanEditUser = selectUserHasPermission(user, '1c6bfe82-0d2a-4287-8507-457fd8892de9');
      const actionsConfig = {
         delete: { disabled: !userCanArchiveUser, toolTip: 'Delete User' },
         edit: { disabled: !userCanEditUser, toolTip: 'Edit User' },
      };
      return actionsConfig;
   };

   useEffect(() => {
      if (!!allUsers?.length) {
         const actionsConfig = getActionsConfigObj();
         const usersToStore = configureActionsConfig(allUsers, actionsConfig, sortConfig);
         setUsers(usersToStore);
      }
   }, []);

   // custom hook to fetch the server with a debounce
   useDebounce(
      async () => {
         if (searchInput?.length < 1) return;
         console.log('debouncing...');
         const token = user?.token;
         const results = await fetchDbApi(`/api/v2/users/query?fullName=${searchInput}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
         });
         const actionsConfig = getActionsConfigObj();
         const tempOrders = configureActionsConfig(results, actionsConfig, sortConfig);

         // setLeads(tempLeads);
         setSearchResults(tempOrders);
      },
      [searchInput],
      500
   );

   const fetchUsers: any = async (offset: number, order: Array<Array<string>> | null) => {
      const token = user?.token;
      return await fetchDbApi(`/api/v2/users/query`, {
         method: 'POST',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
         cache: 'no-store',
         body: JSON.stringify({
            limit: defaultFetchLimit,
            offset: offset,
            order: order || [['firstName', 'ASC']],
            include: [
               {
                  model: 'rolesOnUsers',
                  required: false,
                  as: 'rolesOnUser',
                  include: [{ model: 'roles', as: 'role', required: false }],
               },
            ],
         }),
      }).catch((err) => console.log('err:', err));
   };

   useEffect(() => {
      async function runAsync() {
         if (paginationConfig?.fetch) {
            let order: any;
            let colToOrderBy: any;

            const { column, sortType } = sortConfig;
            if (column?.keyPath?.includes('fullName')) colToOrderBy = 'firstName';
            else colToOrderBy = column.keyPath ? column.keyPath[0] : 'firstName';

            if (sortType === 0) order = [[colToOrderBy, 'ASC']];
            else order = [[colToOrderBy, 'DESC']];

            const newUsers = await fetchUsers(paginationConfig?.offset, order);
            setUsers((prevState: Array<any>) => {
               const actionsConfig = getActionsConfigObj();
               const usersToAdd = configureActionsConfig([...newUsers], actionsConfig, sortConfig);
               return [...prevState, ...usersToAdd];
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
            if (column?.keyPath?.includes('fullName')) colToOrderBy = 'firstName';
            else colToOrderBy = column.keyPath ? column.keyPath[0] : 'firstName';

            if (sortType === 0) order = [[colToOrderBy, 'ASC']];
            else order = [[colToOrderBy, 'DESC']];

            // reset the pagination config
            setPaginationConfig(defaultPaginationConfig);

            const newUsers = await fetchUsers(defaultPaginationConfig?.offset, order);

            const actionsConfig = getActionsConfigObj();
            setUsers(configureActionsConfig(newUsers, actionsConfig, sortConfig));
            setSortConfig((prevState: SortingConfiguration) => ({ ...prevState, fetch: false }));
         }
      }
      runAsync();
   }, [sortConfig]);

   const handleSearchInput = async (e: any) => {
      const searchVal = e.target.value;
      setSearchInput(searchVal);

      // const tempUsers = [...users].filter(
      //    (u: any) => u.fullName.includes(searchVal) || u.emailAddress.includes(searchVal)
      // );
      // setSearchResults([...tempUsers]);
   };

   const handleArchiveUser = async (id: string) => {
      try {
         if (!id) return;
         // archive the productField by the id
         const result = await fetchDbApi(`/api/v2/users/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${user?.token}` },
         });

         if (result) {
            setUsers((prevState: Array<any>) => {
               return [...prevState].filter((user: any) => user?.id !== id);
            });

            const url = `/admin/users`;
            await revalidate({ path: url });
            setTimeout(() => {
               router.push(url);
               setLoading(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'User Deleted' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
         }
      } catch (err: any) {
         console.log('err:', err);
         setLoading(false);
         const errMsg = err.response?.data?.error?.errorMessage || 'Trouble deleting this user...';
         dispatch(
            setAddToast({
               iconName: 'XMarkCircle',
               details: [{ label: 'Error', text: errMsg }],
               variant: 'danger',
               autoCloseDelay: 5,
            })
         );
      }
   };

   const handleActionClick = async ({ actionKey, item }: { actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            const url = `/admin/users/${item.id}`;
            await revalidate({ path: url });
            router.push(url);
            break;
         case 'delete':
            setUserToArchive(item);
            setOpenConfirmModal(true);
            break;
         default:
            break;
      }
   };

   const userCanCreateUser = selectUserHasPermission(user, 'd81bedf8-5bc0-4182-9598-ba94bd37fea2');

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  {userCanCreateUser && (
                     <Button
                        iconName='Plus'
                        color='blue'
                        onClick={() => {
                           router.push(`/admin/users/new`);
                        }}>
                        New User
                     </Button>
                  )}
                  <SearchBar
                     placeholder={'Search Users...'}
                     searchValue={searchInput}
                     handleChange={handleSearchInput}
                     searchResults={searchResults}
                     onSelectSearchResult={async (e: any, result: any) => {
                        const url = `/admin/users/${result.id}`;
                        await revalidate({ path: url });
                        if (result.id) router.push(url);
                        else console.log('hmmm.... no userId for result:', result);
                     }}
                     keyPath={['fullName']}
                  />
               </>
            }>
            <Table
               columns={columns}
               data={users}
               sortingConfig={sortConfig}
               onTableSort={async (column, direction, sortedData) => {
                  // setUsers(sortedData);
                  setSortConfig({ column: column, sortType: direction, fetch: true });
               }}
               pagination
               paginationTotalCount={totalUserCount}
               onPaginate={(paginationOptions, pageState) => {
                  const { rowsPerPage } = paginationOptions;
                  const { currPage, prevPage } = pageState;
                  if (currPage != prevPage) {
                     // page change
                     let on2ndToLastPage = false;
                     const dataLength = users?.length;
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
               // paginationOptions={paginationOptions}
               // onPagination={(pageToNavigateTo: number) => {
               //    // let onLastPage = false;
               //    // const dataLength = users?.length;
               //    // const rowsPerPage = paginationOptions?.rowsPerPage;
               //    // const totalPages = dataLength / rowsPerPage;
               //    // onLastPage = totalPages <= pageToNavigateTo;
               //    // if (onLastPage)
               //    //    setPaginationConfig((prevState: any) => ({
               //    //       ...prevState,
               //    //       offset: prevState?.limit + prevState?.offset,
               //    //       fetch: true,
               //    //    }));
               // }}
               // onPaginationOptionsChange={(paginationOptions: PaginationOptions) => {
               //    setPaginationOptions(paginationOptions);
               // }}
               actions={[
                  { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit User', callback: handleActionClick },
                  { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete User', callback: handleActionClick },
               ]}
            />
         </PageContainer>
         <ConfirmModal
            open={openConfirmModal}
            handleOnClose={(e: any) => {
               setOpenConfirmModal(!openConfirmModal);
            }}
            handleOnConfirm={(e: any) => {
               setOpenConfirmModal(false);
               setLoading(true);
               handleArchiveUser(userToArchive.id);
            }}
            value={'coordinator, "' + userToArchive?.fullName + '"'}
         />
         <LoadingBackdrop isOpen={loading} />
      </>
   );
};

export default UsersClient;
