'use client';
import Modal from '@/common/components/modal/Modal';
import useForm from '@/common/hooks/useForm';
import { fetchDbApi } from '@/serverActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import { selectUser } from '@/store/slices/user';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { getOrderData } from '../../../utilities';
import { setAddToast } from '@/store/slices/toast';
import { LumError } from '@/utilities/models/LumError';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';
import ContentEditable from '@/common/components/content-editable/ContentEditable';

interface Props {
   modalOpen: boolean;
   setModalOpen: (bool: boolean) => void;
   initValues: any;
}

// NOTE: This modal, could be shared across the lead record feature and work order feature
// NOTE: both features upload attachments and notes to the same tables... this is pretty much a copy and paste from each other

const NotesModal = ({ modalOpen, setModalOpen, initValues }: Props) => {
   const { order, notificationTypes } = useAppSelector(selectPageContext);
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [userQueryResults, setUserQueryResults] = useState<Array<any>>([]);

   const handleSaveNote = (e: any, updatedData: any) => {
      setIsSaving(true);
      const fullNoteOnOrder = order?.notesOnOrder?.find((taskOnOrder: any) => taskOnOrder?.id === updatedData?.id);

      let dataToSave = null;
      if (fullNoteOnOrder) dataToSave = { ...fullNoteOnOrder, ...updatedData };
      else dataToSave = { ...updatedData, pinned: false };

      // delete unnecessry data
      delete dataToSave['actionsConfig'];
      delete dataToSave['createdBy'];
      delete dataToSave['updatedBy'];
      delete dataToSave['createdAtPretty'];
      delete dataToSave['updatedAtPretty'];

      // add order id to object
      dataToSave['orderId'] = order?.id;

      if (!!dataToSave?.notifications?.length) {
         dataToSave['notifications'] = dataToSave?.notifications.map((noti: any) => {
            delete noti['taggedUser'];
            return noti;
         });
      }
      // else if (!dataToSave?.notifications) dataToSave['notifications'] = [];

      let url = null;
      let method = null;
      if (dataToSave?.id) {
         dataToSave['updatedById'] = user?.id;
         url = `/api/v2/notes/${dataToSave?.id}`;
         method = `PUT`;
      } else {
         dataToSave['createdById'] = user?.id;
         dataToSave['updatedById'] = null;
         url = `/api/v2/notes`;
         method = `POST`;
      }

      console.log('dataToSave:', dataToSave);

      fetchDbApi(url, {
         method: method,
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
         body: JSON.stringify(dataToSave),
      })
         .then(async (res: any) => {
            if (!res?.errors?.length) {
               const tempOrder = await getOrderData(user?.token || undefined, order?.id);
               dispatch(setPageContext({ order: tempOrder }));

               setTimeout(() => {
                  resetForm();

                  setIsSaving(false);
                  setModalOpen(false);
                  dispatch(
                     setAddToast({
                        details: [{ label: 'Success', text: 'Note Updated Successfully!' }],
                        iconName: 'CheckMarkCircle',
                        variant: 'success',
                        autoCloseDelay: 5,
                     })
                  );
               }, 500);
            } else throw new LumError(400, res?.errors[0] || res?.message);
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

   const handleNotificationChange = (tagged: Array<any>) => {
      if (!tagged?.length) return;

      // const individualNotiType = notificationTypes.find((type: any) => type.name === 'Individual');
      // const teamNotiType = notificationTypes.find((type: any) => type.name === 'Individual');

      const tempNotifications = tagged
         .map((xTag: any) => {
            // if there is an id, that means it's already an existing tag in the db, so don't alter it
            if (xTag?.id) return xTag;
            switch (xTag?.notificationType?.name) {
               case 'Individual':
                  return {
                     taggedUser: xTag?.tagged,
                     taggedByUserId: user?.id,
                     notificationTypeId: xTag?.notificationType?.id,
                     notificationType: xTag?.notificationType,
                     taggedUserId: xTag?.taggedUserId || xTag?.tagged?.id,
                     taggedTeamId: null,
                     complete: xTag?.complete || false,
                     id: null,
                     ...(xTag?.archived && {
                        archived: xTag?.archived,
                     }),
                  };
               case 'Team':
                  return [...xTag?.tagged?.users]?.map((user: any) => {
                     return {
                        taggedUser: user,
                        taggedByUserId: user?.id,
                        taggedUserId: user?.id,
                        taggedTeamId: user?.teamsUsers?.teamId,
                        complete: xTag?.complete || false,
                        id: null,
                        notificationTypeId: xTag?.notificationType?.id,
                        notificationType: xTag?.notificationType,
                        ...(xTag?.archived && {
                           archived: xTag?.archived,
                        }),
                     };
                  });
               default:
                  break;
            }
         })
         .flat();

      // console.log('tempNotifications:', tempNotifications);
      setValue('notifications', tempNotifications);
   };

   const { handleSubmit, handleChange, handleBlur, values, errors, setValue, setMultiValues, resetForm } = useForm({
      initialValues: initValues,
      validationSchema: {
         pinned: Yup.boolean().nullable(),
         content: Yup.string()
            .required('Content is required.')
            .when({
               is: (value: any) => typeof value === 'string',
               then: (schema: any) => {
                  return Yup.string().test(
                     'non-empty-string',
                     'Content must be greater than 0 characters',
                     (value: any) => {
                        if (value?.length > 0) return true;
                        else return false;
                     }
                  );
               },
            }),
         notifications: Yup.array(
            Yup.object({
               // taggedId: Yup.string().required(),
               taggedByUserId: Yup.string().required(),
               notificationTypeId: Yup.string().required(),
            })
         ).nullable(),
      },
      onSubmit: handleSaveNote,
   });

   useEffect(() => {
      if (modalOpen && !!Object.keys(initValues)?.length) {
         setMultiValues({ ...initValues });
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
            title='Add Note'
            primaryButtonCallback={handleSubmit}
            primaryButtonText='Save'>
            <>
               <ContentEditable
                  label={'Note Content'}
                  name={'content'}
                  onBlur={handleBlur}
                  placeholder={'PM scheduled 7/22/21 @ 10:30 am...'}
                  errorMessage={errors?.content}
                  required
                  onChange={(e: any, { dbFormattedString, searchInput, tagged, newTermSelected }: any) => {
                     handleChange({ target: { value: dbFormattedString, type: 'text', name: 'content' } });
                     if (newTermSelected) handleNotificationChange(tagged);
                  }}
                  onPillClick={(e: any, pillClicked: any) => {
                     console.log('pill clicked', pillClicked);
                  }}
                  defaultText={initValues?.content || ''}
                  defaultTagged={initValues?.notifications || []}
                  tablesToQueryFrom={['users', 'teams']}
               />
            </>
         </Modal>
         <LoadingBackdrop isOpen={isSaving} zIndex={102} />
      </>
   );
};

export default NotesModal;
