'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import * as Yup from 'yup';
import Button from '../../../../../../common/components/button/Button';
import Checkbox from '../../../../../../common/components/checkbox/Checkbox';
import Explainer from '../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../common/components/grid/Grid';
import Input from '../../../../../../common/components/input/Input';
import LoadingBackdrop from '../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import PageContainer from '../../../../../../common/components/page-container/PageContainer';
import ToggleSwitch from '../../../../../../common/components/toggle-switch/ToggleSwitch';
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

const FinancierValidationSchema: YupSchemaObject<any> = {
   name: Yup.string().required('Name is required'),
   specialNotes: Yup.string(),
};

interface Props {}
const FinancerClient = ({}: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const { financier } = useAppSelector(selectPageContext);

   const dispatch = useAppDispatch();
   const [isSaving, setIsSaving] = useState<boolean>(false);

   const handleSaveFinancier = async (e: any, updatedFormValues: any) => {
      setIsSaving(true);
      const dataToSave = { ...updatedFormValues, hidden: updatedFormValues?.hidden ?? false, pinned: false };
      const userAuthToken = user.token;

      try {
         let result = null;
         const HEADERS = { 'Content-Type': 'application/json', Authorization: `Bearer ${userAuthToken}` };
         if (dataToSave.id) {
            // update
            const url = `/api/v2/financiers/${dataToSave.id}`;
            result = await fetchDbApi(url, { method: 'PUT', headers: HEADERS, body: JSON.stringify(dataToSave) });
         } else {
            const url = `/api/v2/financiers`;
            result = await fetchDbApi(url, { method: 'POST', headers: HEADERS, body: JSON.stringify(dataToSave) });
         }

         if (!result?.errors?.length) {
            // need to add ?_ at the end of the route because nextjs only provides soft navigation with the router
            // with soft navigation, it won't rehit the page.tsx file to refetch all the updated data
            const url = `/admin/financiers`;
            await revalidate({ path: url });
            router.push(url);
            setTimeout(() => {
               setIsSaving(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Financier Successfully Saved' }],
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
      initialValues: financier,
      validationSchema: FinancierValidationSchema,
      onSubmit: handleSaveFinancier,
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
               <Explainer title='Loan option Info' description='What is the name of the Loan option.'>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Name</div>
                  <Grid columnCount={2} responsive>
                     <Input
                        type={'text'}
                        data-test={'name'}
                        label={'Financier Name'}
                        value={values?.name ?? ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={'name'}
                        placeholder={'ex) Dividend - 25 Year 6.49'}
                        required
                        errorMessage={errors?.name}
                     />
                  </Grid>
               </Explainer>

               <Explainer
                  title='Special Notes'
                  description='What is the name of the Loan option and what state does the Utility Company belong in?'>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Notes</div>
                  <Grid columnCount={2} responsive>
                     <Input
                        type={'text'}
                        data-test={'specialNotes'}
                        label={'Notes shown to Proposal Tech'}
                        value={values?.specialNotes ?? ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={'specialNotes'}
                        placeholder={'This lender requires etc.'}
                        required
                        errorMessage={errors?.specialNotes}
                     />
                  </Grid>
               </Explainer>

               <Explainer
                  title="Hide in some menu's"
                  description='What is the name of the Loan option and what state does the Utility Company belong in?'>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Hidden do not display</div>
                  <Grid columnCount={2} responsive>
                     <ToggleSwitch
                        name={'hidden'}
                        checked={values?.hidden ?? false}
                        onChange={handleChange}
                        label={'Hidden'}
                        value={values?.hidden ?? false}
                        textOptions='yes/no'
                        onBlur={handleBlur}
                        errorMessage={errors?.netMeter}
                     />
                  </Grid>
               </Explainer>

               {/* 
               <CompanyInfo handleBlur={handleBlur} handleChange={handleChange} values={values} errors={errors} />
               <FeesAndCosts handleBlur={handleBlur} handleChange={handleChange} values={values} errors={errors} />
               <NetMetering handleBlur={handleBlur} handleChange={handleChange} values={values} errors={errors} />
               <BuyBackRate handleBlur={handleBlur} handleChange={handleChange} values={values} errors={errors} />
               <SpecialNotes handleBlur={handleBlur} handleChange={handleChange} values={values} errors={errors} /> */}
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} zIndex={101} />
      </>
   );
};

export default FinancerClient;
