import { revalidate } from '@/serverActions';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../../../../../common/components/button/Button';
import DropDown from '../../../../../../common/components/drop-down/DropDown';
import Grid from '../../../../../../common/components/grid/Grid';
import Icon from '../../../../../../common/components/Icon';
import Modal from '../../../../../../common/components/modal/Modal';
import useToaster from '../../../../../../common/hooks/useToaster';
import { getObjectProp } from '../../../../../../utilities/helpers';
import ReputationBadge from './ReputationBadge';

type Props = {
   showModal: boolean;
   setShowModal: (value: boolean) => void;
   phoneNumberToEdit: any;
   phoneNumberTypes: Array<any>;
   users: Array<any>;
   leadSources: Array<any>;
};

const EditNumberModal = ({
   showModal,
   setShowModal,
   phoneNumberToEdit,
   phoneNumberTypes,
   users,
   leadSources,
}: Props) => {
   const user = useAppSelector(selectUser);
   const router = useRouter();
   const makeToast = useToaster();

   const [disableSave, setDisableSave] = useState<boolean>(true);
   const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState<boolean>(false);
   const [showConfirmLeadSourceModal, setShowConfirmLeadSourceModal] = useState<boolean>(false);
   const [phoneNumber, setPhoneNumber] = useState<any>();

   useEffect(() => {
      const phoneNumberType = getObjectProp(phoneNumber, ['type', 'name']);
      phoneNumberType;
      switch (phoneNumberType) {
         case 'Unassigned':
         case 'Local Presence':
            setDisableSave(false);
            break;
         case 'Lead Source':
            setDisableSave(!getObjectProp(phoneNumber, ['leadSourcesOnPhoneNumber', 0, 'leadSource', 'id']));
            break;
         case 'User':
            setDisableSave(!getObjectProp(phoneNumber, ['usersOnPhoneNumber', 0, 'user', 'id']));
            break;
      }
   }, [phoneNumber]);

   useEffect(() => {
      if (!showModal) return;
      setPhoneNumber(phoneNumberToEdit);
   }, [phoneNumberToEdit, showModal]);

   const handleArchivePhoneNumber = async (phoneNumberToRemoveId: string) => {
      fetch(`/api/v2/phone-numbers/archive/${phoneNumberToRemoveId}`, {
         method: 'GET',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user?.token}` },
      })
         .then(async () => {
            makeToast(true, 'Number Was Deleted');
            setShowConfirmDeleteModal(false);
            setShowModal(false);
            await revalidate({ path: '/admin/all-numbers' });
            router.refresh();
         })
         .catch((err) => {
            console.log('err:', err);
            makeToast(false, 'Number Was Not Deleted');
         });
   };

   const handleSavePhoneNumber = (number: any) => {
      fetch(`/api/v2/phone-numbers/${number?.id}`, {
         method: 'PUT',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user?.token}` },
         body: JSON.stringify({
            prevState: phoneNumberToEdit,
            newState: number,
         }),
      })
         .then(async () => {
            makeToast(true, 'Number Was Updated');
            setShowModal(false);
            await revalidate({ path: '/admin/all-numbers' });
            router.refresh();
         })
         .catch((err) => {
            console.log('err:', err);
            makeToast(false, 'Number Was Not Updated');
         });
   };

   return (
      <>
         <Modal
            title='Configure Phone Number'
            isOpen={showModal}
            primaryButtonText='Save'
            primaryButtonCallback={() => {
               const phoneNumberType = getObjectProp(phoneNumber, ['type', 'name']);
               if (phoneNumberType === 'Lead Source') {
                  setShowConfirmLeadSourceModal(true);
               } else {
                  handleSavePhoneNumber(phoneNumber);
               }
            }}
            disablePrimaryButton={disableSave}
            secondaryButtonText='Cancel'
            customFooter={
               <div className='flex justify-end'>
                  <Button
                     iconName='TrashCan'
                     iconColor='red'
                     color='light'
                     onClick={() => setShowConfirmDeleteModal(true)}>
                     Delete
                  </Button>
               </div>
            }
            onClose={() => {
               setPhoneNumber({});
               setShowModal(false);
            }}>
            <Grid columnCount={2}>
               <Grid rowGap={0}>
                  <span className='text-[12px] text-lum-gray-700 dark:text-lum-gray-300'>Phone Number</span>
                  <span className='text-[16px] leading-[20px] truncate text-lum-gray-700 dark:text-lum-white'>
                     {phoneNumber?.prettyNumber}
                  </span>
               </Grid>
               <Grid rowGap={0}>
                  <span className='text-[12px] text-lum-gray-700 dark:text-lum-gray-300'>Reputation</span>
                  <span className='text-[16px] leading-[20px] truncate text-lum-gray-700 dark:text-lum-white'>
                     <ReputationBadge score={getObjectProp(phoneNumber, ['reputation', 0, 'score'])} />
                  </span>
               </Grid>
               <DropDown
                  label='Assign Type'
                  selectedValues={!!getObjectProp(phoneNumber, ['type']) ? [phoneNumber?.type] : []}
                  keyPath={['name']}
                  options={phoneNumberTypes}
                  onOptionSelect={(e: any, arg: any) => {
                     setPhoneNumber((prevState: any) => {
                        return {
                           ...prevState,
                           type: { ...arg },
                        };
                     });
                  }}
               />
               {phoneNumber?.type?.name === 'User' && (
                  <DropDown
                     label='User'
                     placeholder='Assign a User...'
                     selectedValues={
                        !!getObjectProp(phoneNumber, ['usersOnPhoneNumber', 0, 'user'])
                           ? [phoneNumber?.usersOnPhoneNumber[0].user]
                           : []
                     }
                     keyPath={['fullName']}
                     options={users}
                     onOptionSelect={(e: any, arg: any) => {
                        setPhoneNumber((prevState: any) => {
                           return {
                              ...prevState,
                              usersOnPhoneNumber: [{ user: { ...arg } }],
                           };
                        });
                     }}
                     searchable
                  />
               )}
               {phoneNumber?.type?.name === 'Lead Source' && (
                  <DropDown
                     label='Lead Source'
                     placeholder='Assign a Lead Source...'
                     selectedValues={
                        !!getObjectProp(phoneNumber, ['leadSourcesOnPhoneNumber', 0, 'leadSource'])
                           ? [phoneNumber?.leadSourcesOnPhoneNumber[0].leadSource]
                           : []
                     }
                     keyPath={['name']}
                     options={leadSources}
                     onOptionSelect={(e: any, arg: any) => {
                        setPhoneNumber((prevState: any) => {
                           return {
                              ...prevState,
                              leadSourcesOnPhoneNumber: [{ leadSource: { ...arg } }],
                           };
                        });
                     }}
                     searchable
                  />
               )}
            </Grid>
         </Modal>
         <Modal
            isOpen={showConfirmDeleteModal}
            onClose={() => setShowConfirmDeleteModal(false)}
            size='small'
            title={'Delete Number'}
            zIndex={901}
            primaryButtonText={'Delete'}
            secondaryButtonText={'Cancel'}
            primaryButtonCallback={(e: any) => {
               handleArchivePhoneNumber(phoneNumber?.id);
            }}
            primaryButtonColor={'red'}>
            <div>Are you sure you want to DELETE phone number: {`"${phoneNumber?.prettyNumber}"`}?</div>
         </Modal>
         <Modal
            isOpen={showConfirmLeadSourceModal}
            onClose={() => setShowConfirmLeadSourceModal(false)}
            size='small'
            title={'Confirmation'}
            zIndex={901}
            primaryButtonText={'Confirm'}
            secondaryButtonText={'Cancel'}
            primaryButtonCallback={(e: any) => {
               handleSavePhoneNumber(phoneNumber);
               setShowConfirmLeadSourceModal(false);
            }}>
            <div>
               <div className='flex justify-center mb-[25px]'>
                  <Icon name={'Warning'} color='yellow' width={60} />
               </div>
               <p>
                  Once a phone number is assigned to a lead source, it cannot be
                  <br />
                  reassigned.
               </p>
               <br />
               <p>
                  Are you sure you want to assign this phone number, {`"${phoneNumber?.prettyNumber}"`}, to lead source{' '}
                  {`"${getObjectProp(phoneNumber, ['leadSourcesOnPhoneNumber', 0, 'leadSource', 'name'])}"`}?
               </p>
            </div>
         </Modal>
      </>
   );
};

export default EditNumberModal;
