'use client';
import Table from '@/common/components/table/Table';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import { formatPostgresTimestamp } from '@/utilities/helpers';
import React, { useEffect, useState } from 'react';
import NotesModal from './(modal-partials)/NotesModal';
import ConfirmModal from '@/common/components/confirm-modal/ConfirmModal';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';
import { fetchDbApi } from '@/serverActions';
import { selectUser } from '@/store/slices/user';
import { setAddToast } from '@/store/slices/toast';
import { LumError } from '@/utilities/models/LumError';
import { useRouter } from 'next/navigation';
import TableCellContentEditable from '@/common/components/table-cell-content-editable/TableCellContentEditable';
interface Props {
   modalOpen: boolean;
   setModalOpen: (bool: boolean) => void;
}

const defaultNote = { notifications: [], content: null, pinned: false };
const Notes = ({ modalOpen, setModalOpen }: Props) => {
   const user = useAppSelector(selectUser);
   const router = useRouter();
   const dispatch = useAppDispatch();
   const { order } = useAppSelector(selectPageContext);
   const [noteConfig, setNoteConfig] = useState<any>(defaultNote);
   const [notesOnOrder, setNotesOnOrder] = useState<Array<any>>([]);
   const [isDeleting, setIsDeleting] = useState<boolean>(false);
   const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
   const [noteToDelete, setNoteToDelete] = useState<any>();

   useEffect(() => {
      // whenever all notes change, refilter the two types of tasks
      let tempNotesOnOrder = [...order?.notesOnOrder].map((noteOnOrder: any) => {
         noteOnOrder['actionsConfig'] = { edit: true, delete: true };
         noteOnOrder['noteType'] = { name: noteOnOrder?.orderId ? 'Work Order' : 'Lead Record' };
         // noteOnOrder['formattedContent'] = convertDbStringToInnerHtml(noteOnOrder?.content);
         return noteOnOrder;
      });

      setNotesOnOrder(tempNotesOnOrder);
   }, [order?.notesOnOrder]);

   const handleDeleteNoteOnOrder = (noteToDelete: any) => {
      setIsDeleting(true);

      fetchDbApi(`/api/v2/notes/${noteToDelete?.id}`, {
         method: 'DELETE',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      })
         .then((res: any) => {
            if (!res?.errors?.length) {
               // remove the note from the global state array
               const tempNotesOnOrder = [...order?.notesOnOrder].filter(
                  (noteOnOrder: any) => noteOnOrder?.id !== noteToDelete?.id
               );
               dispatch(setPageContext({ order: { ...order, notesOnOrder: tempNotesOnOrder } }));

               setTimeout(() => {
                  setIsDeleting(false);
                  setConfirmModalOpen(false);
                  dispatch(
                     setAddToast({
                        details: [{ label: 'Success', text: 'Note Deleted!' }],
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
            setIsDeleting(false);
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
      if (!modalOpen) setNoteConfig(defaultNote);
   }, [modalOpen]);

   const handleActionClick = ({ actionKey, item }: any) => {
      switch (actionKey) {
         case 'edit':
            setNoteConfig(item);
            setModalOpen(true);
            break;
         default:
            setNoteToDelete(item);
            setConfirmModalOpen(true);
            break;
      }
   };

   return (
      <>
         <Table
            data={notesOnOrder}
            theme='secondary'
            emptyStateDisplayText='No Notes'
            actions={[
               { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Note', callback: handleActionClick },
               { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Note', callback: handleActionClick },
            ]}
            columns={[
               {
                  keyPath: [''],
                  title: 'Note',
                  colSpan: 3,
                  ellipsis: true,
                  render: ({ item }: any) => <TableCellContentEditable content={item?.content} />,
               },
               {
                  keyPath: ['createdBy', 'fullName'],
                  title: 'Created By',
                  colSpan: 1,
                  ellipsis: true,
               },
               {
                  keyPath: ['noteType', 'name'],
                  title: 'Type of Note',
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

         <NotesModal modalOpen={modalOpen} setModalOpen={setModalOpen} initValues={noteConfig || {}} />
         <ConfirmModal
            open={confirmModalOpen}
            handleOnClose={(e: any) => setConfirmModalOpen(false)}
            handleOnConfirm={(e: any) => {
               handleDeleteNoteOnOrder(noteToDelete);
            }}
            value={'note'}
         />
         <LoadingBackdrop isOpen={isDeleting} zIndex={102} />
      </>
   );
};

export default Notes;
