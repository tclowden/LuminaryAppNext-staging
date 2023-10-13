'use client';
import useMessageInput from '@/features/hooks/useMessageInput';
import { fetchDbApi } from '@/serverActions';
import { selectLeadSmsLogs, setLeadSmsLogs } from '@/store/slices/smsLogs';
import { getObjectProp } from '@/utilities/helpers';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Board from '../../../../../common/components/board/Board';
import LeadDetailCard from '../../../../../common/components/board/boardCards/LeadDetailCard';
import { ColumnType } from '../../../../../common/components/board/boardTypes';
import Button from '../../../../../common/components/button/Button';
import ConfirmModal from '../../../../../common/components/confirm-modal/ConfirmModal';
import Grid from '../../../../../common/components/grid/Grid';
import Hr from '../../../../../common/components/hr/Hr';
import { AddressDetails } from '../../../../../common/components/input-address/InputAddress';
import Modal from '../../../../../common/components/modal/Modal';
import Tabs from '../../../../../common/components/tabs/Tabs';
import defaultImageSrc from '../../../../../public/assets/images/profile.jpg';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import { selectUser } from '../../../../../store/slices/user';
import Map from './(board-modal-partials)/Map';
import Notes from './(board-modal-partials)/Notes';
import TextHistory from './(board-modal-partials)/TextHistory';
import ContentEditable from '@/common/components/content-editable/ContentEditable';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';

const tabs = [
   { name: 'Notes', iconName: 'Notes' },
   { name: 'Text History', iconName: 'MessageBubbleLines' },
   { name: 'Map', iconName: 'MapPin' },
];

interface Props {
   usersPipe: Array<any>;
}

const defaultNote = { content: null, notifications: [], pinned: false };
const BoardView = ({ usersPipe }: Props) => {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const smsLogsByLeadIdObject = useAppSelector(selectLeadSmsLogs);

   const [activeNavIndex, setActiveNavIndex] = useState<number>(0);

   const [boardData, setBoardData] = useState<Array<ColumnType>>([]);

   const [modalLeadData, setModalLeadData] = useState<any>();
   const [showLeadModal, setShowLeadModal] = useState<boolean>(false);

   const [isLoadingSmsLogs, setIsLoadingSmsLogs] = useState<boolean>(false);

   const [note, setNote] = useState<any>(defaultNote);
   const [isSaving, setIsSaving] = useState<boolean>(false);

   const [openVerifyAddressModal, setOpenVerifyAddressModal] = useState<boolean>(false);

   useEffect(() => {
      // get the columns
      const uniqueStatuses: any = Array.from(new Set([...usersPipe]?.map((lead: any) => lead.status?.name))).map(
         (statusName: string) => {
            const statusLeads = [...usersPipe].filter((lead: any) => lead?.status?.name === statusName);
            return {
               title: statusName,
               textCenter: true,
               items: statusLeads,
               colSpan: 1,
               render: ({ item, column, callback }: any) => {
                  return <LeadDetailCard item={item} callback={callback} />;
               },
            };
         }
      );
      setBoardData(uniqueStatuses);
   }, []);

   const handleSaveNote = (updatedNote: any) => {
      setIsSaving(true);
      const dataToSave = { ...updatedNote };

      if (!!dataToSave?.notifications?.length) {
         dataToSave['notifications'] = dataToSave?.notifications.map((noti: any) => {
            delete noti['taggedUser'];
            delete noti['notificationType'];
            return noti;
         });
      }

      // add data to the object
      dataToSave['leadId'] = modalLeadData?.id;
      dataToSave['createdById'] = user?.id;

      fetchDbApi(`/api/v2/notes`, {
         method: 'POST',
         body: JSON.stringify(dataToSave),
      })
         .then((result: any) => {
            setBoardData((prevState: Array<ColumnType>) => {
               const newBoardData = [...prevState].map((status: any) => {
                  const foundLeadIndex = status?.items?.findIndex((lead: any) => lead?.id === result?.leadId);
                  if (foundLeadIndex !== -1) {
                     const newNotes = [...status.items[foundLeadIndex]?.notes, result];
                     status.items[foundLeadIndex].notes = newNotes;
                  }
                  return status;
               });
               return newBoardData;
            });
            setTimeout(() => {
               setIsSaving(false);
               setNote(defaultNote);
               dispatch(
                  setAddToast({
                     iconName: 'CheckMarkCircle',
                     details: [{ label: 'Success', text: 'Note Added!' }],
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
         })
         .catch((err: any) => {
            console.log('err saving note...:', err);
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

   const handleSaveSms = () => {};

   const handleVerifyAddress = async () => {
      try {
         const dataToSave = {
            state: modalLeadData?.state,
            city: modalLeadData?.city,
            zipCode: modalLeadData?.zipCode,
            streetAddress: modalLeadData?.streetAddress,
            latitude: modalLeadData?.latitude,
            longitude: modalLeadData?.longitude,
            addressVerified: true,
         };
         fetchDbApi(`/api/v2/leads/${modalLeadData?.id}/address`, {
            method: 'PUT',
            body: JSON.stringify(dataToSave),
         })
            .then((result) => {
               setModalLeadData((prevState: any) => ({
                  ...prevState,
                  ...result,
               }));
               setBoardData((prevState: Array<any>) => {
                  const newBoardData = [...prevState].map((status: any) => {
                     const foundLeadIndex = status?.items?.findIndex((lead: any) => lead?.id === result?.id);
                     console.log('foundLeadIndex:', foundLeadIndex);
                     if (foundLeadIndex !== -1) {
                        console.log('status.items[foundLeadIndex]:', status.items[foundLeadIndex]);

                        const newLeadData = { ...status.items[foundLeadIndex], ...result };
                        status.items[foundLeadIndex] = newLeadData;
                     }
                     return status;
                  });
                  return newBoardData;
               });
               setOpenVerifyAddressModal(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Lead address verified!' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            })
            .catch((err: any) => {
               console.log('status is not okay...', err);
            });
      } catch (err) {
         console.log('err verifying address...:', err);
      }
   };

   const handleNotificationChange = (tagged: Array<any>) => {
      if (!tagged?.length) return;

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
      setNote((prevState: any) => ({
         ...prevState,
         notifications: tempNotifications,
      }));
   };

   const handleSaveNoteOrSmsOrVerifyAddress = async (e: any, type: 'note' | 'sms' | 'verify-address' | null) => {
      switch (type) {
         case 'note':
            handleSaveNote(note);
            break;
         case 'sms':
            handleSendMessage();
            break;
         case 'verify-address':
            setOpenVerifyAddressModal(true);
            break;
         default:
            console.log('type must be null... type:', type);
            break;
      }
   };

   const handleLeadBtnClick = (e: any, action: 'message' | 'call' | 'lead-record') => {
      switch (action) {
         case 'message':
            console.log('message lead');
            setActiveNavIndex(1);
            break;
         case 'call':
            console.log('call lead');
            break;
         case 'lead-record':
            if (modalLeadData?.id) router.push(`/marketing/leads/${modalLeadData?.id}`);
            break;
         default:
            break;
      }
   };

   const getSmsLogs = async (leadId: string) => {
      if (!leadId) return;

      const leadSmsLogs = smsLogsByLeadIdObject[leadId];
      if (!leadSmsLogs?.length) {
         setIsLoadingSmsLogs(true);
         const smsLogsResult = await fetchDbApi(`/api/v2/leads/${leadId}/sms-logs`).catch((err: any) => {
            console.log('getSmsLogs -> Error:', err);
            setIsLoadingSmsLogs(false);
         });
         setIsLoadingSmsLogs(false);
         dispatch(setLeadSmsLogs({ leadId, smsLogs: smsLogsResult }));
      }
   };

   // FORMATTERS / BOOLEANS

   let type: 'sms' | 'note' | 'verify-address' | null = null;
   if (tabs[activeNavIndex].name === 'Notes') type = 'note';
   else if (tabs[activeNavIndex].name === 'Text History') type = 'sms';
   else if (tabs[activeNavIndex].name === 'Map') type = 'verify-address';

   const textAreaPlaceholder =
      tabs[activeNavIndex].name === 'Notes'
         ? 'Leave a comment or post an update'
         : tabs[activeNavIndex].name === 'Text History'
         ? 'Send sms message'
         : '';

   const btnText =
      tabs[activeNavIndex].name === 'Notes'
         ? 'Save Note'
         : tabs[activeNavIndex].name === 'Text History'
         ? 'Send SMS'
         : tabs[activeNavIndex].name === 'Map'
         ? 'Verify Address'
         : '';

   const { MessageInput, handleSendMessage } = useMessageInput({
      leadId: modalLeadData?.id,
      toNumber: modalLeadData?.phoneNumber,
      userId: `${user?.id}`,
      fromNumber: getObjectProp(user, ['phoneNumbers', 0, 'phoneNumber', 'number']),
      disabled: !modalLeadData?.id,
   });

   return (
      <>
         <Grid>
            <Board
               onCellEvent={({ item }: any) => {
                  getSmsLogs(item?.id);
                  setModalLeadData(item);
                  setShowLeadModal(true);
               }}
               columns={boardData}
               columnHeight={780}
               boardMinWidth={760}
            />
            <Modal
               zIndex={90}
               isOpen={showLeadModal}
               onClose={(e: any) => {
                  setModalLeadData({});
                  setNote(defaultNote);
                  setShowLeadModal(false);
                  setActiveNavIndex(0);
               }}
               primaryButtonText={btnText}
               primaryButtonCallback={(e: any) => {
                  handleSaveNoteOrSmsOrVerifyAddress(e, type);
               }}
               customHeader={<LeadModalHeader modalData={modalLeadData} handleLeadBtnClick={handleLeadBtnClick} />}>
               <Grid>
                  {/* Lead Deatils */}
                  <Grid columnCount={2} columnMinWidth={`250px`} responsive className='bg-transparent'>
                     <div className='flex flex-col'>
                        <span className='text-[10px] text-lum-gray-450'>Lead Source</span>
                        <span className='text-[14px] text-lum-gray-700 dark:text-lum-white'>
                           {modalLeadData?.leadSource?.name || 'N/A'}
                        </span>
                     </div>
                     <div className='flex flex-col'>
                        <span className='text-[10px] text-lum-gray-450'>Status</span>
                        <span className='text-[14px] text-lum-gray-700 dark:text-lum-white'>
                           {modalLeadData?.status?.name || 'N/A'}
                        </span>
                     </div>
                     <div className='flex flex-col'>
                        <span className='text-[10px] text-lum-gray-450'>Last Called</span>
                        <span className='text-[14px] text-lum-gray-700 dark:text-lum-white'>
                           {modalLeadData?.lastCalled || 'N/A'}
                        </span>
                     </div>
                     <div className='flex flex-col'>
                        <span className='text-[10px] text-lum-gray-450'>Appointment Scheduled</span>
                        <span className='text-[14px] text-lum-gray-700 dark:text-lum-white'>
                           {modalLeadData?.appointmentScheduled || 'N/A'}
                        </span>
                     </div>
                  </Grid>

                  <Hr className='my-4' />
                  {/* Navigation */}
                  <Grid className=''>
                     <Tabs
                        tabs={tabs}
                        activeTabIndex={activeNavIndex}
                        setActiveTabIndex={setActiveNavIndex}
                        theme='secondary'
                     />
                     <Grid>
                        <Notes show={tabs[activeNavIndex].name === 'Notes'} leadData={modalLeadData} />
                        <TextHistory
                           show={tabs[activeNavIndex].name === 'Text History'}
                           leadId={modalLeadData?.id}
                           isLoading={isLoadingSmsLogs}
                        />
                        <Map
                           show={tabs[activeNavIndex].name === 'Map'}
                           addressDetails={{
                              state: modalLeadData?.state,
                              city: modalLeadData?.city,
                              zipCode: modalLeadData?.zipCode,
                              // streetAddress: `${modalLeadData?.streetAddress}, ${modalLeadData?.city}, ${modalLeadData?.state}`, // issue right now... modalLeadData.streetAddress needs the city and state next to it
                              streetAddress: modalLeadData?.streetAddress, // issue right now... modalLeadData.streetAddress needs the city and state next to it
                              latLng: { lat: modalLeadData?.latitude, lng: modalLeadData?.longitude },
                              addressVerified: modalLeadData?.addressVerified ?? false,
                           }}
                           setAddressDetails={(addressDetails: AddressDetails | undefined) => {
                              if (addressDetails) {
                                 setModalLeadData((prevState: any) => ({
                                    ...prevState,
                                    state: addressDetails?.state,
                                    city: addressDetails?.city,
                                    zipCode: addressDetails?.zipCode,
                                    streetAddress: addressDetails?.streetAddress,
                                    latitude: addressDetails?.latLng?.lat,
                                    longitude: addressDetails?.latLng?.lng,
                                    addressVerified: addressDetails?.addressVerified,
                                 }));
                              }
                           }}
                        />
                     </Grid>
                     {/* Text area */}
                     {tabs[activeNavIndex].name === 'Notes' ? (
                        <ContentEditable
                           onBlur={(e: any) => {
                              console.log('blur....:');
                           }}
                           hardReset={!note?.content}
                           placeholder={textAreaPlaceholder}
                           onChange={(e: any, { dbFormattedString, searchInput, tagged, newTermSelected }: any) => {
                              if (newTermSelected) handleNotificationChange(tagged);
                              setNote((prevState: any) => ({ ...prevState, content: dbFormattedString }));
                           }}
                           onPillClick={(e: any, pillClicked: any) => {
                              console.log('pill clicked', pillClicked);
                           }}
                           defaultText={note?.content || ''}
                           defaultTagged={note?.notifications || []}
                           tablesToQueryFrom={['users', 'teams']}
                        />
                     ) : tabs[activeNavIndex].name === 'Text History' ? (
                        MessageInput
                     ) : null}
                  </Grid>
               </Grid>
            </Modal>
         </Grid>
         <ConfirmModal
            handleOnClose={(e: any) => {
               setOpenVerifyAddressModal(false);
            }}
            handleOnConfirm={(e: any) => {
               handleVerifyAddress();
            }}
            open={openVerifyAddressModal}
            confirmationText={`Are you sure you want to verify the address?`}
         />
         <LoadingBackdrop isOpen={isSaving} zIndex={102} />
      </>
   );
};

export default BoardView;

interface LeadModalProps {
   handleLeadBtnClick: (e: any, action: 'message' | 'call' | 'lead-record') => void;
   modalData: any;
}
const LeadModalHeader = ({ handleLeadBtnClick, modalData }: LeadModalProps) => {
   return (
      <div className='flex flex-row items-center justify-between w-full'>
         <div className='flex flex-row items-center gap-x-2'>
            <div className='relative py-3 px-1 w-[42px] h-[42px]'>
               <Image
                  className='rounded-full cursor-pointer'
                  src={modalData?.profileUrl || defaultImageSrc}
                  alt='Profile Image'
                  fill
               />
            </div>
            <div className='text-[22px] text-lum-gray-700 dark:text-lum-white'>{modalData?.fullName || 'N/A'}</div>
         </div>
         <div className='flex flex-row items-center gap-x-2'>
            <Button
               iconName='CustomerInfo'
               iconColor='white'
               tooltipContent={'Go To Lead Record'}
               color='gray'
               size='md'
               onClick={(e: any) => {
                  handleLeadBtnClick(e, 'lead-record');
               }}>
               {/* Lead Record */}
            </Button>
            <Button
               iconName='PhoneAngled'
               iconColor='white'
               tooltipContent={'Call Lead'}
               color='green'
               size='md'
               onClick={(e: any) => {
                  handleLeadBtnClick(e, 'call');
               }}
            />
            <Button
               iconName='MessageBubble'
               iconColor='white'
               tooltipContent={'Message Lead'}
               color='blue'
               size='md'
               onClick={(e: any) => {
                  handleLeadBtnClick(e, 'message');
               }}
            />
         </div>
      </div>
   );
};
