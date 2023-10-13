'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import Button from '../../../../../../common/components/button/Button';
import Grid from '../../../../../../common/components/grid/Grid';
import PageContainer from '../../../../../../common/components/page-container/PageContainer';
import useForm, { YupSchemaObject } from '../../../../../../common/hooks/useForm';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { ValidationParams } from '../../../../../../utilities/formValidation/types';
import Coordinators from './(partials)/Coordinators';
import InputFields from './(partials)/InputFields';
import ProductInfo from './(partials)/ProductInfo';
import Stages from './(partials)/Stages';
import Tasks from './(partials)/Tasks';
import { Color, ProductIcon } from './types';
import { selectUser } from '../../../../../../store/slices/user';
import axios from 'axios';
import LoadingBackdrop from '../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import { setAddToast } from '../../../../../../store/slices/toast';
import { selectPageContext } from '@/store/slices/pageContext';

const productValidationSchema: YupSchemaObject<any> = {
   name: Yup.string().required(),
   description: Yup.string().required(),
   iconColor: Yup.string().required(),
   iconName: Yup.string().required(),
};

interface Props {
   // product: any;
   // colors: Array<Color>;
   // icons: Array<ProductIcon>;
}
type ContainersOpenStateType = { [containerName: string]: boolean | { other: boolean; required: boolean } };
const ProductClient = ({}: Props) => {
   const router = useRouter();
   const dispatch = useAppDispatch();

   const user = useAppSelector(selectUser);
   const { product, colors, icons } = useAppSelector(selectPageContext);

   const [isSaving, setIsSaving] = useState<boolean>(false);

   const handleSaveProduct = async (e: any, formData: any) => {
      setIsSaving(true);
      const dataToSave = { ...formData };
      const userAuthToken = user.token;

      // reformat fieldsOnProduct
      dataToSave['fieldsOnProduct'] = [...dataToSave.fieldsOnProduct]
         .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
         .map((fieldOnProd: any, i: number) => {
            // make a copy
            const copy = { ...fieldOnProd };
            // delete keys:values not needed
            delete copy['actionsConfig'];
            // reset the displayOrder to start at 1
            copy['displayOrder'] = i + 1;
            // add stageOnProductConstraintTempId key set to null for every fieldOnProduct
            copy['stageOnProductConstraintTempId'] = null;
            // return new obj
            return copy;
         });

      // reformat tasksOnProduct
      dataToSave['tasksOnProduct'] = [...dataToSave.tasksOnProduct]
         .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
         .map((taskOnProd: any, i: number) => {
            // make a copy
            const copy = { ...taskOnProd };
            // make string a number before sending to server
            copy['daysToComplete'] = +copy.daysToComplete;
            // delete keys:values not needed
            delete copy['actionsConfig'];
            // reset the displayOrder to start at 1
            copy['displayOrder'] = i + 1;
            // add stageOnProductConstraintTempId key set to null for every taskOnProduct
            copy['stageOnProductConstraintTempId'] = null;
            // return new obj
            return copy;
         });

      // reformat stagesOnProduct
      dataToSave['stagesOnProduct'] = [...dataToSave.stagesOnProductRequired, ...dataToSave.stagesOnProductOther]
         .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
         .map((stageOnProd: any, i: number) => {
            // generate random id
            const tempId = Math.random().toString(36).substring(2, 10);
            // make a copy
            const copy = { ...stageOnProd };
            // add a tempororary id on the stage on product
            copy['tempId'] = tempId;

            // loop thru all the tasksOnProduct & see if there is a match
            // if there is a match, add appropriate tempId
            // so when saving the task, we know what stage constraint the task belongs to
            copy.requiredTasksOnProduct.forEach((reqTaskOnProd: any) => {
               const index = dataToSave.tasksOnProduct.findIndex((taskOnProd: any) => {
                  return taskOnProd.productTaskId === reqTaskOnProd.productTaskId;
               });
               if (index !== -1 && !reqTaskOnProd.archived) {
                  dataToSave.tasksOnProduct[index]['stageOnProductConstraintTempId'] = tempId;
               }
            });

            // loop through all the fieldsOnProduct & see if there is a match
            // if there is a match, add appropriate tempId
            // so when saving the field, we know what stage constraint the field belongs to
            copy.requiredFieldsOnProduct.forEach((reqFieldOnProd: any) => {
               const index = dataToSave.fieldsOnProduct.findIndex((fieldOnProd: any) => {
                  return fieldOnProd.productFieldId === reqFieldOnProd.productFieldId;
               });
               if (index !== -1 && !reqFieldOnProd.archived) {
                  dataToSave.fieldsOnProduct[index]['stageOnProductConstraintTempId'] = tempId;
               }
            });

            // delete keys:values not needed
            delete copy['requirementCount'];
            delete copy['daysToCompleteString'];
            delete copy['actionsConfig'];

            // add createdById
            // grab the user id from redux
            copy['createdById'] = user.id;
            // reset the displayOrder to start at 2... beginning stage will always be 1
            copy['displayOrder'] = i + 1 + 1;
            // make string a number before sending to server
            copy['daysToComplete'] = +copy.daysToComplete;

            // return new obj
            return copy;
         });

      // delete keys:values not needed
      delete dataToSave['stagesOnProductRequired'];
      delete dataToSave['stagesOnProductOther'];

      // reformat coordinatorsOnProduct
      dataToSave['coordinatorsOnProduct'] = [...dataToSave.coordinatorsOnProduct].map((coordOnProd: any) => {
         // make a copy
         const copy = { ...coordOnProd };
         // delete keys:values not needed
         delete copy['actionsConfig'];
         // return new obj
         return copy;
      });

      console.log('dataToSave:', dataToSave);

      try {
         let result = null;
         // need to check if creating a new product or updating an existing
         if (dataToSave.id) {
            // update
            const url = `/api/v2/products/${dataToSave.id}`;
            result = await axios.put(url, dataToSave, { headers: { Authorization: `Bearer ${userAuthToken}` } });
         } else {
            // create
            const url = `/api/v2/products`;
            result = await axios.post(url, dataToSave, { headers: { Authorization: `Bearer ${userAuthToken}` } });
         }

         if (result.status === 200) {
            // need to add ?_ at the end of the route because nextjs only provides soft navigation with the router
            // with soft navigation, it won't rehit the page.tsx file to refetch all the updated data
            const randomStr = Math.random().toString().slice(2, 7);
            router.push(`/admin/products?${randomStr}`);
            setTimeout(() => {
               setIsSaving(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Product Successfully Saved' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
         }
         setTimeout(() => {
            setIsSaving(false);
         }, 5000);
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

   // want to use the useForm hook for validation purposes... but still use redux to store the updated state
   const {
      handleChange,
      handleBlur,
      handleSubmit,
      values: formData,
      setValue,
      setMultiValues,
      errors,
   } = useForm({
      initialValues: product,
      validationSchema: productValidationSchema,
      onSubmit: handleSaveProduct,
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
               <ProductInfo
                  productName={formData?.name}
                  primary={formData?.primary}
                  description={formData?.description}
                  colors={colors}
                  icons={icons}
                  iconColor={formData?.iconColor}
                  iconName={formData?.iconName}
                  formErrors={errors}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
               />
               <Coordinators
                  coordinatorsOnProduct={formData?.coordinatorsOnProduct}
                  coordinatorsOnProductCount={formData?.coordinatorsOnProductCount}
                  setValue={setValue}
               />
               <InputFields
                  fieldsOnProduct={formData?.fieldsOnProduct}
                  fieldsOnProductCount={formData?.fieldsOnProductCount}
                  setValue={setValue}
                  setMultiValues={setMultiValues}
                  stagesOnProductOther={formData.stagesOnProductOther}
                  stagesOnProductRequired={formData.stagesOnProductRequired}
               />
               <Tasks
                  tasksOnProduct={formData.tasksOnProduct}
                  tasksOnProductCount={formData?.tasksOnProductCount}
                  setValue={setValue}
                  setMultiValues={setMultiValues}
                  fieldsOnProduct={formData?.fieldsOnProduct}
                  stagesOnProductOther={formData.stagesOnProductOther}
                  stagesOnProductRequired={formData.stagesOnProductRequired}
               />
               <Stages
                  stagesOnProduct={formData.stagesOnProduct}
                  stagesOnProductCount={formData.stagesOnProductCount}
                  stagesOnProductRequiredCount={formData.stagesOnProductRequiredCount}
                  stagesOnProductOtherCount={formData.stagesOnProductOtherCount}
                  stagesOnProductRequired={formData?.stagesOnProductRequired}
                  stagesOnProductOther={formData?.stagesOnProductOther}
                  setValue={setValue}
                  setMultiValues={setMultiValues}
                  tasksOnProduct={formData.tasksOnProduct}
                  fieldsOnProduct={formData.fieldsOnProduct}
               />
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} zIndex={101} />
      </>
   );
};

export default ProductClient;
