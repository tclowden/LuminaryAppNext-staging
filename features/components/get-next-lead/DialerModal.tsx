'use client';

import { useEffect, useState } from 'react';
import Modal from '@/common/components/modal/Modal';
import { AutoDialingStatus, Lead } from './types';
import { LuminaryColors } from '@/common/types/LuminaryColors';
import LoadingSpinner from '@/common/components/loaders/loading-spinner/LoadingSpinner';
import Table from '@/common/components/table/Table';
import Icon from '@/common/components/Icon';
import { selectUser } from '@/store/slices/user';
import { ColumnType } from '@/common/components/table/tableTypes';
// import socket, { initializeSocket, disconnectSocket, emitEvent } from '../../../store/slices/socket';
import {
   ActiveCall,
   makeOutboundCall,
   selectActiveCall,
   setActiveCallState,
   setLeadOnCall,
} from '../../../store/slices/twilio';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store/store';

const lumGreen: LuminaryColors = 'green';
const gray: LuminaryColors = 'gray';

type Props = {
   leadsData: Lead[];
   isModalOpen: boolean;
   handleOnCloseModal: () => void;
};

//    callStatusDisplayName?: 'Upcoming' | 'Dialing' | 'Left Voicemail' | 'Connected' | 'No Answer';
const columns: ColumnType[] = [
   {
      keyPath: ['callStatusDisplayName'],
      title: 'Call Status',
      render: ({ item }: any) => {
         console.log('item: ', item);
         switch (item.callStatusDisplayName) {
            case 'Upcoming':
               return item.callStatusDisplayName;
               break;
            case 'ringing':
               return (
                  <div className={'flex gap-[10px] items-center'}>
                     <LoadingSpinner isOpen={true} size={25} />
                     {item.callStatusDisplayName}
                  </div>
               );
               break;
            case 'Left Voicemail':
               return (
                  <div className={'flex gap-[10px] items-center'}>
                     <Icon name={'Voicemail'} color='yellow' width={16} height={16} />
                     {item.callStatusDisplayName}
                  </div>
               );
               break;

            case 'in-progress':
               return (
                  <div className={'flex gap-[10px] items-center'}>
                     <Icon name={'PhoneAngled'} color='green' width={16} height={16} />
                     {item.callStatusDisplayName}
                  </div>
               );
               break;

            case 'No Answer':
               return (
                  <span className={'flex gap-[10px]'}>
                     <Icon name={'XMarkCircle'} color='gray' width={16} height={16} />
                     {item.callStatusDisplayName}
                  </span>
               );
               break;
         }
      },
   },
   {
      keyPath: ['name'],
      title: 'Name',
   },
   {
      keyPath: ['phoneNumber'],
      title: 'Phone Number',
   },
];

interface DataType {
   [key: string]: any;
}

const DialerModal = ({ leadsData, isModalOpen, handleOnCloseModal }: Props) => {
   const [leads, setLeads] = useState<Array<Lead>>(leadsData);
   const [modalTitle, setModalTitle] = useState<string>('Begin Dialing');
   const [primaryButtonText, setPrimaryButtonText] = useState<string>('Start Dialing');
   const [titleBackgroundColor, setTitleBackgroundColor] = useState<string | undefined>(undefined);
   const [primaryButtonColor, setPrimaryButtonColor] = useState<LuminaryColors>(lumGreen);
   const [activeLeads, setActiveLeads] = useState<Lead[]>([]);
   const [autoDialingStatus, setAutoDialingStatus] = useState<AutoDialingStatus>(false);
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   // const socketStatus = useAppSelector((state: RootState) => state.socket.status);
   // const socket = useAppSelector(selectSocket);
   const activeCall: ActiveCall = useAppSelector(selectActiveCall);
   // const callProgressEvents = useAppSelector((state: RootState) => state.socket.update);

   // useEffect(() => {
   //    dispatch(initializeSocket(user?.id));
   // }, []);
   // These events are updated in the twilio slice and come from the Twilio Call and Device types
   // useEffect(() => {
   // if (!activeCall?.lead?.id) return;
   //    console.log(callProgressEvents);
   //    // TODO: What is the functionality for completed call? does it get removed from dialer view?
   //    let displayName: string;
   //    switch (callProgressEvents) {
   //       case 'in-progress':
   //          {
   //             displayName = 'Connected';
   //          }
   //          break;
   //       case 'completed':
   //          {
   //             displayName = 'Completed';
   //          }
   //          break;
   //       case 'ringing':
   //          {
   //             displayName = 'ringing';
   //          }
   //          break;
   //    }

   //    setLeads((prevState: Lead[]) => {
   //       const tempState = [...prevState];
   //       const foundLead = tempState.find((fl) => fl.id === activeCall?.lead?.id);
   //       if (!foundLead || !displayName) return prevState;
   //       foundLead.callStatusDisplayName = displayName;
   //       return tempState;
   //    });
   // }, [activeCall.twilioCallStatus, activeCall.twilioCallEventStatus, callProgressEvents]);

   useEffect(() => {
      setLeads([
         {
            id: '045385a9-c3f4-40ec-9d98-725dd24c2249',
            firstName: 'Scooby',
            lastName: 'Doo',
            phoneNumber: '+16236968346',
            callStatusDisplayName: 'Upcoming',
         },
      ]);
   }, [leadsData]);

   const beginAutoDialing = async () => {
      setTitleBackgroundColor('bg-lum-green-500');
      setPrimaryButtonColor(gray);
      setModalTitle('Now Dialing...');
      setPrimaryButtonText('End Auto Dialing');

      await startCalling();
   };

   const endAutoDialing = () => {
      setTitleBackgroundColor(undefined);
      setPrimaryButtonColor(lumGreen);
      setModalTitle('Start Dialing');
      setPrimaryButtonText('Begin Dialing');
   };

   const startCalling = async () => {
      await activeLeads.reduce<Promise<void>>(async (previousPromise, lead) => {
         try {
            await previousPromise;
            return performActionOnLead(lead);
         } catch (error) {
            console.error(`Failed to perform action on lead ${lead.name}: ${error}`);
            return Promise.resolve();
         }
      }, Promise.resolve());
   };

   // This will be the function that handles making calls to twilio
   const performActionOnLead = (lead: Lead) => {
      setLeads((prevState: Lead[]) => {
         const tempState = [...prevState];
         const foundLead = tempState.find((fl) => fl.id === lead.id);
         if (!foundLead) return prevState;
         foundLead.callStatusDisplayName = 'Dialing';
         return tempState;
      });

      return new Promise<void>(async (resolve, reject) => {
         try {
            console.log(`Attempting to Dial ${lead.name}`);
            dispatch(setLeadOnCall({ id: lead.id }));
            dispatch(makeOutboundCall(lead.phoneNumber));

            // setLeads((prevState: any) => {
            //    const tempState = [...prevState];
            //    const foundLead = tempState.find((item) => item.id === lead.id);
            //    if (!foundLead) return prevState;
            //    // foundLead.callStatusDisplayName = 'Left Voicemail';
            //    // foundLead.callStatusDisplayName = 'Connected';
            //    foundLead.callStatusDisplayName = 'No Answer';
            //    return tempState;
            // });
            resolve();
         } catch (error) {
            reject(error);
         }
      });
   };

   const handlePrimaryButtonClick = () => {
      switch (autoDialingStatus) {
         // If we are dialing... stop dialing
         case true:
            {
               endAutoDialing();
               setAutoDialingStatus(false);
            }
            break;
         // If we are not dialing... begin dialing
         case false:
            {
               beginAutoDialing();
               setAutoDialingStatus(true);
            }
            break;
         case 'paused': {
            console.log('Pause auto dial');
         }
      }
   };

   useEffect(() => {
      const updatedLeads: Lead[] = leads.map((lead: Lead) => {
         const callStatusDisplayName = lead.callStatusDisplayName || 'Upcoming';
         let rowColor;
         switch (callStatusDisplayName) {
            case 'Left Voicemail':
               rowColor = 'yellow';
               break;
            case 'Connected':
               rowColor = 'green';
               break;
            default: {
               // console.log('Nothing Matched: ', callStatusDisplayName);
            }
         }
         return {
            ...lead,
            callStatusDisplayName: callStatusDisplayName,
            name: `${lead.firstName} ${lead.lastName}`,
            rowConfig: rowColor ? { color: rowColor, opacity: 10 } : {},
         };
      });
      setActiveLeads(updatedLeads);
   }, [leads]);

   return (
      <Modal
         isOpen={isModalOpen}
         hideCloseButton={true}
         titleBackgroundColor={titleBackgroundColor}
         onClose={handleOnCloseModal}
         primaryButtonColor={primaryButtonColor}
         hidePrimaryCloseButton={true}
         title={modalTitle}
         disablePrimaryButton={false}
         primaryButtonText={primaryButtonText}
         primaryButtonCallback={handlePrimaryButtonClick}>
         {activeLeads.length > 0 && <Table columns={columns} data={activeLeads}></Table>}
         {/* <div>Hello, socket status = {socketStatus}</div> */}
      </Modal>
   );
};

export default DialerModal;
