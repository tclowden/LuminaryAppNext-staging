import { fetchDbApi, revalidate } from '@/serverActions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../../../../../common/components/button/Button';
import DropDown from '../../../../../../common/components/drop-down/DropDown';
import Grid from '../../../../../../common/components/grid/Grid';
import Icon from '../../../../../../common/components/Icon';
import Input from '../../../../../../common/components/input/Input';

import Modal from '../../../../../../common/components/modal/Modal';
import Table from '../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../common/components/table/tableTypes';
import useToaster from '../../../../../../common/hooks/useToaster';
import { getObjectProp } from '../../../../../../utilities/helpers';
import ReputationBadge from './ReputationBadge';

type Props = {
   showModal: boolean;
   setShowModal: (value: boolean) => void;
   phoneNumberTypes: Array<any>;
   users: Array<any>;
   leadSources: Array<any>;
   states: Array<any>;
};

const NewNumberModal = ({ showModal, setShowModal, phoneNumberTypes, users, leadSources, states }: Props) => {
   const router = useRouter();
   const makeToast = useToaster();

   const [selectedState, setSelectedState] = useState<any>({});
   const [areaCode, setAreaCode] = useState<string>('');
   const [prefix, setPrefix] = useState<string>('');
   const [availableNumbers, setAvailableNumbers] = useState<Array<any>>([]);

   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [hasMadeSearch, setHasMadeSearch] = useState<boolean>(false);

   const [disableSave, setDisableSave] = useState<boolean>(true);
   const [phoneNumberToAssign, setPhoneNumberToAssign] = useState<any>({});
   const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
   const [showConfirmLeadSourceModal, setShowConfirmLeadSourceModal] = useState<boolean>(false);

   const UNASSIGNED_TYPE = phoneNumberTypes.find((type) => type.name === 'Unassigned');

   const numberSearchColumns: ColumnType[] = [
      { keyPath: ['friendlyName'], title: 'Number' },
      {
         title: 'Location',
         render: ({ item }) => {
            return `${item?.locality}, ${item?.region} ${item?.postalCode}`.trim();
         },
      },
      {
         title: 'Reputation',
         render: ({ item }) => {
            if (!item.reputation) return <span className='text-lum-gray-300'>N/A</span>;
            return <ReputationBadge score={100 - item.reputation} />;
         },
      },
      {
         title: 'Assign Type',
         render: ({ item }) => {
            if (!item.selected) return;
            return (
               <Grid>
                  <Button
                     color={item?.type?.name === 'Unassigned' ? 'blue' : 'light'}
                     size='sm'
                     onClick={() => {
                        setPhoneNumberToAssign(item);
                        setShowAssignModal(true);
                     }}>
                     {item?.type?.name === 'Unassigned' ? 'Assign Now' : item.type.name}
                  </Button>
               </Grid>
            );
         },
      },
      {
         title: 'Assign To',
         render: ({ item }: { item: any }) => {
            if (!item.selected) return null;
            const itemType = item?.type?.name;
            switch (itemType) {
               case 'User':
                  return item?.user?.fullName;
               case 'Lead Source':
                  return item?.leadSource?.name;
               case 'Unassigned':
                  return <span className='text-lum-gray-300'>Unassigned</span>;
               default:
                  return <span className='text-lum-gray-300'>N/A</span>;
            }
         },
      },
   ];

   useEffect(() => {
      const phoneNumberType = getObjectProp(phoneNumberToAssign, ['type', 'name']);
      phoneNumberType;
      switch (phoneNumberType) {
         case 'Unassigned':
         case 'Local Presence':
            setDisableSave(false);
            break;
         case 'Lead Source':
            setDisableSave(!getObjectProp(phoneNumberToAssign, ['leadSource', 'id']));
            break;
         case 'User':
            setDisableSave(!getObjectProp(phoneNumberToAssign, ['user', 'id']));
            break;
      }
   }, [phoneNumberToAssign]);

   const handleRowsSelect = (e: any, rowsSelected: Array<any>, allRowsChecked?: boolean) => {
      if (rowsSelected.length <= 1) {
         // one row selected
         setAvailableNumbers((prevState: Array<any>) => {
            const tempState = [...prevState];
            const foundAvailableNumber = tempState.find((num) => num.phoneNumber === rowsSelected[0]?.phoneNumber);

            if (!foundAvailableNumber) return tempState;
            foundAvailableNumber.selected = !rowsSelected[0].selected;
            if (!foundAvailableNumber.type) foundAvailableNumber.type = UNASSIGNED_TYPE;
            return tempState;
         });
      } else {
         if (typeof allRowsChecked === undefined) return;
         // every row selected
         setAvailableNumbers((prevState: Array<any>) => {
            return prevState.map((num) => {
               const selectedNumber = { ...num, selected: !allRowsChecked };
               if (!selectedNumber.type) selectedNumber.type = UNASSIGNED_TYPE;
               return selectedNumber;
            });
         });
      }
   };

   const handleAssignNumber = () => {
      setAvailableNumbers((prevState: Array<any>) => {
         const tempState = [...prevState];
         const foundAvailableNumber = tempState.find((num) => num.phoneNumber === phoneNumberToAssign?.phoneNumber);
         if (!foundAvailableNumber) return tempState;

         switch (phoneNumberToAssign?.type?.name) {
            case 'User':
               foundAvailableNumber.type = phoneNumberToAssign.type;
               foundAvailableNumber.user = phoneNumberToAssign.user;
               delete foundAvailableNumber['leadSource'];
               break;
            case 'Lead Source':
               foundAvailableNumber.type = phoneNumberToAssign.type;
               foundAvailableNumber.leadSource = phoneNumberToAssign.leadSource;
               delete foundAvailableNumber['user'];
               break;
            default:
               foundAvailableNumber.type = phoneNumberToAssign.type;
               delete foundAvailableNumber['user'];
               delete foundAvailableNumber['leadSource'];
               break;
         }
         setShowAssignModal(false);
         return tempState;
      });
      setShowAssignModal(false);
   };

   const handleSearchNumbers = () => {
      setIsLoading(true);
      setHasMadeSearch(true);
      setAvailableNumbers([]);
      const queryParams = new URLSearchParams({
         state: selectedState?.abbreviation || '',
         areaCode: areaCode,
         prefix: prefix,
      });

      fetchDbApi(`/api/v2/twilio/phone-numbers/search?${queryParams}`, {
         method: 'GET',
         cache: 'no-store',
      })
         .then((results) => {
            setIsLoading(false);
            setAvailableNumbers(results.map((result: any) => ({ ...result, selected: false })));
         })
         .catch((err) => {
            console.log('err:', err);
            setIsLoading(false);
            makeToast(false, 'Something went wrong');
         });
   };

   const handlePurchaseNumber = () => {
      const selectedAvailableNumbers = availableNumbers.filter((num) => num.selected);
      if (!selectedAvailableNumbers?.length) return;

      fetchDbApi(`/api/v2/twilio/phone-numbers/buy`, {
         method: 'POST',
         body: JSON.stringify({
            phoneNumbers: selectedAvailableNumbers,
         }),
      })
         .then(async () => {
            makeToast(true, 'Purchase Complete');
            await revalidate({ path: '/admin/all-numbers' });
            router.refresh();
            closeNewPhoneNumberModal();
         })
         .catch((err) => {
            console.log('err:', err);
            makeToast(false, 'Purchase Failed');
         });
   };

   const closeNewPhoneNumberModal = () => {
      setShowModal(false);
      setHasMadeSearch(false);
      setSelectedState({});
      setAreaCode('');
      setPrefix('');
      setAvailableNumbers([]);
   };

   return (
      <>
         <Modal
            title='New Phone Number'
            isOpen={showModal}
            primaryButtonText='Save Number(s)'
            primaryButtonCallback={() => {
               handlePurchaseNumber();
            }}
            disablePrimaryButton={!availableNumbers.filter((num) => num.selected).length}
            secondaryButtonText='Cancel'
            onClose={closeNewPhoneNumberModal}
            size='large'>
            <Grid>
               <Grid columnCount={2}>
                  <DropDown
                     label='State'
                     placeholder='Select State'
                     selectedValues={selectedState?.id ? [selectedState] : []}
                     keyPath={['name']}
                     options={states}
                     onOptionSelect={(e: any, arg: any) => {
                        setSelectedState(arg);
                     }}
                     searchable
                  />
                  <div className='flex gap-[10px] items-end'>
                     <Input
                        type='text'
                        label='Area Code'
                        placeholder='479'
                        value={areaCode}
                        onChange={(e) => {
                           setAreaCode(e.target.value);
                        }}
                     />
                     <Input
                        type='text'
                        label='Prefix'
                        placeholder='123'
                        value={prefix}
                        onChange={(e) => {
                           setPrefix(e.target.value);
                        }}
                     />
                     <Button size='md' color='blue' iconName='MagnifyingGlass' onClick={() => handleSearchNumbers()} />
                  </div>
               </Grid>
               <Table
                  theme='secondary'
                  data={availableNumbers}
                  columns={numberSearchColumns}
                  selectableRows
                  selectableRowsKey='selected'
                  allRowsSelectable
                  onRowsSelect={handleRowsSelect}
                  showEmptyState={hasMadeSearch}
                  emptyStateDisplayText='No Results'
                  isLoading={isLoading}
               />
            </Grid>
         </Modal>

         <Modal
            title='Assign Phone Number'
            isOpen={showAssignModal}
            primaryButtonText='Save'
            primaryButtonCallback={() => {
               const phoneNumberType = getObjectProp(phoneNumberToAssign, ['type', 'name']);
               if (phoneNumberType === 'Lead Source') {
                  setShowConfirmLeadSourceModal(true);
               } else {
                  handleAssignNumber();
               }
            }}
            disablePrimaryButton={disableSave}
            secondaryButtonText='Cancel'
            onClose={() => {
               setShowAssignModal(false);
            }}
            size='small'
            zIndex={905}>
            <Grid columnCount={2}>
               <DropDown
                  label='Assign Type'
                  selectedValues={!!getObjectProp(phoneNumberToAssign, ['type']) ? [phoneNumberToAssign?.type] : []}
                  keyPath={['name']}
                  options={phoneNumberTypes}
                  onOptionSelect={(e: any, arg: any) => {
                     setPhoneNumberToAssign((prevState: any) => {
                        return {
                           ...prevState,
                           type: { ...arg },
                        };
                     });
                  }}
               />
               {phoneNumberToAssign?.type?.name === 'User' && (
                  <DropDown
                     label='User'
                     placeholder='Assign a User...'
                     selectedValues={!!getObjectProp(phoneNumberToAssign, ['user']) ? [phoneNumberToAssign?.user] : []}
                     keyPath={['fullName']}
                     options={users}
                     onOptionSelect={(e: any, arg: any) => {
                        setPhoneNumberToAssign((prevState: any) => {
                           return {
                              ...prevState,
                              user: { ...arg },
                           };
                        });
                     }}
                     searchable
                  />
               )}
               {phoneNumberToAssign?.type?.name === 'Lead Source' && (
                  <DropDown
                     label='Lead Source'
                     placeholder='Assign a Lead Source...'
                     selectedValues={
                        !!getObjectProp(phoneNumberToAssign, ['leadSource']) ? [phoneNumberToAssign?.leadSource] : []
                     }
                     keyPath={['name']}
                     options={leadSources}
                     onOptionSelect={(e: any, arg: any) => {
                        setPhoneNumberToAssign((prevState: any) => {
                           return {
                              ...prevState,
                              leadSource: { ...arg },
                           };
                        });
                     }}
                     searchable
                  />
               )}
            </Grid>
         </Modal>
         <Modal
            isOpen={showConfirmLeadSourceModal}
            onClose={() => setShowConfirmLeadSourceModal(false)}
            size='small'
            title={'Confirmation'}
            zIndex={910}
            primaryButtonText={'Confirm'}
            secondaryButtonText={'Cancel'}
            primaryButtonCallback={(e: any) => {
               handleAssignNumber();
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
                  Are you sure you want to assign this phone number, {`"${phoneNumberToAssign?.friendlyName}"`}, to lead
                  source {`"${getObjectProp(phoneNumberToAssign, ['leadSource', 'name'])}"`}?
               </p>
            </div>
         </Modal>
      </>
   );
};

export default NewNumberModal;
