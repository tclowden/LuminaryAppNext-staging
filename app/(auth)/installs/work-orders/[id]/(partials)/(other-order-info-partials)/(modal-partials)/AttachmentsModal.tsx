'use client';
import Icon from '@/common/components/Icon';
import Grid from '@/common/components/grid/Grid';
import Input from '@/common/components/input/Input';
import Modal from '@/common/components/modal/Modal';
import UploadFileButton from '@/common/components/upload-file-button/UploadFileButton';
import useForm, { YupSchemaObject } from '@/common/hooks/useForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import { setAddToast } from '@/store/slices/toast';
import { selectUser } from '@/store/slices/user';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { getOrderData } from '../../../utilities';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';
import { LumError } from '@/utilities/models/LumError';
import ToggleSwitch from '@/common/components/toggle-switch/ToggleSwitch';

interface Props {
   modalOpen: boolean;
   setModalOpen: (bool: boolean) => void;
   initValues: any;
}

// NOTE: This modal, could be shared across the lead record feature and work order feature
// NOTE: both features upload attachments and notes to the same tables... this is pretty much a copy and paste from each other

const AttachmentsModal = ({ modalOpen, setModalOpen, initValues }: Props) => {
   const { order, attachmentTypes } = useAppSelector(selectPageContext);
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [validationSchema, setValidationSchema] = useState<YupSchemaObject<any>>();

   const handleSaveAttachmentOnOrder = (e: any, updatedData: any) => {
      setIsSaving(true);
      const copy = { ...updatedData };

      let dataToSave = null;
      let method = null;
      let url = null;
      let contentType = null;

      // delete unneccesary keys
      delete copy['actionsConfig'];
      delete copy['createdBy'];
      delete copy['updatedBy'];
      delete copy['isInstallAgreementType'];

      if (copy?.fileNickName?.length === 0) copy['fileNickName'] = null;

      if (copy?.id) {
         dataToSave = { ...copy };
         url = `/api/v2/attachments/${dataToSave?.id}`;
         method = `PUT`;
         contentType = 'application/json';

         dataToSave['updatedById'] = user?.id;
         if (!dataToSave?.leadId) dataToSave['leadId'] = order?.leadId;

         dataToSave = JSON.stringify(dataToSave);
      } else {
         url = `/api/v2/attachments`;
         method = `POST`;
         dataToSave = new FormData();

         dataToSave.append('file', copy?.file[0]);
         if (copy?.fileNickName) dataToSave.append('fileNickName', copy.fileNickName);
         dataToSave.append('filePath', `leads/${order?.leadId}/attachments`);
         dataToSave.append('leadId', order?.leadId);
         dataToSave.append('orderId', order?.id);
         dataToSave.append('createdById', user?.id as string);
         dataToSave.append('attachmentTypeId', copy?.attachmentTypeId);
      }

      fetch(url, {
         method: method,
         headers: {
            Authorization: `Bearer ${user?.token}`,
            ...(contentType && { 'Content-Type': contentType }),
         },
         body: dataToSave,
      })
         .then((res: any) => res.json())
         .then(async (res: any) => {
            if (res?.errors?.length) throw new LumError(400, res?.message || res?.errors[0]);

            const tempOrder = await getOrderData(user?.token || undefined, order?.id);
            dispatch(setPageContext({ order: tempOrder }));

            setTimeout(() => {
               resetForm();

               setIsSaving(false);
               setModalOpen(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Attachment Updated Successfully!' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
         })
         .catch((err: any) => {
            console.log('err saving note on order...:', err);
            setIsSaving(false);
            const errMsg = err?.errorMessage || 'Changes Not Saved';
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

   const { handleSubmit, handleChange, handleBlur, values, errors, setValue, setMultiValues, resetForm } = useForm({
      initialValues: initValues,
      validationSchema: validationSchema,
      onSubmit: handleSaveAttachmentOnOrder,
   });

   useEffect(() => {
      if (!modalOpen) {
         resetForm();
         setValidationSchema(undefined);
      }

      const initValuesHasLength = !!Object.keys(initValues)?.length;
      if (modalOpen && initValuesHasLength) {
         const installAgreementAttachmentType = attachmentTypes.find((at: any) => at?.name === 'Install Agreement');
         const isInstallAgreementType =
            !!initValues?.attachmentTypeId && initValues?.attachmentTypeId === installAgreementAttachmentType?.id;
         setMultiValues({ ...initValues, isInstallAgreementType: isInstallAgreementType });
      } else if (modalOpen && !initValuesHasLength) {
         const workOrderAttachmentType = attachmentTypes.find((at: any) => at?.name === 'Work Order');
         setValue('attachmentTypeId', workOrderAttachmentType?.id);
         setValue('isInstallAgreementType', false);
      }

      // we are in edit mode
      if (initValues?.id) {
         setValidationSchema({
            fileNickName: Yup.string().nullable(),
            isInstallAgreementType: Yup.boolean().required(),
         });
      } else {
         setValidationSchema({
            file: Yup.mixed()
               .required('Required')
               .test('is-valid-type', 'Not a valid image type', (fileList: any) => {
                  const validFileExtensions = ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'];
                  const file = fileList[0];
                  const fileName = file?.name?.toLowerCase();
                  validFileExtensions.indexOf(fileName.split('.').pop()) > -1;
                  return fileName && validFileExtensions.indexOf(fileName.split('.').pop()) > -1;
               }),
            fileNickName: Yup.string().nullable(),
            isInstallAgreementType: Yup.boolean().required(),
         });
      }
   }, [initValues, modalOpen]);

   return (
      <>
         <Modal
            zIndex={100}
            isOpen={modalOpen}
            onClose={(e: any) => {
               setModalOpen(false);
               resetForm();
            }}
            title='Add Attachment'
            primaryButtonText='Save'
            primaryButtonCallback={handleSubmit}>
            <Grid>
               <Grid columnCount={3}>
                  <div className='col-start-1 col-end-3'>
                     <Input
                        name='fileName'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label='File Name'
                        value={values?.fileName || ''}
                        placeholder='Ex) filename.png'
                        disabled
                     />
                  </div>
                  <UploadFileButton
                     disabled={values?.id}
                     name='file'
                     onInput={(e: any) => {
                        handleChange(e);
                        setValue('fileName', e.target.files[0]?.name);
                     }}
                     buttonClassName='h-[40px] self-end col-start-3'
                     accept={'.gif, .jpg, .png, .webp'}>
                     Upload File
                  </UploadFileButton>
               </Grid>

               {values?.fileName && (
                  <Grid columnCount={3}>
                     <div className='col-start-1 col-end-3'>
                        <Input
                           name='fileNickName'
                           onChange={handleChange}
                           onBlur={handleBlur}
                           label='File Nickname (Optional)'
                           value={values?.fileNickName || ''}
                           placeholder='Ex) filename.png'
                           customInputClasses={
                              !!errors?.file || !!errors?.fileNickName
                                 ? 'border-[1px] border-solid border-lum-red-500 dark:border-lum-red-500'
                                 : ''
                           }
                           disabled={!values?.id && !values?.file}
                        />
                     </div>
                     <ToggleSwitch
                        textOptions='yes/no'
                        checked={values?.isInstallAgreementType ?? false}
                        onChange={(e: any) => {
                           const types = attachmentTypes;
                           const installAgreementType = types.find((at: any) => at.name === 'Install Agreement');
                           const workOrderType = types.find((at: any) => at.name === 'Work Order');
                           if (e.target.checked) setValue('attachmentTypeId', installAgreementType?.id);
                           else setValue('attachmentTypeId', workOrderType?.id);
                           handleChange(e);
                        }}
                        onBlur={handleBlur}
                        label='Install Agreement'
                        name='isInstallAgreementType'
                        errorMessage={errors?.isInstallAgreementType}
                     />
                  </Grid>
               )}

               {errors?.file ||
                  (errors?.fileNickName && (
                     <div className='flex pt-[6px]'>
                        <Icon
                           className='min-w-[11px] min-h-[11px] fill-lum-red-500'
                           name='Warning'
                           height='11'
                           width='11'
                           viewBox='0 0 16 16'
                        />
                        <span className='mt-[-3px] pl-[6px] text-[11px] leading-[14px] text-lum-gray-600 dark:text-lum-gray-300'>
                           {errors?.file || errors?.fileNickName}
                        </span>
                     </div>
                  ))}
            </Grid>
         </Modal>
         <LoadingBackdrop zIndex={201} isOpen={isSaving} />
      </>
   );
};

export default AttachmentsModal;
