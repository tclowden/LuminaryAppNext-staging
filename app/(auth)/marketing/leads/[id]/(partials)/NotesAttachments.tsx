import { useEffect, useState } from 'react';
import Button from '../../../../../../common/components/button/Button';
import Table from '../../../../../../common/components/table/Table';
import Panel from '../../../../../../common/components/panel/Panel';
import Grid from '../../../../../../common/components/grid/Grid';
import { selectPageContext, setPageContext } from '../../../../../../store/slices/pageContext';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import TableCellLink from '../../../../../../common/components/table-cell-link/TableCellLink';
import { selectUser } from '../../../../../../store/slices/user';
import Modal from '../../../../../../common/components/modal/Modal';
import { redirect } from 'next/navigation';
import { Attachment, AttachmentData, Note, NoteData } from '../../../../../../common/types/Leads';
import LoadingBackdrop from '../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import { setAddToast } from '../../../../../../store/slices/toast';
import { fetchDbApi } from '@/serverActions';
import NotesModal from './(notes-attachments-partials)/NotesModal';
import TableCellContentEditable from '@/common/components/table-cell-content-editable/TableCellContentEditable';
import { getAttachmentTypes, getAttachments, getNotes } from '../utilities';
import AttachmentsModal from './(notes-attachments-partials)/AttachmentsModal';

const defaultNote = { notifications: [], content: null, pinned: false };
const defaultAttachment = {};
const NotesAttachments = () => {
   const dispatch = useAppDispatch();

   const contextData = useAppSelector(selectPageContext);
   const { lead } = contextData;
   const user = useAppSelector(selectUser);

   const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
   const [initialLoad, setInitialLoad] = useState<boolean>(true);

   const [attachmentNameToDelete, setAttachmentNameToDelete] = useState<any>();
   const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
   const [showAttachmentModal, setShowAttachmentModal] = useState<boolean>(false);
   const [noteConfig, setNoteConfig] = useState<any>(defaultNote);
   const [attachmentConfig, setAttachmentConfig] = useState<any>(defaultAttachment);
   const [tableNotes, setTableNotes] = useState<Array<any>>([]);
   const [tableAttachments, setTableAttachments] = useState<Array<any>>([]);

   useEffect(() => {
      let tempNotesOnLead = [...(!!lead?.notesOnLead?.length ? lead.notesOnLead : [])].map((noteOnLead: any) => {
         noteOnLead['actionsConfig'] = {
            pin: { disable: false, color: noteOnLead['pinned'] ? 'orange' : 'gray:450' },
            edit: true,
         };
         noteOnLead['noteType'] = { name: noteOnLead?.leadId ? 'Lead Record' : 'Work Order' };
         return noteOnLead;
      });

      const handleNoteSort = (notesToSort: Array<NoteData>) => {
         const pinnedNotes: Array<NoteData> = [];
         const remainingNotes: Array<NoteData> = [];

         notesToSort.forEach((note: NoteData) => {
            if (note.pinned) {
               pinnedNotes.push(note);
            } else {
               remainingNotes.push(note);
            }
         });
         pinnedNotes.sort((a: any, b: any) => a.createdAt - b.createdAt);
         remainingNotes.sort((a: any, b: any) => a.createdAt - b.createdAt);
         return pinnedNotes.concat(remainingNotes);
      };

      tempNotesOnLead = handleNoteSort(tempNotesOnLead);
      setTableNotes(tempNotesOnLead);
   }, [lead?.notesOnLead]);

   useEffect(() => {
      let tempNotesOnAttachments = [...(!!lead?.attachmentsOnLead?.length ? lead.attachmentsOnLead : [])].map(
         (attachmentOnLead: any) => {
            attachmentOnLead['actionsConfig'] = { delete: !!(user.id === attachmentOnLead.createdById) };
            return attachmentOnLead;
         }
      );
      setTableAttachments(tempNotesOnAttachments);
   }, [lead?.attachmentsOnLead]);

   useEffect(() => {
      if (!user?.token) return redirect('/login');

      if (initialLoad && !isCollapsed) {
         setInitialLoad(false);
         setIsLoading(true);

         if (!contextData?.attachmentTypes?.length) {
            const fetchAsyncAttachmentTypes = async () => {
               const attachmentTypes = await getAttachmentTypes(user?.token || '');
               dispatch(setPageContext({ attachmentTypes: attachmentTypes }));
            };
            fetchAsyncAttachmentTypes();
         }

         Promise.allSettled([getAttachments(user?.token, lead?.id), getNotes(user?.token, lead?.id)]).then(
            (results: any) => {
               const [attachmentsResult, notesResult] = handleResults(results);
               dispatch(
                  setPageContext({ lead: { ...lead, notesOnLead: notesResult, attachmentsOnLead: attachmentsResult } })
               );
               setIsLoading(false);
            }
         );
      }
   }, [isCollapsed]);

   const handleResults = (results: any) => {
      return results.map((result: any) => {
         if (result.status === 'fulfilled') return result.value;
      });
   };

   useEffect(() => {
      if (!showNoteModal && !!Object.keys(noteConfig)) setNoteConfig(defaultNote);
      if (!showAttachmentModal && !!Object.keys(attachmentConfig)) setAttachmentConfig(defaultAttachment);
   }, [showNoteModal, showAttachmentModal]);

   const handleUpdateNote = (noteToUpdate: any) => {
      setIsSaving(true);
      const dataToSave = { ...noteToUpdate };

      // delete the notifications just so they don't get updated.
      dataToSave['notifications'] = [];

      // delete unnecessry data
      delete dataToSave['actionsConfig'];
      delete dataToSave['createdBy'];
      delete dataToSave['updatedBy'];
      delete dataToSave['createdAtPretty'];
      delete dataToSave['updatedAtPretty'];

      console.log('dataToSave:', dataToSave);

      fetchDbApi(`/api/v2/notes/${dataToSave.id}`, {
         method: 'PUT',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` },
         body: JSON.stringify(dataToSave),
      })
         .then(async (updatedNote: any) => {
            const tempNotesOnLead = await getNotes(user?.token || '', lead?.id);
            dispatch(setPageContext({ lead: { ...lead, notesOnLead: tempNotesOnLead } }));

            setTimeout(() => {
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Note Pinned!' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
               setIsSaving(false);
            }, 500);
         })
         .catch((err) => {
            console.error('err:', err);
            setIsSaving(false);
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: 'Note Was Not Pinned' }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const handleNoteActionClick = ({ event, actionKey, item }: { event: Event; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            setNoteConfig(item);
            setShowNoteModal(true);
            break;
         case 'pin':
            handleUpdateNote({ ...item, pinned: !item?.pinned });
            break;
         default:
            break;
      }
   };

   const handleOpenAttachment = async (item: any) => {
      setIsLoading(true);
      const authedUrl = await fetchDbApi(`/api/v2/attachments/authed-url`, {
         method: 'POST',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` },
         body: JSON.stringify({
            filePath: item.filePath,
         }),
      }).catch((err) => {
         console.error('err:', err);
         dispatch(
            setAddToast({
               iconName: 'XMarkCircle',
               details: [{ label: 'Error', text: 'Could Not Open Attachment' }],
               variant: 'danger',
               autoCloseDelay: 5,
            })
         );
      });

      if (window && authedUrl?.url) window.open(authedUrl.url, '_blank')?.focus();
      setIsLoading(false);
   };

   const handleDeleteAttachment = async () => {
      setIsSaving(true);
      await fetchDbApi(`/api/v2/attachments/${attachmentNameToDelete?.id}`, {
         method: 'DELETE',
         headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
         },
      })
         .then(async () => {
            const filteredAttachments = [...(!!lead?.attachmentsOnLead?.length ? lead.attachmentsOnLead : [])].filter(
               (attachment: any) => attachment.id !== attachmentNameToDelete.id
            );
            dispatch(setPageContext({ lead: { ...lead, attachmentsOnLead: filteredAttachments } }));
            setTimeout(() => {
               setShowConfirmModal(false);
               setIsSaving(false);
               dispatch(
                  setAddToast({
                     iconName: 'CheckMarkCircle',
                     details: [{ label: 'Success', text: 'Attachment Was Deleted' }],
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
         })
         .catch((err) => {
            console.error('err:', err);
            setIsSaving(false);
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: 'Could Not Delete Attachment' }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const confirmDeleteAttachment = ({ item }: { item: any }) => {
      setShowConfirmModal(true);
      setAttachmentNameToDelete(item);
   };

   return (
      <>
         <Panel
            title='Notes & Attachments'
            titleIconName='Paperclip'
            titleIconColor='orange'
            collapsible
            isCollapsed={isCollapsed}
            onCollapseBtnClick={(e: any) => {
               setIsCollapsed((prevState: boolean) => !prevState);
            }}>
            <Grid>
               <Grid>
                  <div className='flex flex-row justify-between items-end'>
                     <span className='pl-[10px] text-[16px] text-lum-gray-700 dark:text-lum-white'>Notes</span>
                     <Button
                        onClick={() => {
                           setShowNoteModal(true);
                        }}
                        size='sm'>
                        New Note
                     </Button>
                  </div>
                  <Table
                     actions={[
                        { icon: 'Pin', actionKey: 'pin', toolTip: 'Pin Note', callback: handleNoteActionClick },
                        { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Note', callback: handleNoteActionClick },
                     ]}
                     columns={[
                        {
                           keyPath: ['content'],
                           title: 'Note',
                           colSpan: 3,
                           ellipsis: false,
                           render: ({ item }: any) => <TableCellContentEditable content={item?.content} />,
                        },
                        {
                           title: 'Created By',
                           colSpan: 1,
                           render: ({ item }) => {
                              return item.createdBy ? (
                                 <TableCellLink path={`/admin/users/${item?.createdBy?.id}`}>
                                    {`${item?.createdBy?.fullName}`}
                                 </TableCellLink>
                              ) : (
                                 <span className='text-lum-gray-300'>N/A</span>
                              );
                           },
                        },
                        { keyPath: ['createdAtPretty'], title: 'Date Created', colSpan: 1 },
                     ]}
                     data={tableNotes || []}
                     theme='secondary'
                     isLoading={isLoading}
                     showEmptyState
                     emptyStateDisplayText='No Notes'
                  />
               </Grid>
               <Grid>
                  <div className='flex flex-row justify-between items-end'>
                     <span className='pl-[10px] text-[16px] text-lum-gray-700 dark:text-lum-white'>Attachments</span>
                     <Button
                        size='sm'
                        onClick={() => {
                           setShowAttachmentModal(true);
                        }}>
                        New Attachment
                     </Button>
                  </div>
                  <Table
                     actions={[
                        {
                           icon: 'TrashCan',
                           actionKey: 'delete',
                           toolTip: 'Delete Attachment',
                           callback: confirmDeleteAttachment,
                        },
                     ]}
                     columns={[
                        {
                           title: 'File',
                           colSpan: 3,
                           render: ({ item }) => {
                              return item.fileName ? (
                                 <span
                                    className='text-lum-blue-500 block truncate cursor-pointer'
                                    onClick={() => handleOpenAttachment(item)}>
                                    {item.fileNickName || item.fileName}
                                 </span>
                              ) : (
                                 <span className='text-lum-gray-300'>N/A</span>
                              );
                           },
                        },
                        {
                           title: 'Created By',
                           colSpan: 1,
                           render: ({ item }) => {
                              return item.createdBy ? (
                                 <TableCellLink path={`/admin/users/${item?.createdBy?.id}`}>
                                    {`${item?.createdBy?.firstName} ${item?.createdBy?.lastName}`}
                                 </TableCellLink>
                              ) : (
                                 <span className='text-lum-gray-300'>N/A</span>
                              );
                           },
                        },
                        { keyPath: ['createdAtPretty'], title: 'Date Created', colSpan: 1 },
                     ]}
                     data={tableAttachments || []}
                     theme='secondary'
                     isLoading={isLoading}
                     showEmptyState
                     emptyStateDisplayText='No Attachments'
                  />
               </Grid>
            </Grid>
         </Panel>
         <NotesModal initValues={noteConfig || {}} modalOpen={showNoteModal} setModalOpen={setShowNoteModal} />
         <AttachmentsModal
            initValues={attachmentConfig || {}}
            modalOpen={showAttachmentModal}
            setModalOpen={setShowAttachmentModal}
         />
         <Modal
            zIndex={100}
            title='Confirmation'
            isOpen={showConfirmModal}
            closeOnBackdropClick
            onClose={(e: any) => {
               setShowConfirmModal(false);
            }}
            secondaryButtonText='Cancel'
            primaryButtonText='Yes, Delete Attachment'
            primaryButtonCallback={handleDeleteAttachment}
            size='small'>
            Are you sure you want to delete attachment: {`"${attachmentNameToDelete?.fileNickName}"`}?
         </Modal>
         <LoadingBackdrop isOpen={isSaving} zIndex={102} />
      </>
   );
};

export default NotesAttachments;
