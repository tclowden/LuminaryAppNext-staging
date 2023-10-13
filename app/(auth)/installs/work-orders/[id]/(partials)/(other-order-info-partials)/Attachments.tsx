'use client';
import Table from '@/common/components/table/Table';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import { formatPostgresTimestamp } from '@/utilities/helpers';
import React, { useEffect, useState } from 'react';
import AttachmentsModal from './(modal-partials)/AttachmentsModal';
import { selectUser } from '@/store/slices/user';
import { fetchDbApi } from '@/serverActions';
import { setAddToast } from '@/store/slices/toast';
import { LumError } from '@/utilities/models/LumError';
import ConfirmModal from '@/common/components/confirm-modal/ConfirmModal';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';

interface Props {
   modalOpen: boolean;
   setModalOpen: (bool: boolean) => void;
}

const Attachments = ({ modalOpen, setModalOpen }: Props) => {
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const { order } = useAppSelector(selectPageContext);
   const [attachmentConfig, setAttachmentConfig] = useState<any>({});
   const [attachmentsOnOrder, setAttachmentsOnOrder] = useState<Array<any>>([]);
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
   const [attachmentToDelete, setAttachmentToDelete] = useState<any>();

   useEffect(() => {
      // wheneevr all tasks change, refilter the two types of tasks
      if (order?.attachmentsOnOrder?.length) {
         let tempAttachmentsOnOrder = [...order?.attachmentsOnOrder].map((attachmentOnOrder: any) => {
            attachmentOnOrder['actionsConfig'] = { edit: true, delete: true };
            return attachmentOnOrder;
         });

         setAttachmentsOnOrder(tempAttachmentsOnOrder);
      }
   }, [order?.attachmentsOnOrder]);

   const handleDeleteAttachment = (attachmentToDelete: any) => {
      setIsSaving(true);
      fetchDbApi(`/api/v2/attachments/${attachmentToDelete?.id}`, {
         method: 'DELETE',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      })
         .then((res: any) => {
            if (!res?.errors?.length) {
               // remove the note from the global state array
               const tempAttachmentsOnOrder = [...order?.attachmentsOnOrder].filter(
                  (attachmentOnOrder: any) => attachmentOnOrder?.id !== attachmentToDelete?.id
               );
               dispatch(setPageContext({ order: { ...order, attachmentsOnOrder: tempAttachmentsOnOrder } }));

               setTimeout(() => {
                  setIsSaving(false);
                  setConfirmModalOpen(false);
                  dispatch(
                     setAddToast({
                        details: [{ label: 'Success', text: 'Attachment Deleted!' }],
                        iconName: 'CheckMarkCircle',
                        variant: 'success',
                        autoCloseDelay: 5,
                     })
                  );
               }, 500);
            } else throw new LumError(400, res?.errors[0] || res?.message);
         })
         .catch((err: any) => {
            console.log('err saving task on order...:', err);
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

   useEffect(() => {
      // reset the note object whenever the modal closes...
      if (!modalOpen) setAttachmentConfig({});
   }, [modalOpen]);

   const handleActionClick = ({ actionKey, item }: any) => {
      switch (actionKey) {
         case 'edit':
            // console.log('item:', item);
            setAttachmentConfig(item);
            setModalOpen(true);
            break;
         default:
            setAttachmentToDelete(item);
            setConfirmModalOpen(true);
            break;
      }
   };

   return (
      <>
         <Table
            data={attachmentsOnOrder}
            theme='secondary'
            emptyStateDisplayText='No Attachments'
            actions={[
               { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Note', callback: handleActionClick },
               { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Note', callback: handleActionClick },
            ]}
            columns={[
               {
                  keyPath: [''],
                  title: 'Attachment',
                  colSpan: 3,
                  ellipsis: true,
                  render: ({ item }: any) => {
                     return (
                        <>
                           {item?.fileNickName ? (
                              item?.fileNickName
                           ) : item?.fileName ? (
                              item?.fileName
                           ) : (
                              <span className='text-lum-gray-300'>No File Name</span>
                           )}
                        </>
                     );
                  },
               },
               {
                  keyPath: ['createdBy', 'fullName'],
                  title: 'Created By',
                  colSpan: 1,
                  ellipsis: true,
               },
               {
                  keyPath: ['attachmentType', 'name'],
                  title: 'Type of Attachment',
                  colSpan: 1,
                  ellipsis: true,
               },
               {
                  keyPath: ['createdAt'],
                  title: 'Created At',
                  colSpan: 1,
                  ellipsis: true,
                  render: ({ item }) => <>{formatPostgresTimestamp(item?.createdAt)}</>,
               },
            ]}
         />

         <AttachmentsModal modalOpen={modalOpen} setModalOpen={setModalOpen} initValues={attachmentConfig || {}} />
         <ConfirmModal
            open={confirmModalOpen}
            handleOnClose={(e: any) => setConfirmModalOpen(false)}
            handleOnConfirm={(e: any) => {
               handleDeleteAttachment(attachmentToDelete);
            }}
            value={'attachment'}
         />
         <LoadingBackdrop isOpen={isSaving} zIndex={102} />
      </>
   );
};

export default Attachments;
