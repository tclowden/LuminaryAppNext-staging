'use client';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import React, { useState } from 'react';
import Button from '../../../../../../common/components/button/Button';
import Explainer from '../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../common/components/grid/Grid';
import Input from '../../../../../../common/components/input/Input';
import LoadingBackdrop from '../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import PageContainer from '../../../../../../common/components/page-container/PageContainer';
import Textarea from '../../../../../../common/components/textarea/Textarea';
import useForm, { YupSchemaObject } from '../../../../../../common/hooks/useForm';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { setAddToast } from '../../../../../../store/slices/toast';
import { selectUser } from '../../../../../../store/slices/user';
import { fetchDbApi, revalidate } from '@/serverActions';
import { LumError } from '@/utilities/models/LumError';

const configureTaskValidationSchema: YupSchemaObject<any> = {
   name: Yup.string().required(),
   description: Yup.string().required(),
};

// const timeframeTypes = [
//    { id: 1, name: 'Time to Complete' },
//    { id: 2, name: 'Due "X" Days before Date (from Input Field)' },
//    { id: 3, name: 'Due "X" Days before next Install Date' },
// ];

interface Props {
   task: any;
}

const TaskClient = ({ task }: Props) => {
   const router = useRouter();
   const user: any = useAppSelector(selectUser);
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const dispatch = useAppDispatch();

   const handleTaskSave = async (e: any, updatedValues: any) => {
      setIsSaving(true);
      const dataToSave = { ...updatedValues };
      const userAuthToken = user.token;

      try {
         let result = null;

         // need to check if creating a new task or updating an existing
         if (dataToSave?.id) {
            // update
            let url = `/api/v2/products/tasks/${dataToSave.id}`;
            result = await fetchDbApi(url, {
               method: 'PUT',
               headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
               body: JSON.stringify(dataToSave),
            });
         } else {
            // create
            let url = `/api/v2/products/tasks`;
            result = await fetchDbApi(url, {
               method: 'POST',
               headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
               body: JSON.stringify(dataToSave),
            });
         }

         if (!result?.errors?.length) {
            // need to add ?_ at the end of the route because nextjs only provides soft navigation with the router
            // with soft navigation, it won't rehit the page.tsx file to refetch all the updated data
            const url = `/admin/tasks`;
            await revalidate({ path: url });
            router.push(url);
            setTimeout(() => {
               setIsSaving(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Task Successfully Saved' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
         } else throw new LumError(400, result?.errors[0] || result?.message);
      } catch (err: any) {
         console.log('err saving task', err);
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

   const { handleSubmit, handleChange, handleBlur, values, errors } = useForm({
      initialValues: task,
      validationSchema: configureTaskValidationSchema,
      onSubmit: handleTaskSave,
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
               <Explainer description='Give your Task a name/description, Completion Time Frame Type and the Estimated Time to Complete.'>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Configure Task</div>
                  <Grid>
                     <Input
                        data-test={'name'}
                        name='name'
                        label='Task Name'
                        value={values?.name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={'Ex) Call Sherly Temple'}
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
                     {/* <Grid columnCount={3} responsive>
                     <DropDown
                        label='Time Frame Type'
                        options={timeframeTypes}
                        selectedValues={[task?.timeframeType || timeframeTypes[0]]}
                        // selectedValues={task?.timeframeType || timeframeTypes[0]}
                        placeholder={'Select Time Frame Type'}
                        keyPath={['name']}
                        onOptionSelect={(e: any, selectedTimeFrameType: any) => {
                           console.log('selectedTimeFrameType:', selectedTimeFrameType);
                        }}
                        required
                     />
                     <Input
                        label='Days'
                        type={'number'}
                        placeholder={'Days'}
                        onChange={handleInputChange}
                        name='days'
                        value={task?.days || 0}
                        required
                     />
                     <Input
                        label='Hours'
                        type={'number'}
                        placeholder={'=Hours'}
                        onChange={handleInputChange}
                        name='hours'
                        value={task?.hours || 0}
                        required
                     />
                  </Grid> */}
                  </Grid>
               </Explainer>
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} zIndex={101} />
      </>
   );
};

export default TaskClient;
