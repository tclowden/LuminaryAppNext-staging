import Link from 'next/link';
import { useEffect, useState } from 'react';
import DropDown from '../../../../../../common/components/drop-down/DropDown';
import Grid from '../../../../../../common/components/grid/Grid';
import LoadingBackdrop from '../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import Modal from '../../../../../../common/components/modal/Modal';
import Panel from '../../../../../../common/components/panel/Panel';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { selectPageContext, setPageContext } from '../../../../../../store/slices/pageContext';
import { setAddToast } from '../../../../../../store/slices/toast';
import LeadStatusModal from './LeadStatusModal';
import { fetchDbApi } from '@/serverActions';
import { Status } from '../../types';

type Props = {};

const CustomerProfile = ({}: Props) => {
   const dispatch = useAppDispatch();

   const contextData = useAppSelector(selectPageContext);
   const { lead } = contextData;

   const [isSaving, setIsSaving] = useState<boolean>(false);

   const [showLeadStatusModal, setShowLeadStatusModal] = useState<boolean>(false);

   const [selectableUserData, setSelectableUserData] = useState<any[]>([]);

   const [showSetterSelectModal, setShowSetterSelectModal] = useState<boolean>(false);
   const [setter, setSetter] = useState<any>();

   const [showAgentSelectModal, setShowAgentSelectModal] = useState<boolean>(false);
   const [agent, setAgent] = useState<any>();

   const [currentLeadStatus, setCurrentLeadStatus] = useState<Status>(lead.status);

   useEffect(() => {
      if (!!showSetterSelectModal || !!showAgentSelectModal) {
         fetchDbApi(`/api/v2/users`, {
            method: 'GET',
         })
            .then((results) => {
               setSelectableUserData([...results]);
            })
            .catch((err) => {
               console.error('err:', err);
            });
      }
   }, [showSetterSelectModal, showAgentSelectModal]);

   const options = [
      {
         text: 'Update Lead Status',
         callback: (e: any) => setShowLeadStatusModal(true),
      },
      {
         text: 'Change Agent',
         callback: (e: any) => setShowAgentSelectModal(true),
      },
      {
         text: 'Change Setter',
         callback: (e: any) => setShowSetterSelectModal(true),
      },
      // {
      //    text: 'Convert to Commercial',
      //    callback: (e: any) => console.log('Convert to Commercial'),
      // },
      // {
      //    text: 'Sync to Ops',
      //    callback: (e: any) => console.log('Sync to Ops'),
      // },
      // {
      //    text: 'Create NetSuite Customer',
      //    callback: (e: any) => console.log('Create NetSuite Customer'),
      // },
   ];

   const handleAddSetter = () => {
      setIsSaving(true);
      fetchDbApi(`/api/v2/leads/${lead.id}`, {
         method: 'PUT',
         body: JSON.stringify({
            setterAgentId: setter?.id,
         }),
      })
         .then((result) => {
            dispatch(
               setPageContext({
                  ...contextData,
                  lead: {
                     ...lead,
                     setterAgent: result?.setterAgent,
                  },
               })
            );
            setShowSetterSelectModal(false);
            setIsSaving(false);
            dispatch(
               setAddToast({
                  iconName: 'CheckMarkCircle',
                  details: [{ label: 'Success', text: 'Setter Was Updated' }],
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
         })
         .catch((err) => {
            console.error('err:', err);
            setIsSaving(false);
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: 'Setter Was Not Updated' }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const handleAddAgent = () => {
      setIsSaving(true);
      fetchDbApi(`/api/v2/leads/${lead.id}`, {
         method: 'PUT',
         body: JSON.stringify({
            ownerId: agent?.id,
         }),
      })
         .then((result) => {
            dispatch(
               setPageContext({
                  ...contextData,
                  lead: {
                     ...lead,
                     owner: result?.owner,
                  },
               })
            );
            setShowAgentSelectModal(false);
            setIsSaving(false);
            dispatch(
               setAddToast({
                  iconName: 'CheckMarkCircle',
                  details: [{ label: 'Success', text: 'Owner Was Updated' }],
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
         })
         .catch((err) => {
            console.error('err:', err);
            setIsSaving(false);
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: 'Owner Was Not Updated' }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const handleLeadStatusUpdate = (status: any) => {
      setCurrentLeadStatus(status);
   };

   return (
      <>
         <Panel
            title={lead?.fullName || 'N/A'}
            titleSize={'lg'}
            titleImageSource={'/assets/images/profile.jpg'}
            options={options}>
            <Grid columnCount={4} rowGap={20}>
               <Grid rowGap={0}>
                  <span className='text-[10px] uppercase font-semibold text-lum-gray-450 dark:text-lum-gray-300 '>
                     Lead Source
                  </span>
                  <span className='text-[16px] leading-[20px] truncate text-lum-gray-700 dark:text-lum-white'>
                     {lead?.leadSource?.name || <NA />}
                  </span>
               </Grid>
               <Grid rowGap={0}>
                  <span className='text-[10px] uppercase font-semibold text-lum-gray-450 dark:text-lum-gray-300 '>
                     Phone Number
                  </span>
                  <span className='text-[16px] leading-[20px] truncate text-lum-gray-700 dark:text-lum-white'>
                     {lead?.phoneNumberPretty || <NA />}
                  </span>
               </Grid>
               <Grid rowGap={0}>
                  <span className='text-[10px] uppercase font-semibold text-lum-gray-450 dark:text-lum-gray-300 '>
                     Status
                  </span>
                  <span className='text-[16px] leading-[20px] truncate text-lum-gray-700 dark:text-lum-white'>
                     {currentLeadStatus?.name || <NA />}
                  </span>
               </Grid>
               <Grid rowGap={0}>
                  <span className='text-[10px] uppercase font-semibold text-lum-gray-450 dark:text-lum-gray-300 '>
                     Agent
                  </span>
                  <span className='text-[16px] leading-[20px] truncate text-lum-gray-700 dark:text-lum-white'>
                     {lead?.owner?.fullName ? (
                        <Link className='text-lum-blue-500 block truncate' href={`/admin/users/${lead?.owner?.id}`}>
                           {lead?.owner?.fullName || <NA />}
                        </Link>
                     ) : (
                        <NA />
                     )}
                  </span>
               </Grid>
               <Grid rowGap={0}>
                  <span className='text-[10px] uppercase font-semibold text-lum-gray-450 dark:text-lum-gray-300 '>
                     Address
                  </span>
                  <span className='text-[16px] leading-[20px] whitespace-pre-line text-lum-gray-700 dark:text-lum-white'>
                     {lead?.fullAddress || <NA />}
                  </span>
               </Grid>
               <Grid rowGap={0}>
                  <span className='text-[10px] uppercase font-semibold text-lum-gray-450 dark:text-lum-gray-300 '>
                     Email
                  </span>
                  <span className='text-[16px] leading-[20px] truncate text-lum-gray-700 dark:text-lum-white'>
                     {lead?.emailAddress || <NA />}
                  </span>
               </Grid>
               <Grid rowGap={0}>
                  <span className='text-[10px] uppercase font-semibold text-lum-gray-450 dark:text-lum-gray-300 '>
                     Setter
                  </span>
                  <span className='text-[16px] leading-[20px] truncate text-lum-gray-700 dark:text-lum-white'>
                     {lead?.setterAgent?.fullName ? (
                        <Link
                           className='text-lum-blue-500 block truncate'
                           href={`/admin/users/${lead?.setterAgent?.id}`}>
                           {lead?.setterAgent?.fullName}
                        </Link>
                     ) : (
                        <NA />
                     )}
                  </span>
               </Grid>
            </Grid>
            {showLeadStatusModal && (
               <LeadStatusModal
                  isOpen={showLeadStatusModal}
                  onClose={() => setShowLeadStatusModal(false)}
                  leadId={lead.id}
                  onLeadStatusUpdate={handleLeadStatusUpdate}
                  currentStatus={currentLeadStatus}
               />
            )}
            <Modal
               title='Select Setter'
               isOpen={showSetterSelectModal}
               closeOnBackdropClick
               onClose={(e: any) => {
                  setSetter({});
                  setShowSetterSelectModal(false);
               }}
               secondaryButtonText='Cancel'
               primaryButtonText='Save'
               disablePrimaryButton={!setter}
               primaryButtonCallback={handleAddSetter}>
               <DropDown
                  label='Setter'
                  placeholder='Select a Setter'
                  selectedValues={setter?.id ? [setter] : []}
                  keyPath={['fullName']}
                  options={!!selectableUserData.length ? selectableUserData : []}
                  onOptionSelect={(e: any, arg: any) => {
                     setSetter(arg);
                  }}
                  searchable
               />
            </Modal>
            <Modal
               title='Select Agent'
               isOpen={showAgentSelectModal}
               closeOnBackdropClick
               onClose={(e: any) => {
                  setAgent({});
                  setShowAgentSelectModal(false);
               }}
               secondaryButtonText='Cancel'
               primaryButtonText='Save'
               disablePrimaryButton={!agent}
               primaryButtonCallback={handleAddAgent}>
               <DropDown
                  label='Agent'
                  placeholder='Select an Agent'
                  selectedValues={agent?.id ? [agent] : []}
                  keyPath={['fullName']}
                  options={!!selectableUserData.length ? selectableUserData : []}
                  onOptionSelect={(e: any, arg: any) => {
                     setAgent(arg);
                  }}
                  searchable
               />
            </Modal>
         </Panel>
         <LoadingBackdrop isOpen={isSaving} />
      </>
   );
};

const NA = () => {
   return <span className='text-lum-gray-300'>N/A</span>;
};

export default CustomerProfile;
