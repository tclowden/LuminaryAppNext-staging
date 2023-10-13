'use client';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Button from '../../../../../../common/components/button/Button';
import DropDown from '../../../../../../common/components/drop-down/DropDown';
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

const configureStageValidationSchema: YupSchemaObject<any> = {
   name: Yup.string().required(),
   stageType: Yup.object().required(),
   // webhookUrl: Yup.string().nullable().url(`Must be a valid url.`),
   webhookUrl: Yup.string()
      .nullable()
      .matches(/^https?:\/\/(www\.)?[a-zA-Z0-9\-\.]+(:\d{1,5})?(\/[a-zA-Z0-9\-]+)*\/?$/, 'Must be a valid url.'),
};

interface Props {
   stage: any;
   stageTypes: Array<any>;
}

const StageClient = ({ stage, stageTypes }: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const dispatch = useAppDispatch();

   const handleStageSave = async (e: any, updatedValues: any) => {
      setIsSaving(true);
      const dataToSave = { ...updatedValues };
      const userAuthToken = user.token;

      try {
         let result = null;

         // need to check if creating a new task or updating an existing
         if (dataToSave?.id) {
            // update
            let url = `/api/v2/products/stages/${dataToSave.id}`;
            result = await fetchDbApi(url, {
               method: 'PUT',
               headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
               body: JSON.stringify(dataToSave),
            });
         } else {
            // create
            let url = `/api/v2/products/stages`;
            result = await fetchDbApi(url, {
               method: 'POST',
               headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
               body: JSON.stringify(dataToSave),
            });
         }

         if (!result?.errors?.length) {
            // need to add ?_ at the end of the route because nextjs only provides soft navigation with the router
            // with soft navigation, it won't rehit the page.tsx file to refetch all the updated data
            const url = `/admin/stages`;
            await revalidate({ path: url });
            router.push(url);
            setTimeout(() => {
               setIsSaving(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Stage Successfully Saved' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
         } else throw new LumError(400, result?.errors[0] || result?.message);
      } catch (err: any) {
         console.log('err saving stage:', err);
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

   const handleStageTypeSelect = (e: any, selectedStageType: any) => {
      handleChange({ target: { type: 'text', value: selectedStageType.id, name: 'stageTypeId' } });
      handleChange({ target: { type: 'text', value: selectedStageType, name: 'stageType' } });
   };

   const { handleSubmit, handleChange, handleBlur, values, errors } = useForm({
      initialValues: { ...stage },
      validationSchema: configureStageValidationSchema,
      onSubmit: handleStageSave,
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
               <Explainer description='Give your Stage a name, set Estimated Time to Complete and set whether it is a scheduled stage.'>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Configure Stage</div>
                  <Grid columnCount={2} responsive>
                     <Input
                        data-test={'name'}
                        name='name'
                        label='Stage name'
                        value={values?.name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={'Enter Stage Name'}
                        required
                        errorMessage={errors?.name}
                     />
                     <DropDown
                        data-test={'stageType'}
                        label='Stage Type'
                        options={stageTypes}
                        selectedValues={values?.stageType ? [values.stageType] : []}
                        placeholder={'Select Stage Type'}
                        keyPath={['name']}
                        name={'stageType'}
                        onOptionSelect={handleStageTypeSelect}
                        onBlur={handleBlur}
                        errorMessage={errors?.stageType}
                        required
                     />
                     {/* <ToggleSwitch
                     textOptions='yes/no'
                     checked={formData.isScheduledStage}
                     onChange={handleChange}
                     label='Scheduled Stage?'
                     name='isScheduledStage'
                  /> */}
                  </Grid>
               </Explainer>
               <Explainer description='Enter a webhook to fire whenever the order is put into this stage.'>
                  {/* <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Configure Webhook</div> */}
                  <Grid columnCount={1} responsive>
                     <Input
                        data-test={'webhookUrl'}
                        name='webhookUrl'
                        label='Stage Webhook Url'
                        value={values?.webhookUrl || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={'Enter Webhook Url'}
                        errorMessage={errors?.webhookUrl}
                     />
                  </Grid>
               </Explainer>
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} zIndex={101} />
      </>
   );
};

export default StageClient;
