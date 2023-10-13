'use client';

import React, { useEffect, useState } from 'react';
import Explainer from '../../../../../../common/components/explainer/Explainer';
import Input from '../../../../../../common/components/input/Input';
import useForm, { YupSchemaObject } from '../../../../../../common/hooks/useForm';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { selectUser } from '../../../../../../store/slices/user';
import Textarea from '../../../../../../common/components/textarea/Textarea';
import PageContainer from '../../../../../../common/components/page-container/PageContainer';
import Button from '../../../../../../common/components/button/Button';
import Grid from '../../../../../../common/components/grid/Grid';
import SearchBar from '../../../../../../common/components/search-bar/SearchBar';
import Chip from '../../../../../../common/components/chip/Chip';
import Table from '../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../common/components/table/tableTypes';
import ToggleSwitch from '../../../../../../common/components/toggle-switch/ToggleSwitch';
import { recurseTableData } from './(partials)/utilities';
import LoadingBackdrop from '../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import axios from 'axios';
import { setAddToast } from '../../../../../../store/slices/toast';

const roleValidationSchema: YupSchemaObject<any> = {
   name: Yup.string().required('Name is required.'),
   description: Yup.string().required('Description is required.'),
};

interface Props {
   role: any;
   users: Array<any>;
   pages: { pages: Array<any>; raw: Array<any>; permissionsByApp: Array<any> };
}

const RoleClient = ({ role, users, pages }: Props) => {
   console.log('Pages: ', pages);
   const router = useRouter();
   const user: any = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const [isSaving, setIsSaving] = useState<boolean>(false);

   // search state for 'Assigned Users'
   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<any[]>([]);

   const [pageData, setPageData] = useState<Array<any>>([]);
   const [expandAllTableRows, setExpandAllTableRows] = useState<{ value: boolean; timestamp: Date }>({
      value: false,
      timestamp: new Date(),
   });

   // search state for the permissions table
   const [permissionSearchInput, setPermissionSearchInput] = useState<string>('');
   const [permissionSearchResults, setpermissionSearchResults] = useState<any[]>([]);
   const [filteredPageData, setFilteredPageData] = useState<Array<any>>([]);

   const permissionColumns: ColumnType[] = [
      { keyPath: ['displayName'], title: 'Apps & Permissions', colSpan: 2 },
      {
         keyPath: ['hasAccess'],
         title: 'Access',
         colSpan: 1,
         fixedWidth: true,
         ellipsis: false,
         render: ({ item, callback }) => {
            let roleHasPermission = false;
            const itemType = !!item?.permissions ? 'app' : 'permission';
            const currentRole = { ...values };
            if (itemType === 'app') {
               roleHasPermission = currentRole?.permissionsOnRole?.find(
                  (permOnRole: any) =>
                     item?.permissions?.find((permission: any) => permOnRole?.permission?.id === permission.id) &&
                     !permOnRole?.archived
               );
            } else {
               // just a permission
               roleHasPermission = currentRole?.permissionsOnRole?.find(
                  (permOnRole: any) => permOnRole?.permission?.id === item.id && !permOnRole?.archived
               );
            }
            // if (itemType === 'app') {
            //    roleHasPermission = currentRole?.permissions?.find(
            //       (rolePerm: any) =>
            //          item?.permissions?.find((permission: any) => rolePerm?.id === permission.id) && !rolePerm?.archived
            //    );
            // } else {
            //    // just a permission
            //    roleHasPermission = currentRole?.permissions?.find(
            //       (rolePerm: any) => rolePerm?.id === item.id && !rolePerm?.archived
            //    );
            // }

            // if (itemType === 'permission')
            return <ToggleSwitch checked={roleHasPermission ? true : false} onChange={callback} name='hasAccess' />;
         },
      },
      { keyPath: ['description'], title: 'Description', colSpan: 2 },
   ];

   useEffect(() => {
      if (!!pages?.pages?.length) {
         const recursedData = recurseTableData(pages?.pages, role);
         setPageData(recursedData);
         setFilteredPageData(recursedData);
         console.log(filteredPageData);
      }
   }, [pages]);

   const handleRoleSave = async (e: any, updatedRole: any) => {
      setIsSaving(true);
      const userAuthToken = user.token;
      const newRoleData = { ...JSON.parse(JSON.stringify(updatedRole)) };

      // delete unnessary data
      delete newRoleData['editMode'];

      if (!!newRoleData?.permissionsOnRole?.length) {
         newRoleData['permissionsOnRole'] = newRoleData.permissionsOnRole.map((permOnRole: any) => {
            // delete unnessary data
            delete permOnRole['permission'];
            return { ...permOnRole };
         });
      }
      if (!!newRoleData?.usersOnRole?.length) {
         newRoleData['usersOnRole'] = newRoleData.usersOnRole.map((userOnRole: any) => {
            // delete unnessary data
            delete userOnRole['user'];
            return { ...userOnRole };
         });
      }

      try {
         let result = null;
         // need to check if creating a new product or updating an existing
         if (newRoleData.id) {
            // update
            const url = `/api/v2/roles/${newRoleData.id}`;
            result = await axios.put(url, newRoleData, { headers: { Authorization: `Bearer ${userAuthToken}` } });
         } else {
            // create
            const url = `/api/v2/roles`;
            result = await axios.post(url, newRoleData, { headers: { Authorization: `Bearer ${userAuthToken}` } });
         }

         if (result.status === 200) {
            const randomStr = Math.random().toString().slice(2, 7);
            router.push(`/admin/roles?${randomStr}`);
            setTimeout(() => {
               setIsSaving(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Role Successfully Saved' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
         }
      } catch (err: any) {
         console.log('err saving role', err);
         setIsSaving(false);
         const errMsg = err.response?.data?.error?.errorMessage || 'Changes Not Saved';
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

   const handleSearchUsersInput = (e: any) => {
      if (!!!users.length) return;
      const searchVal = e.target.value;
      setSearchInput(searchVal);
      const tempUsers = [...users].filter((user: any) => {
         // need to make sure the users aren't already attached to the fold
         const userAlreadyOnRole = values.usersOnRole?.find(
            (userOnRole: any) =>
               user?.id === userOnRole?.userId && userOnRole.roleId === role?.id && !userOnRole.archived
         );
         const textStringMatch = user?.fullName.toLowerCase().includes(searchVal.toLowerCase());
         if (!userAlreadyOnRole && textStringMatch) return user;
      });
      setSearchResults([...tempUsers]);
   };

   const tableRowsHandler = (expand: boolean) => {
      setExpandAllTableRows({ value: expand, timestamp: new Date() });
   };

   const handleSearchPermissionsInput = (e: any) => {
      if (!!!pageData.length) return;
      if (!expandAllTableRows.value) tableRowsHandler(true);
      const searchVal = e.target.value;
      setPermissionSearchInput(searchVal);
      let recurse = (pageDataArr: Array<any>, searchValue: string) => {
         let results = [];
         for (const page of [...pageDataArr]) {
            const found =
               page.name.toLowerCase().includes(searchValue.toLowerCase()) ||
               page?.prettyName?.toLowerCase().includes(searchValue.toLowerCase()) ||
               page?.displayName?.value?.toLowerCase().includes(searchValue.toLowerCase());
            if (found) results.push(page);
            // techinically, only have to search through expandable data...
            // if bugs start to happen early, query through the sections & pages instead to see if that fixes things
            // this is just searching through... so using expandableData makes sense
            else if (!!page?.expandableData?.length) {
               let nestedResults: Array<any> = recurse(page?.expandableData, searchValue);
               if (!!nestedResults?.length) {
                  const filteredPage = { ...page, expandableData: nestedResults };
                  results.push(filteredPage);
               }
            }
            // else if (!!page?.sections?.length) {
            //    let nestedResults: Array<any> = recurse(page?.sections, searchValue);
            //    if (!!nestedResults?.length) {
            //       const filteredPage = { ...page, sections: nestedResults };
            //       results.push(filteredPage);
            //    }
            // } else if (!!page?.pages?.length) {
            //    let nestedResults: Array<any> = recurse(page?.pages, searchValue);
            //    if (!!nestedResults?.length) {
            //       const filteredPage = { ...page, pages: nestedResults };
            //       results.push(filteredPage);
            //    }
            // }
         }
         return results;
      };
      setFilteredPageData(recurse([...pageData], searchVal));
   };

   const handleRemoveUserFromRole = (e: any, userToRemove: any) => {
      // make a copy & save
      const tempUsersOnRole = [...values?.usersOnRole].map((userOnRole: any) => ({
         ...userOnRole,
         ...(userOnRole?.userId === userToRemove.id && { archived: true }),
      }));
      setValue('usersOnRole', tempUsersOnRole);
   };

   const handleAddUserToRole = (e: any, userToAdd: any) => {
      // make a copy of array
      const tempUsersOnRole = [...values?.usersOnRole];
      // see if the user already exists in the array, but is just archived
      const userAlreadyExistsIndex = tempUsersOnRole.findIndex(
         (userOnRole: any) => userOnRole.user.id === userToAdd.id
      );

      if (userAlreadyExistsIndex !== -1) {
         // set the archived key to false
         tempUsersOnRole[userAlreadyExistsIndex]['archived'] = false;
         // move to the end of the array
         tempUsersOnRole.push(tempUsersOnRole.splice(userAlreadyExistsIndex, 1)[0]);
      } else {
         // if not found, add the user to a new userOnRole obj & push to array
         tempUsersOnRole.push({
            user: userToAdd,
            userId: userToAdd.id,
            id: null,
            archived: false,
            roleId: role.id,
         });
      }

      setValue('usersOnRole', tempUsersOnRole);
      setSearchInput('');
   };

   const handleCellEvent = ({ item, event }: any) => {
      console.log('ITEM: ', item);
      let updatedRole = { ...JSON.parse(JSON.stringify(values)) };
      const copyItem = { ...item };
      // const itemType = !!copyItem?.permissions ? 'app' : 'permission';
      // let rolePermissionsCopy: Array<any> = [...JSON.parse(JSON.stringify(updatedRole?.permissions))];
      let permissionsOnRoleCopy: Array<any> = [...JSON.parse(JSON.stringify(updatedRole?.permissionsOnRole))];

      const getParentPages: any = (pageId: number, arr: any = []) => {
         // find the page using the pageId
         const findPage: any = (pagesArr: Array<any>, pageToLookForId: number) => {
            let foundPage = undefined;
            for (const page of pagesArr) {
               if (page?.id === pageToLookForId) return page;
               // techinically, only have to search through expandable data...
               // if bugs start to happen early, query through the sections & pages as well to see if that fixes things
               // BUG HAPPENED... when using the expandableData,
               // it considers permissions nested in sections above the click permission, a parent permission
               // else if (!!page?.expandableData?.length) {
               //    const res = findPage(page?.expandableData, pageToLookForId);
               //    if (res) return res;
               // }
               else if (!!page?.pages?.length) {
                  const res = findPage(page?.pages, pageToLookForId);
                  if (res) return res;
               } else if (!!page?.sections?.length) {
                  const res = findPage(page?.sections, pageToLookForId);
                  if (res) return res;
               } else if (foundPage) return foundPage;
               else continue;
            }
            return foundPage;
         };

         // const foundPage: any = pages?.raw?.find((page: any) => page.id === pageId);
         let foundPage = findPage(filteredPageData, pageId);
         if (!foundPage) return arr;
         arr = [...arr, foundPage];
         return getParentPages(foundPage?.parentPageId, arr);
      };

      const alterPermissionsOnRole = (
         obj: any,
         permissionsOnRoleArr: Array<any>,
         parentToggleStatus: null | boolean = null
      ) => {
         // if obj has an array of sections
         if (!!obj?.sections?.length) {
            for (const section of obj?.sections) {
               alterPermissionsOnRole(section, permissionsOnRoleArr, parentToggleStatus ?? !event.target.checked);
            }
         }

         // if obj has an array of pages
         if (!!obj?.pages?.length) {
            for (const page of obj?.pages) {
               alterPermissionsOnRole(page, permissionsOnRoleArr, parentToggleStatus ?? !event.target.checked);
            }
         }

         // if obj has an array of permissions
         if (!!obj?.permissions?.length) {
            // console.log('obj?.permissions:', obj?.permissions);
            for (const permission of obj?.permissions) {
               alterPermissionsOnRole(permission, permissionsOnRoleArr, parentToggleStatus ?? !event.target.checked);
            }
         }

         // obj is an actual permission
         if (!obj?.permissions && !obj?.pages && !obj?.sections) {
            let currentToggleStatus: boolean = false;
            const currentPermission = { ...obj };

            // see if permission already exists
            const permissionOnRoleExistsIndex = permissionsOnRoleArr.findIndex(
               (permOnRole: any) => permOnRole?.permission?.id === currentPermission?.id
            );

            if (permissionOnRoleExistsIndex !== -1) {
               // exists... just update it
               if (typeof parentToggleStatus === 'boolean') currentToggleStatus = parentToggleStatus;
               else currentToggleStatus = !permissionsOnRoleArr[permissionOnRoleExistsIndex]?.archived;
               permissionsOnRoleArr[permissionOnRoleExistsIndex]['archived'] = currentToggleStatus;
            } else {
               // doesn't exist... add to the array
               if (typeof parentToggleStatus === 'boolean') currentToggleStatus = parentToggleStatus;
               else currentToggleStatus = false;
               permissionsOnRoleArr.push({
                  id: null,
                  permissionId: currentPermission?.id,
                  permission: currentPermission,
                  archived: parentToggleStatus,
                  roleId: role.id,
               });
            }

            // see if there are any parent permissions to turn on...
            const parentPages = getParentPages(currentPermission?.pageId);

            // if there are parent permissions & the currentToggleStatus is false
            if (!!parentPages.length && !currentToggleStatus) {
               // create new flattened array of just permissions from all the pages
               const recursedPagePermissions = parentPages
                  .map((page: any) => page?.permissions?.filter((permission: any) => permission?.isDefaultPermission))
                  .flat();

               // loop through each of the permissions
               recursedPagePermissions.forEach((currPerm: any) => {
                  // see if already exists in the rolePermissionsArr
                  const permOnRoleAlreadyExistsIndex = permissionsOnRoleArr.findIndex(
                     (permOnRole: any) => permOnRole?.permission?.id === currPerm?.id
                  );
                  if (permOnRoleAlreadyExistsIndex !== -1) {
                     // exists... just update it
                     // set archived to false... or currentToggleStatus, which will always be false
                     permissionsOnRoleArr[permOnRoleAlreadyExistsIndex]['archived'] = currentToggleStatus;
                  } else {
                     // doesn't exist... just create it
                     // set archived to false... or currentToggleStatus, which will always be false
                     permissionsOnRoleArr.push({
                        id: null,
                        permissionId: currPerm?.id,
                        permission: currPerm,
                        archived: currentToggleStatus,
                        roleId: role.id,
                     });
                  }
               });
            }
         }
      };

      alterPermissionsOnRole(copyItem, permissionsOnRoleCopy);
      setValue('permissionsOnRole', [...permissionsOnRoleCopy]);
   };

   const { handleSubmit, handleChange, handleBlur, values, setValue, errors } = useForm({
      initialValues: role,
      validationSchema: roleValidationSchema,
      onSubmit: handleRoleSave,
   });

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button color='blue' onClick={handleSubmit} data-test={'submitBtn'}>
                     Save
                  </Button>
                  <Button
                     color='white'
                     onClick={() => {
                        router.back();
                     }}>
                     Cancel
                  </Button>
               </>
            }>
            <Grid>
               <Explainer title={'Role Info'} description={'Give your role a name and description.'}>
                  <Input
                     data-test={'name'}
                     name='name'
                     label='Role Name'
                     value={values?.name || ''}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder={'ex) FBI Interrogator'}
                     errorMessage={errors?.name}
                     required
                  />
                  <Textarea
                     data-test={'description'}
                     label='Description'
                     name='description'
                     value={values?.description || ''}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder={'Enter Task Description'}
                     errorMessage={errors?.description}
                     isRequired
                  />
               </Explainer>
               {/* If default role.. don't allow the user to remove or add users to this role... everyone should have this role regardless */}
               {values?.name !== 'Default Role' && (
                  <Explainer title={'Assigned Users'} description={'Edit which users are assigned to this role.'}>
                     <Grid>
                        <SearchBar
                           placeholder={'Search Users'}
                           searchValue={searchInput}
                           handleChange={handleSearchUsersInput}
                           searchResults={searchResults}
                           onSelectSearchResult={handleAddUserToRole}
                           keyPath={['fullName']}
                        />
                        <div className='flex flex-wrap gap-x-1 gap-y-1'>
                           {!!values?.usersOnRole?.length &&
                              values.usersOnRole.map((usersOnRole: any, i: number) => {
                                 if (!usersOnRole.archived) {
                                    return (
                                       <Chip
                                          key={i}
                                          value={usersOnRole.user?.fullName}
                                          onClick={(e: any, userOnRoleToRemove: any) => {
                                             handleRemoveUserFromRole(e, usersOnRole?.user);
                                          }}
                                       />
                                    );
                                 }
                              })}
                        </div>
                     </Grid>
                  </Explainer>
               )}
               <Grid rowGap={10} className=''>
                  <Grid columnCount={2}>
                     {/* pb-[6px] */}
                     <span className='flex items-center text-[18px] text-lum-gray-500 dark:text-lum-gray-300 h-fit self-end'>
                        Permissions
                     </span>
                     <div className='flex justify-self-end items-end gap-x-2'>
                        <Button
                           color='white'
                           iconName='Plus'
                           iconColor='gray:300'
                           onClick={(e: any) => {
                              tableRowsHandler(true);
                           }}>
                           Expand All
                        </Button>
                        <Button
                           color='white'
                           iconName='Minus'
                           iconColor='gray:300'
                           onClick={(e: any) => {
                              tableRowsHandler(false);
                           }}>
                           Collapse All
                        </Button>
                        {/* might need to mkae this a text input */}
                        <SearchBar
                           placeholder={'Search Permissions'}
                           searchValue={permissionSearchInput}
                           handleChange={handleSearchPermissionsInput}
                           searchResults={permissionSearchResults}
                           onSelectSearchResult={handleAddUserToRole}
                           keyPath={['fullName']}
                        />
                     </div>
                  </Grid>
                  <Table
                     columns={permissionColumns}
                     data={filteredPageData}
                     expandableRows
                     onCellEvent={handleCellEvent}
                     expandAllRows={expandAllTableRows}
                  />
               </Grid>
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} />
      </>
   );
};

export default RoleClient;
