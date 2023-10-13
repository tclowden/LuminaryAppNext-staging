'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import * as Yup from 'yup';
import Button from '../../../../../../common/components/button/Button';
import Grid from '../../../../../../common/components/grid/Grid';
import LoadingBackdrop from '../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import PageContainer from '../../../../../../common/components/page-container/PageContainer';
import useForm, { YupSchemaObject } from '../../../../../../common/hooks/useForm';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { selectPageContext } from '../../../../../../store/slices/pageContext';
import { setAddToast } from '../../../../../../store/slices/toast';
import { selectUser } from '../../../../../../store/slices/user';
import TeamInfo from './(partials)/TeamInfo';
import TeamProducts from './(partials)/TeamProducts';
import TeamUsers from './(partials)/TeamUsers';
import { fetchDbApi } from '@/serverActions';
import { LumError } from '@/utilities/models/LumError';

const teamValidationSchema: YupSchemaObject<any> = {
   name: Yup.string().required('Name is required'),
   teamType: Yup.object().required('Team type is required'),
   teamProducts: Yup.array(),
   teamUsers: Yup.array(),
};

interface Props {}
const TeamClient = ({}: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const { team } = useAppSelector(selectPageContext);
   const dispatch = useAppDispatch();
   const [isSaving, setIsSaving] = useState<boolean>(false);

   const handleSaveTeam = async (e: any, updatedFormValues: any) => {
      setIsSaving(true);
      const userAuthToken = user.token;
      const dataToSave = { ...updatedFormValues };

      // see if dataToSave.teamType.name is 'Dropdown' or 'Checkbox' type
      // handle productFieldOptions
      const teamTypeShouldHaveTeamProducts: boolean =
         dataToSave.teamType.name === 'Operations' || dataToSave.teamType.name === 'HVAC';
      const teamTypeCurrentlyHasTeamProducts = dataToSave?.teamProducts && dataToSave.teamProducts.length > 0;

      if (!teamTypeShouldHaveTeamProducts && teamTypeCurrentlyHasTeamProducts) {
         // if the team type should NOT have team products and the teamProducts key is an array of products
         // append the { "archived": true } to each object in array to archived from the db
         dataToSave['teamProducts'] = [...dataToSave.teamProducts].map((teamProduct: any, i: number) => ({
            ...teamProduct,
            archived: true,
         }));
      }
      //•• this might happen, but there is nothing to do if this scenario is true
      // else if (teamTypeShouldHaveTeamProducts && teamTypeCurrentlyHasTeamProducts) {}
      //•• this should already be covered because the original object for teamProducts is an empty array... (e.g -> [])
      // else if (!teamTypeShouldHaveTeamProducts && !teamTypeCurrentlyHasTeamProducts) {}
      //•• this should already be covered because the teamProducts array will be populated everytime there is a product added
      // else if (teamTypeShouldHaveTeamProducts && !teamTypeCurrentlyHasTeamProducts) {}

      // delete unneccesary data
      delete dataToSave['teamType'];
      if (!!dataToSave.teamProducts.length) {
         dataToSave['teamProducts'] = dataToSave.teamProducts.map((teamProduct: any) => {
            const copy = { ...teamProduct };
            delete copy['product'];
            return copy;
         });
      }
      if (!!dataToSave.teamUsers.length) {
         dataToSave['teamUsers'] = dataToSave.teamUsers.map((teamUser: any) => {
            const copy = { ...teamUser };
            delete copy['user'];
            delete copy['actionsConfig'];
            return copy;
         });
      }

      try {
         let result = null;
         const HEADERS = { 'Content-Type': 'application/json', Authorization: `Bearer ${userAuthToken}` };

         // check to see if creating a team or editing a team
         if (dataToSave.id) {
            // update
            const url = `/api/v2/teams/${dataToSave.id}`;
            result = await fetchDbApi(url, { method: 'PUT', headers: HEADERS, body: JSON.stringify(dataToSave) });
         } else {
            // create
            const url = `/api/v2/teams`;
            result = await fetchDbApi(url, { method: 'POST', headers: HEADERS, body: JSON.stringify(dataToSave) });
         }

         if (!result?.errors?.length) {
            // need to add ?_ at the end of the route because nextjs only provides soft navigation with the router
            // with soft navigation, it won't rehit the page.tsx file to refetch all the updated data
            const randomStr = Math.random().toString().slice(2, 7);
            router.push(`/admin/teams?${randomStr}`);
            setTimeout(() => {
               setIsSaving(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Team Successfully Saved' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
         } else throw new LumError(400, result?.errors[0] || result?.message);
      } catch (err: any) {
         console.log('err saving team', err);
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

      setIsSaving(false);
   };

   const { values, errors, handleSubmit, handleChange, handleBlur } = useForm({
      initialValues: team,
      validationSchema: teamValidationSchema,
      onSubmit: handleSaveTeam,
   });

   const showProductOptions =
      values?.teamType && (values?.teamType?.name === 'Operations' || values?.teamType?.name === 'HVAC');

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
               <TeamInfo values={values} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />

               {showProductOptions && (
                  <TeamProducts values={values} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
               )}
               <TeamUsers values={values} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} />
      </>
   );
};

export default TeamClient;
