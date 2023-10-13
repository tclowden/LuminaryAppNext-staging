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
import BuyBackRate from './(partials)/BuyBackRate';
import CompanyInfo from './(partials)/CompanyInfo';
import FeesAndCosts from './(partials)/FeesAndCosts';
import NetMetering from './(partials)/NetMetering';
import SpecialNotes from './(partials)/SpecialNotes';
import { fetchDbApi, revalidate } from '@/serverActions';
import { LumError } from '@/utilities/models/LumError';

const utilCompValidationSchema: YupSchemaObject<any> = {
   name: Yup.string().required('Name is required'),
   state: Yup.object().required('State is required'),
   connectionFee: Yup.number()
      .transform((value, originalValue) => {
         if (originalValue.trim() === '') return null;
         return value;
      })
      .required('Connection fee is required'),
   additionalCost: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
         if (originalValue.trim() === '') return null;
         return value;
      }),
   netMeter: Yup.boolean().required('Net metering is required'),
   netMeteringType: Yup.object().required('Buy back rate is required'),
   specialNotes: Yup.string(),
};

interface Props {}
const UtilityCompanyClient = ({}: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const { utilityCompany } = useAppSelector(selectPageContext);
   const dispatch = useAppDispatch();
   const [isSaving, setIsSaving] = useState<boolean>(false);

   const handleSaveUtilityCompany = async (e: any, updatedFormValues: any) => {
      setIsSaving(true);
      const dataToSave = { ...updatedFormValues };
      const userAuthToken = user.token;

      // delete keys:values not needed
      delete dataToSave['state'];
      delete dataToSave['netMeteringType'];

      if (dataToSave?.connectionFee === '') dataToSave.connectionFee = null;
      if (dataToSave?.additionalCost === '') dataToSave.additionalCost = null;

      try {
         let result = null;
         const HEADERS = (result = { 'Content-Type': 'application/json', Authorization: `Bearer ${userAuthToken}` });
         if (dataToSave.id) {
            // update
            const url = `/api/v2/utility-companies/${dataToSave.id}`;
            result = await fetchDbApi(url, { method: 'PUT', headers: HEADERS, body: JSON.stringify(dataToSave) });
         } else {
            const url = `/api/v2/utility-companies`;
            result = await fetchDbApi(url, { method: 'POST', headers: HEADERS, body: JSON.stringify(dataToSave) });
         }

         if (!result?.errors?.length) {
            // need to add ?_ at the end of the route because nextjs only provides soft navigation with the router
            // with soft navigation, it won't rehit the page.tsx file to refetch all the updated data
            const url = `/admin/utility-companies`;
            await revalidate({ path: url });
            router.push(url);
            setTimeout(() => {
               setIsSaving(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Utility Company Successfully Saved' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
         } else throw new LumError(400, result?.errors[0] || result?.message);
      } catch (err: any) {
         console.log('err saving product', err);
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

   const { values, errors, handleSubmit, handleBlur, handleChange } = useForm({
      initialValues: { ...utilityCompany },
      validationSchema: utilCompValidationSchema,
      onSubmit: handleSaveUtilityCompany,
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
               <CompanyInfo handleBlur={handleBlur} handleChange={handleChange} values={values} errors={errors} />
               <FeesAndCosts handleBlur={handleBlur} handleChange={handleChange} values={values} errors={errors} />
               <NetMetering handleBlur={handleBlur} handleChange={handleChange} values={values} errors={errors} />
               <BuyBackRate handleBlur={handleBlur} handleChange={handleChange} values={values} errors={errors} />
               <SpecialNotes handleBlur={handleBlur} handleChange={handleChange} values={values} errors={errors} />
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} zIndex={101} />
      </>
   );
};

export default UtilityCompanyClient;
