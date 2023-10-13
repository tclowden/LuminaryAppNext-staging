'use client';
import React, { useEffect, useState } from 'react';
import DropDown from '../../../../../../common/components/drop-down/DropDown';
import * as Yup from 'yup';
import Grid from '../../../../../../common/components/grid/Grid';
import Hr from '../../../../../../common/components/hr/Hr';
import Input from '../../../../../../common/components/input/Input';
import Modal from '../../../../../../common/components/modal/Modal';
import Panel from '../../../../../../common/components/panel/Panel';
import Table from '../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../common/components/table/tableTypes';
import useForm, { YupSchemaObject } from '../../../../../../common/hooks/useForm';
import Checkbox from '../../../../../../common/components/checkbox/Checkbox';
import ChipButton from '../../../../../../common/components/chip-button/ChipButton';
import Chip from '../../../../../../common/components/chip/Chip';
import Textarea from '../../../../../../common/components/textarea/Textarea';
import { useAppDispatch } from '../../../../../../store/hooks';
import { setAddToast } from '../../../../../../store/slices/toast';

export const configurePagePermissions = (arr: Array<any>) => {
   // make a copy
   const copy = [...arr];
   // create the actionsConfig
   return copy.map((obj: any, i: number) => {
      return {
         ...obj,
         actionsConfig: {
            edit: true,
            delete: obj?.isDefaultPermission ? false : true,
         },
      };
   });
};

const columns: ColumnType[] = [
   { keyPath: ['name'], title: 'Name', colSpan: 2 },
   {
      keyPath: ['isDefaultPermission'],
      title: 'Default Permission',
      colSpan: 1,
      render: ({ item }: any) => <>{item?.isDefaultPermission ? 'Yes' : 'No'}</>,
   },
   {
      keyPath: ['tags'],
      title: 'Permission Tags',
      colSpan: 1,
      render: ({ item }) => {
         const permissionTagsString = item?.permissionTagsOnPermission
            .filter((tagOnPerm: any) => !tagOnPerm.archived)
            .map((tagOnPerm: any) => tagOnPerm.permissionTag?.name)
            .join(', ');
         return <span className='truncate'>{permissionTagsString}</span>;
      },
   },
];

const validationSchema: YupSchemaObject<any> = {
   createPermissionAction: Yup.string().required('Field is required'),
   name: Yup.string().when('createPermissionAction', {
      is: (permissionAction: string) => permissionAction === 'Create New Permission',
      then: () => Yup.string().required('Name is required'),
      otherwise: () => Yup.string().nullable(),
   }),
   description: Yup.string().when('createPermissionAction', {
      is: (permissionAction: string) => permissionAction === 'Create New Permission',
      then: () => Yup.string().required('Description is required'),
      otherwise: () => Yup.string().nullable(),
   }),
   permission: Yup.object().when('createPermissionAction', {
      is: (permissionAction: string) => permissionAction === 'Use Existing (Archived) Permission',
      then: () => Yup.object().required('Permission is required'),
      otherwise: () => Yup.object().nullable(),
   }),
};

const initEditPermissionConfig = {
   id: null,
   name: '',
   description: '',
   createPermissionAction: null,
   addPermissionToSuperAdmin: true,
   permissionTagsOnPermission: [],
};

interface Props {
   pagePermissions: Array<any>;
   permissionTags: Array<any>;
   setMultiValues: (data: any) => void;
}

const PagePermissions = ({ pagePermissions, setMultiValues, permissionTags }: Props) => {
   const [openAddPermissions, setOpenAddPermissions] = useState<boolean>(false);
   const [permissionTagSearchVal, setPermissionTagSearchVal] = useState<string>('');
   const dispatch = useAppDispatch();

   const handleAddPermissionTag = (e: any, permissionTagToAdd: any) => {
      // make a copy of array
      const tempTagsOnPermission = [...permissionValues?.permissionTagsOnPermission];

      // see if needing to create a new permission tag
      if (permissionTagToAdd === 'Create New') {
         permissionTagToAdd = { id: null, name: e.target.value.toLowerCase().trim(), archived: false };
      }

      // see if the tag already exists in the array, but is just archived
      const tagAlreadyExistsIndex = tempTagsOnPermission.findIndex(
         (tagOnPermission: any) => tagOnPermission?.permissionTag?.name === permissionTagToAdd?.name
      );

      if (tagAlreadyExistsIndex !== -1) {
         // set the archived key to false
         tempTagsOnPermission[tagAlreadyExistsIndex]['archived'] = false;
         // move to the end of the array
         tempTagsOnPermission.push(tempTagsOnPermission.splice(tagAlreadyExistsIndex, 1)[0]);
      } else {
         // const tempId = Math.random().toString().slice(2, 8);
         // if not found... add the object with permissionTagId && permission details
         tempTagsOnPermission.push({
            permissionTagId: permissionTagToAdd?.id ?? null,
            permissionTag: {
               ...permissionTagToAdd,
               // tempId: tempId,
               archived: false,
            },
            id: null,
            archived: false,
         });
      }

      setEditPermissionConfig({ permissionTagsOnPermission: tempTagsOnPermission });
      setPermissionTagSearchVal('');
   };

   const handleRemovePermissionTag = (e: any, permissionTagToRemove: any) => {
      const tagsOnPermissionToSave = [...permissionValues?.permissionTagsOnPermission].map((tagOnPerm: any) => {
         return {
            ...tagOnPerm,
            // ...((tagOnPerm?.permissionTagId === permissionTagToRemove.id)  && { archived: true }),
            ...(tagOnPerm?.permissionTag?.name === permissionTagToRemove.name && { archived: true }),
         };
      });
      setEditPermissionConfig({ permissionTagsOnPermission: tagsOnPermissionToSave });
   };

   const handleActionClick = ({ actionKey, item }: any) => {
      switch (actionKey) {
         case 'delete':
            handleArchivePagePermission(item);
            break;
         case 'edit':
            setInitEditPermissionConfig({ createPermissionAction: 'Create New Permission', editMode: true, ...item });
            setOpenAddPermissions(true);
            break;
         default:
            break;
      }
   };

   const handleArchivePagePermission = (permissionToArchive: any) => {
      // add archive:true to the one to archive & reset the pagePermissions array
      // console.log('permissionToArchive:', permissionToArchive);
      // don't allow the user to delete the default permission
      if (permissionToArchive.isDefaultPermission) {
         return dispatch(
            setAddToast({
               iconName: 'XMarkCircle',
               details: [{ label: 'Error', text: "Can not remove the page's default permission." }],
               variant: 'danger',
               autoCloseDelay: 5,
            })
         );
      }
      const tempPermissions = [...pagePermissions].map((permission: any) => {
         // find the permission
         const foundPermission =
            (!!permissionToArchive?.id &&
               permissionToArchive?.id === permission?.id &&
               permissionToArchive?.name === permission?.name) ||
            (!!!permissionToArchive?.id &&
               permission?.tempId === permissionToArchive?.tempId &&
               permissionToArchive?.name === permission?.name);

         return {
            ...permission,
            ...(foundPermission && { archived: true }),
         };
      });

      setMultiValues({
         pagePermissions: configurePagePermissions(tempPermissions),
      });
   };

   const handleAddNewPermission = (e: any, updatedPermission: any) => {
      // make a copy
      let tempPagePermissions = [...pagePermissions];

      delete updatedPermission['permission'];
      delete updatedPermission['createPermissionAction'];

      if (updatedPermission?.archived) {
         // this means that the permission was archived before...
         // remove the archive
         updatedPermission['archived'] = false;
         // add editMode to edit the current obj in the array, instead of adding to the array
         updatedPermission['editMode'] = true;
      }

      if (updatedPermission?.editMode) {
         // we will update the permissions
         // find index inside the original array
         const foundPagePermissionIndex = updatedPermission?.id
            ? tempPagePermissions.findIndex((pagePerm: any) => pagePerm?.id === updatedPermission?.id)
            : tempPagePermissions.findIndex((pagePerm: any) => pagePerm?.tempId === updatedPermission?.tempId);
         tempPagePermissions[foundPagePermissionIndex] = updatedPermission;
      } else {
         // add tempId to know which ones to archive out of the array if archiving before saving anything.
         // at that time, id will be null
         const tempId = Math.random().toString().slice(2, 8);
         updatedPermission['tempId'] = tempId;
         // push new permission into array
         tempPagePermissions = [...tempPagePermissions, updatedPermission];
      }

      // add new obj to the pages object inside <PageClient />
      setMultiValues({
         pagePermissions: configurePagePermissions(tempPagePermissions),
      });

      setOpenAddPermissions(false);
      resetForm(initEditPermissionConfig);
   };

   const {
      values: permissionValues,
      handleChange,
      handleSubmit,
      handleBlur,
      errors: permissionErrors,
      setMultiValues: setEditPermissionConfig,
      resetValues: setInitEditPermissionConfig,
      resetForm,
   } = useForm({
      initialValues: initEditPermissionConfig,
      validationSchema: validationSchema,
      onSubmit: handleAddNewPermission,
   });

   const archivedPagePermissions = pagePermissions.filter((permission: any) => permission.archived);
   const pagePermissionsToShow = pagePermissions.filter((permission: any) => !permission.archived);
   const createPermissionActionOptions = ['Create New Permission', 'Use Existing (Archived) Permission'];

   const permissionTagsToChooseFrom = permissionTags?.filter((permissionTag: any) => {
      const permissionAlreadyUsingTag = permissionValues.permissionTagsOnPermission?.find(
         (tagOnPerm: any) => tagOnPerm.permissionTagId === permissionTag.id && !tagOnPerm.archived
      );
      if (!permissionAlreadyUsingTag && !!permissionTagSearchVal.length) {
         const searchIncludes = permissionTag?.name?.toLowerCase().includes(permissionTagSearchVal);
         if (searchIncludes) return permissionTag;
      } else if (!permissionAlreadyUsingTag && !permissionTagSearchVal.length) {
         return permissionTag;
      }
   });

   console.log('here??');

   return (
      <>
         <Panel
            title={'Page Permissions'}
            collapsible
            showChildButton
            childBtnDataTestAttribute={'addCoordinatorChildBtn'}
            childButtonText={'Create New Permission'}
            childButtonCallback={(e: any) => {
               setOpenAddPermissions(!openAddPermissions);
            }}>
            <Table
               theme='secondary'
               columns={columns}
               data={[...pagePermissionsToShow]}
               actions={[
                  { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Field', callback: handleActionClick },
                  {
                     icon: 'TrashCan',
                     actionKey: 'delete',
                     toolTip: 'Delete Coordinator',
                     callback: handleActionClick,
                  },
               ]}
            />
         </Panel>
         <Modal
            isOpen={openAddPermissions}
            onClose={(e: any) => {
               resetForm(initEditPermissionConfig);
               setOpenAddPermissions(false);
            }}
            size={'default'}
            zIndex={100}
            title={permissionValues?.editMode ? 'Edit Page Permission' : 'Create New Page Permission'}
            primaryButtonText={'Save Permission'}
            primaryButtonCallback={handleSubmit}>
            <Grid rowGap={20} className={`min-h-[120px]`}>
               <DropDown
                  label={`Create New or Add Existing (Archived) Permission`}
                  name='createPermissionAction'
                  placeholder='e.x) Create a new one...'
                  selectedValues={
                     permissionValues?.createPermissionAction ? [permissionValues?.createPermissionAction] : []
                  }
                  options={createPermissionActionOptions}
                  onBlur={handleBlur}
                  onOptionSelect={(e: any, selectedPermissionAction: string) => {
                     handleChange({
                        target: { type: 'text', value: selectedPermissionAction, name: 'createPermissionAction' },
                     });
                  }}
                  errorMessage={permissionErrors?.createPermissionAction}
                  disabled={!!permissionValues?.id}
               />
               {permissionValues?.createPermissionAction && <Hr className='mt-2' />}

               {permissionValues?.createPermissionAction === 'Use Existing (Archived) Permission' &&
                  (archivedPagePermissions.length ? (
                     <DropDown
                        label={`Select Permission to Unarchive`}
                        name='permission'
                        placeholder='Select Permission'
                        selectedValues={!!permissionValues?.permission ? [permissionValues.permission] : []}
                        options={archivedPagePermissions}
                        onOptionSelect={(e, selectedArchivedPermission) => {
                           setEditPermissionConfig({ ...selectedArchivedPermission });
                           handleChange({
                              target: { type: 'text', value: selectedArchivedPermission, name: 'permission' },
                           });
                        }}
                        onBlur={handleBlur}
                        keyPath={['name']}
                        errorMessage={permissionErrors?.permission}
                        disabled={!!archivedPagePermissions.length ? false : true}
                        required
                     />
                  ) : (
                     <div className='text-lum-red-500 text-[15px]'>
                        There are no archived permissions assigned to this page. Please create a new permission.
                     </div>
                  ))}

               {permissionValues?.createPermissionAction === 'Create New Permission' && (
                  <>
                     <Grid columnCount={1} responsive>
                        <Input
                           type={'text'}
                           value={permissionValues?.name}
                           onChange={handleChange}
                           onBlur={handleBlur}
                           name={'name'}
                           placeholder={'Enter permission name'}
                           label={`Permission Name`}
                           required
                           errorMessage={permissionErrors?.name}
                        />
                        <Textarea
                           value={permissionValues?.description}
                           onChange={handleChange}
                           onBlur={handleBlur}
                           name={'description'}
                           placeholder={'Enter permission description'}
                           label={'Permission Description'}
                           required
                           errorMessage={permissionErrors?.description}
                        />
                     </Grid>
                     <Grid>
                        <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>Associated Tags</span>
                        <div className='flex flex-wrap gap-x-1 gap-y-1'>
                           <span className='text-[14px] italic text-lum-gray-500 dark:text-lum-gray-300'>
                              Feature unavailable at this time...
                           </span>
                           {/* {!!permissionValues?.permissionTagsOnPermission?.length &&
                              permissionValues.permissionTagsOnPermission.map((tagOnPermission: any, i: number) => {
                                 if (!tagOnPermission.archived) {
                                    return (
                                       <Chip
                                          key={i}
                                          color='blue'
                                          value={tagOnPermission.permissionTag.name}
                                          onClick={(e: any, tagToRemove: any) => {
                                             handleRemovePermissionTag(e, tagOnPermission?.permissionTag);
                                          }}
                                       />
                                    );
                                 }
                              })}
                           <ChipButton
                              searchable
                              searchConfig={{
                                 placeholder: 'Search',
                                 searchValue: permissionTagSearchVal,
                                 handleChange: (e: any) => {
                                    setPermissionTagSearchVal(e.target.value);
                                 },
                              }}
                              data-test={'addPermissionTagBtn'}
                              chipBtnText={'+ Add Permission Tag'}
                              options={permissionTagsToChooseFrom}
                              textKeyPath={['name']}
                              onOptionSelect={handleAddPermissionTag}
                           /> */}
                        </div>
                     </Grid>
                  </>
               )}

               {/* Only allow this when creating a new permission */}
               {!permissionValues?.editMode && permissionValues?.createPermissionAction === 'Create New Permission' && (
                  <>
                     <Hr className='mt-2 mb-1' />
                     <Checkbox
                        checked={permissionValues?.addPermissionToSuperAdmin}
                        label={'Add permission to Super Admin role?'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={'addPermissionToSuperAdmin'}
                     />
                  </>
               )}
            </Grid>
         </Modal>
      </>
   );
};

export default PagePermissions;
