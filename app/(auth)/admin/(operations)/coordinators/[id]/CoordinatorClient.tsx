'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import * as Yup from 'yup';
import Button from '../../../../../../common/components/button/Button';
import ChipButton from '../../../../../../common/components/chip-button/ChipButton';
import Chip from '../../../../../../common/components/chip/Chip';
import Explainer from '../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../common/components/grid/Grid';
import Input from '../../../../../../common/components/input/Input';
import LoadingBackdrop from '../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import PageContainer from '../../../../../../common/components/page-container/PageContainer';
import useForm, { YupSchemaObject } from '../../../../../../common/hooks/useForm';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { setAddToast } from '../../../../../../store/slices/toast';
import { selectUser } from '../../../../../../store/slices/user';
import { fetchDbApi, revalidate } from '@/serverActions';
import { LumError } from '@/utilities/models/LumError';

const configureCoordinatorValidationSchema: YupSchemaObject<any> = {
   name: Yup.string().required('Name is required'),
};

interface Props {
   coordinator: any;
   roles: Array<any>;
}

const CoordinatorClient = ({ coordinator, roles }: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const [isSaving, setIsSaving] = useState<boolean>(false);

   const handleCoordSave = async (e: any, updatedValues: any) => {
      setIsSaving(true);
      // make sure the proper keys are there
      const dataToSave = { ...updatedValues };
      // const userAuthToken = Cookies.get('LUM_AUTH');
      const userAuthToken = user.token;

      try {
         let result = null;

         // need to check if creating a new task or updating an existing
         if (dataToSave?.id) {
            // update
            const url = `/api/v2/products/coordinators/${dataToSave.id}`;
            result = await fetchDbApi(url, {
               method: 'PUT',
               headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
               body: JSON.stringify(dataToSave),
            });
         } else {
            // create
            const url = `/api/v2/products/coordinators`;
            result = await fetchDbApi(url, {
               method: 'POST',
               headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
               body: JSON.stringify(dataToSave),
            });
         }

         if (!result?.errors?.length) {
            // need to add ?_ at the end of the route because nextjs only provides soft navigation with the router
            // with soft navigation, it won't rehit the page.tsx file to refetch all the updated data
            const url = `/admin/coordinators`;
            await revalidate({ path: url });
            router.push(url);
            setTimeout(() => {
               setIsSaving(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Coordinator Successfully Saved' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
         } else throw new LumError(400, result?.errors[0] || result?.message);
      } catch (err: any) {
         console.log('err:', err);
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

   const handleAddRole = (e: any, roleToAdd: any) => {
      // make a copy of the array
      const tempRolesOnProductCoordinator = [...values.rolesOnProductCoordinator];
      // see if the role already existed at one point within the coordinator
      // e.g. they deleted the role then added it back
      const alreadyFoundRoleIndex = tempRolesOnProductCoordinator.findIndex(
         (roleOnPC: any) => roleOnPC.roleId === roleToAdd.id
      );

      if (alreadyFoundRoleIndex !== -1) {
         // set the a the 'archived' key from the obj to fasle
         tempRolesOnProductCoordinator[alreadyFoundRoleIndex]['archived'] = false;
         // move to the end of the array
         tempRolesOnProductCoordinator.push(tempRolesOnProductCoordinator.splice(alreadyFoundRoleIndex, 1)[0]);
      }
      // if not found... add the object with the roleId, and the role details to the array
      else tempRolesOnProductCoordinator.push({ roleId: roleToAdd.id, role: roleToAdd });

      setValue('rolesOnProductCoordinator', tempRolesOnProductCoordinator);
   };

   const handleRemoveRole = (e: any, roleToRemove: any) => {
      const rolesOnProdCoordToSave = [...values.rolesOnProductCoordinator].map((r: any) => ({
         ...r,
         ...(r.roleId === roleToRemove.id && { archived: true }),
      }));
      setValue('rolesOnProductCoordinator', rolesOnProdCoordToSave);
   };

   const {
      handleSubmit,
      handleChange,
      handleBlur,
      values,
      setValue,
      // setFormData,
      errors,
   } = useForm({
      initialValues: coordinator,
      validationSchema: configureCoordinatorValidationSchema,
      onSubmit: handleCoordSave,
   });

   // find all the roles that aren't currently selected for the product coordinator
   const chipButtonOptions = roles.filter(
      (role: any) => !values?.rolesOnProductCoordinator?.find((r: any) => r.roleId === role.id && !r.archived)
   );

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
               <Explainer description='Give your Coordinator a name and select which Roles are associated with this coordinator.'>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Configure Coordinator</div>
                  <Grid>
                     <Input
                        data-test={'name'}
                        name='name'
                        label='Coordinator Name'
                        value={values?.name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder='Enter coordinator name'
                        errorMessage={errors?.name}
                        required
                     />
                     <Grid>
                        <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>Associated Roles</span>
                        <div className='flex flex-wrap gap-x-1'>
                           {!!values?.rolesOnProductCoordinator?.length &&
                              values.rolesOnProductCoordinator.map((roleOnProdCoord: any, i: number) => {
                                 if (!roleOnProdCoord.archived) {
                                    return (
                                       <Chip
                                          key={i}
                                          color={'blue'}
                                          value={roleOnProdCoord.role.name}
                                          onClick={(e: any, valueToRemove: string | number) => {
                                             handleRemoveRole(e, roleOnProdCoord.role);
                                          }}
                                       />
                                    );
                                 }
                              })}
                           <ChipButton
                              data-test={'addExcludedRoleBtn'}
                              chipBtnText='+ Add Role'
                              options={chipButtonOptions}
                              textKeyPath={['name']}
                              onOptionSelect={handleAddRole}
                           />
                        </div>
                     </Grid>
                  </Grid>
               </Explainer>
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} zIndex={101} />
      </>
   );
};

export default CoordinatorClient;
