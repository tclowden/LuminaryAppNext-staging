'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Button from '../../../../../common/components/button/Button';
import ConfirmModal from '../../../../../common/components/confirm-modal/ConfirmModal';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import SearchBar from '../../../../../common/components/search-bar/SearchBar';
import Table from '../../../../../common/components/table/Table';
import { ColumnType, SortingConfiguration, SortingType } from '../../../../../common/components/table/tableTypes';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import { selectUser, selectUserHasPermission } from '../../../../../store/slices/user';

const columns: ColumnType[] = [
   { keyPath: ['name'], title: 'Role Name', colSpan: 1, sortable: true },
   { keyPath: ['usersCount'], title: 'Users', colSpan: 1 },
];

const RolesClient = ({ allRoles }: { allRoles: any[] }) => {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const [roles, setRoles] = useState<any[]>([]);
   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<any[]>([]);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [roleToRemove, setRoleToRemove] = useState<any>({});
   // const [sortConfig, setSortConfig] = useState<SortingConfiguration>({
   //    column: columns[0],
   //    sortType: SortingType.ASC,
   // });

   useEffect(() => {
      const userCanEditARole = selectUserHasPermission(user, '92fd8c01-aec1-4a1d-b0a3-378b95f827dd');
      const userCanDeleteARole = selectUserHasPermission(user, '431f744f-caba-445e-8c17-d33365a0831b');
      const userCanEditARoleToolTip = userCanEditARole ? 'Edit Role' : 'Not allowed';
      const userCanDeleteARoleToolTip = userCanDeleteARole ? 'Delete Role' : 'Not allowed';

      const rolesCanNotDelete = ['Super Admin', 'Default Role'];
      const rolesCanNotEdit = ['Super Admin'];
      const rolesToStore = allRoles
         ?.sort((a: any, b: any) => (b?.name.toLowerCase() > a?.name.toLowerCase() ? -1 : 1))
         ?.map((r: any, i: number) => ({
            ...r,
            name: r?.name === 'Super Admin' ? 'Super Admin - All Permissions' : r.name,
            usersCount: r?.rolesOnUser?.length.toString(),
            actionsConfig: {
               edit: { disabled: !userCanEditARole || rolesCanNotEdit?.includes(r?.name) },
               delete: {
                  disabled: !userCanDeleteARole || rolesCanNotDelete?.includes(r?.name),
                  toolTip: userCanDeleteARoleToolTip,
               },
            },
         }));
      setRoles(rolesToStore);
   }, []);

   const onTableSort = (column: ColumnType, direction: SortingType) => {
      const rolesToSave = [...roles].sort((a, b) => {
         // @ts-ignore
         const valueA = column.keyPath.reduce((acc, curr) => acc[curr as any], a);
         // @ts-ignore
         const valueB = column.keyPath.reduce((acc, curr) => acc[curr as any], b);
         if (direction === SortingType.ASC) return valueA > valueB ? 1 : -1;
         else return valueA < valueB ? 1 : -1;
      });
      setRoles(rolesToSave);
      // setSortConfig({ column: column, sortType: direction });
   };

   const handleSearchInput = (e: any) => {
      if (!!!roles.length) return;
      const searchVal = e.target.value;
      setSearchInput(searchVal);
      const tempRoles = [...roles].filter(
         (role: any) =>
            role.name.toLowerCase().includes(searchVal.toLowerCase()) &&
            !role.name.toLowerCase().includes('super admin')
      );
      setSearchResults([...tempRoles]);
   };

   const handleArchiveRole = async (id: number) => {
      if (!id) return;
      const userAuthToken = user.token;
      if (!userAuthToken) return;

      // soft delete the role by the id
      await axios
         .delete(`/api/v2/roles/${id}`, {
            headers: { Authorization: `Bearer ${userAuthToken}` },
         })
         .then((res) => {
            setRoles((prevState: Array<any>) => [...prevState].filter((role: any) => role.id !== id));
            dispatch(
               setAddToast({
                  details: [{ label: 'Success', text: 'Role Successfully Deleted' }],
                  iconName: 'CheckMarkCircle',
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
         })
         .catch((err: any) => {
            console.log('err', err);
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

   const handleActionClick = ({ event, actionKey, item }: any) => {
      switch (actionKey) {
         case 'edit':
            // route to the user's page using the item's id
            const random = Math.random().toString(36).slice(2, 7);
            // encrypt the id & then verify it on the server side (page.tsx)??
            router.push(`/admin/roles/${item.id}?${random}`);
            // router.push(`/admin/roles/${item.id}`);
            // router.refresh();
            break;
         case 'delete':
            setRoleToRemove(item);
            setOpenConfirmModal(true);
            break;
         default:
            break;
      }
   };

   const userCanCreateARole = selectUserHasPermission(user, '90332e64-2449-4fb0-a9e7-ba86c50470b1');

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  {userCanCreateARole && (
                     <Button
                        data-test={'createBtn'}
                        iconName='Plus'
                        color='blue'
                        onClick={() => {
                           router.push(`/admin/roles/new`);
                        }}>
                        New Role
                     </Button>
                  )}
                  <SearchBar
                     placeholder={'Search Roles...'}
                     searchValue={searchInput}
                     handleChange={handleSearchInput}
                     searchResults={searchResults}
                     onSelectSearchResult={(e: any, result: any) => {
                        if (result.name.toLowerCase().includes('super admin')) {
                           return dispatch(
                              setAddToast({
                                 iconName: 'XMarkCircle',
                                 details: [{ label: 'Error', text: "Can't edit 'Super Admin' role." }],
                                 variant: 'danger',
                                 autoCloseDelay: 5,
                              })
                           );
                        }
                        if (result.id) router.push(`/admin/roles/${result.id}`);
                        else console.log('hmmm.... no role id for result:', result);
                     }}
                     keyPath={['name']}
                  />
               </>
            }>
            <Table
               actions={[
                  { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Role', callback: handleActionClick },
                  { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Role', callback: handleActionClick },
                  // { icon: 'Duplicate', actionKey: 'duplicate', toolTip: 'Duplicate Role', callback: handleActionClick },
               ]}
               columns={columns}
               data={roles}
               onTableSort={onTableSort}
               // sortingConfig={sortConfig}
            />
         </PageContainer>
         <ConfirmModal
            open={openConfirmModal}
            handleOnClose={(e: any) => {
               setOpenConfirmModal(!openConfirmModal);
            }}
            handleOnConfirm={(e: any) => {
               setOpenConfirmModal(false);
               handleArchiveRole(roleToRemove.id);
            }}
            value={'role, "' + roleToRemove?.name + '"'}
         />
      </>
   );
};

export default RolesClient;
