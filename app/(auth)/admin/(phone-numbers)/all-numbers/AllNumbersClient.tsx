'use client';

import { PhoneNumber, PhoneNumberType } from '@/common/types/PhoneNumbers';
import { fetchDbApi } from '@/serverActions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../../../../common/components/button/Button';
import Grid from '../../../../../common/components/grid/Grid';
import Input from '../../../../../common/components/input/Input';
import Modal from '../../../../../common/components/modal/Modal';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import TableCellLink from '../../../../../common/components/table-cell-link/TableCellLink';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';
import Tabs from '../../../../../common/components/tabs/Tabs';
import ToggleSwitch from '../../../../../common/components/toggle-switch/ToggleSwitch';
import { useAppDispatch } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import { getObjectProp } from '../../../../../utilities/helpers';
import EditNumberModal from './(partials)/EditNumberModal';
import NewNumberModal from './(partials)/NewNumberModal';
import ReputationBadge from './(partials)/ReputationBadge';

type Props = {
   phoneNumbersData: Array<PhoneNumber>;
   phoneNumberTypes: Array<PhoneNumberType>;
   users: Array<any>;
   leadSources: Array<any>;
   states: Array<any>;
};

const phoneNumberTabs = [
   { name: 'All Numbers' },
   { name: 'User Assigned' },
   { name: 'Lead Source' },
   { name: 'Local Presence' },
   { name: 'Unassigned' },
];

const AllNumbersClient = ({ phoneNumbersData, phoneNumberTypes, users, leadSources, states }: Props) => {
   const dispatch = useAppDispatch();
   const router = useRouter();

   const [phoneNumbers, setPhoneNumbers] = useState<Array<PhoneNumber>>(phoneNumbersData);
   const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
   const [phoneNumberTableData, setPhoneNumberTableData] = useState<any[]>([]);
   const [tableColumns, setTableColumns] = useState<Array<ColumnType>>([]);

   const [searchValue, setSearchValue] = useState<string>('');

   const [showNewNumberModal, setShowNewNumberModal] = useState<boolean>(false);
   const [showEditNumberModal, setShowEditNumberModal] = useState<boolean>(false);

   const [phoneNumberToEdit, setPhoneNumberToEdit] = useState<any>({});
   const [phoneNumberToRemove, setPhoneNumberToRemove] = useState<any>({});
   const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

   useEffect(() => {
      setPhoneNumbers(phoneNumbersData);
   }, [phoneNumbersData]);

   useEffect(() => {
      const tempPhoneNumbersData = [...phoneNumbers];
      switch (phoneNumberTabs[activeTabIndex]?.name) {
         case 'All Numbers':
            setPhoneNumberTableData(addTableItemConfig(tempPhoneNumbersData));
            setTableColumns([
               { keyPath: ['prettyNumber'], title: 'Phone Number' },
               {
                  title: 'Reputation',
                  render: ({ item }) => {
                     const score = getObjectProp(item, ['reputation', 0, 'score']);
                     if (!score) return <span className='text-lum-gray-300'>N/A</span>;
                     return <ReputationBadge score={score} />;
                  },
               },
               {
                  keyPath: ['type', 'name'],
                  title: 'Assign Type',
                  render: ({ item }: { item: any }) => {
                     const itemType = item?.type?.name;
                     if (itemType === 'Unassigned') {
                        return (
                           <Button
                              color='blue'
                              size='sm'
                              onClick={() => {
                                 setPhoneNumberToEdit(item);
                                 setShowEditNumberModal(true);
                              }}>
                              Assign Now
                           </Button>
                        );
                     } else {
                        return item?.type?.name;
                     }
                  },
               },
               {
                  title: 'Assigned To',
                  render: ({ item }: { item: any }) => {
                     const itemType = item?.type?.name;
                     switch (itemType) {
                        case 'User':
                           return (
                              <TableCellLink
                                 path={`/admin/users/${getObjectProp(item, ['usersOnPhoneNumber', 0, 'user', 'id'])}`}>
                                 {getObjectProp(item, ['usersOnPhoneNumber', 0, 'user', 'fullName'])}
                              </TableCellLink>
                           );
                        case 'Lead Source':
                           return getObjectProp(item, ['leadSourcesOnPhoneNumber', 0, 'leadSource', 'name']);
                        // <TableCellLink
                        //    path={`/marketing/lead-sources/${getObjectProp(item, [
                        //       'leadSourcesOnPhoneNumber',
                        //       0,
                        //       'leadSource',
                        //       'id',
                        //    ])}`}>
                        //    {getObjectProp(item, ['leadSourcesOnPhoneNumber', 0, 'leadSource', 'name'])}
                        // </TableCellLink>
                        case 'Unassigned':
                           return <span className='text-lum-gray-300'>Unassigned</span>;
                        default:
                           return <span className='text-lum-gray-300'>N/A</span>;
                     }
                  },
               },
               {
                  title: 'Active?',
                  render: ({ item }: { item: any }) => {
                     const itemType = item?.type?.name;
                     if (itemType === 'Local Presence') {
                        return <ToggleSwitch checked={item?.active} onChange={() => handleActivateNumber(item)} />;
                     } else {
                        return <span className='text-lum-gray-300'>N/A</span>;
                     }
                  },
               },
            ]);
            break;
         case 'User Assigned':
            setPhoneNumberTableData(
               addTableItemConfig(
                  tempPhoneNumbersData.filter(
                     (number) => number?.type?.name === 'User' && number?.usersOnPhoneNumber?.length
                  )
               )
            );

            setTableColumns([
               {
                  keyPath: ['prettyNumber'],
                  title: 'Phone Number',
               },
               {
                  title: 'Reputation',
                  render: ({ item }) => {
                     const score = getObjectProp(item, ['reputation', 0, 'score']);
                     if (!score) return <span className='text-lum-gray-300'>N/A</span>;
                     return <ReputationBadge score={score} />;
                  },
               },
               {
                  title: 'Assigned User',
                  render: ({ item }: { item: any }) => (
                     <TableCellLink
                        path={`/admin/users/${getObjectProp(item, ['usersOnPhoneNumber', 0, 'user', 'id'])}`}>
                        {getObjectProp(item, ['usersOnPhoneNumber', 0, 'user', 'fullName'])}
                     </TableCellLink>
                  ),
               },
            ]);
            break;
         case 'Lead Source':
            setPhoneNumberTableData(
               addTableItemConfig(
                  tempPhoneNumbersData.filter((number) => {
                     return number?.type?.name === 'Lead Source' && number?.leadSourcesOnPhoneNumber?.length;
                  })
               )
            );
            setTableColumns([
               {
                  keyPath: ['prettyNumber'],
                  title: 'Phone Number',
               },
               {
                  title: 'Reputation',
                  render: ({ item }) => {
                     const score = getObjectProp(item, ['reputation', 0, 'score']);
                     if (!score) return <span className='text-lum-gray-300'>N/A</span>;
                     return <ReputationBadge score={score} />;
                  },
               },
               {
                  keyPath: ['leadSourcesOnPhoneNumber', 0, 'leadSource', 'name'],
                  title: 'Lead Source',
                  render: ({ item }: { item: any }) => (
                     <TableCellLink
                        path={`/admin/lead-sources/${getObjectProp(item, [
                           'leadSourcesOnPhoneNumber',
                           0,
                           'leadSource',
                           'id',
                        ])}`}>
                        {getObjectProp(item, ['leadSourcesOnPhoneNumber', 0, 'leadSource', 'name'])}
                     </TableCellLink>
                  ),
               },
            ]);
            break;
         case 'Local Presence':
            setPhoneNumberTableData(
               addTableItemConfig(tempPhoneNumbersData.filter((number) => number?.type?.name === 'Local Presence'))
            );
            setTableColumns([
               {
                  keyPath: ['prettyNumber'],
                  title: 'Phone Number',
               },
               {
                  title: 'Reputation',
                  render: ({ item }) => {
                     const score = getObjectProp(item, ['reputation', 0, 'score']);
                     if (!score) return <span className='text-lum-gray-300'>N/A</span>;
                     return <ReputationBadge score={score} />;
                  },
               },
               {
                  title: 'Active?',
                  render: ({ item }: { item: any }) => {
                     const itemType = item?.type?.name;
                     if (itemType === 'Local Presence') {
                        return <ToggleSwitch checked={item?.active} onChange={() => handleActivateNumber(item)} />;
                     } else {
                        return <span className='text-lum-gray-300'>N/A</span>;
                     }
                  },
               },
            ]);
            break;
         case 'Unassigned':
            setPhoneNumberTableData(
               addTableItemConfig(tempPhoneNumbersData.filter((number) => number?.type?.name === 'Unassigned'))
            );
            setTableColumns([
               {
                  keyPath: ['prettyNumber'],
                  title: 'Phone Number',
               },
               {
                  title: 'Reputation',
                  render: ({ item }) => {
                     const score = getObjectProp(item, ['reputation', 0, 'score']);
                     if (!score) return <span className='text-lum-gray-300'>N/A</span>;
                     return <ReputationBadge score={score} />;
                  },
               },
            ]);
            break;
      }
   }, [phoneNumbers, activeTabIndex]);

   const addTableItemConfig = (data: Array<any>) => {
      return data.map((phoneNumber: any) => {
         const isLeadSourceType = getObjectProp(phoneNumber, ['type', 'name']) === 'Lead Source'; // Disable edit button if type is 'Lead Source'. Once a number is assigned to a lead source we do not want to re-assign it.
         return {
            ...phoneNumber,
            actionsConfig: { edit: !isLeadSourceType, delete: true },
         };
      });
   };

   const handleSearch = (searchString: string) => {
      setSearchValue(searchString);
      setPhoneNumberTableData(() => {
         const tempData = [...phoneNumbers].filter(
            (phoneNumber) => phoneNumber?.number && phoneNumber?.number.includes(searchString)
         );
         return addTableItemConfig(tempData);
      });
   };

   const handleActionKey = ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            setPhoneNumberToEdit(item);
            setShowEditNumberModal(true);
            break;
         case 'delete':
            setPhoneNumberToRemove(item);
            setShowConfirmModal(true);
            break;
         default:
            console.log(`Action, "${actionKey}", not supported`);
      }
   };
   const makeToast = (success: boolean, text: string) => {
      dispatch(
         setAddToast({
            iconName: success ? 'CheckMarkCircle' : 'XMarkCircle',
            details: [{ label: success ? 'Success' : 'Error', text }],
            variant: success ? 'success' : 'danger',
            autoCloseDelay: 5,
         })
      );
   };

   const handleActivateNumber = (number: PhoneNumber) => {
      fetchDbApi(`/api/v2/phone-numbers/activate/${number?.id}`, {
         method: 'PUT',
         body: JSON.stringify({
            active: !number?.active,
         }),
      })
         .then(() => {
            makeToast(true, 'Number Was Updated');
            setPhoneNumbers((prevState: any) => {
               const tempState = [...prevState];
               const foundNumber = tempState.find((num) => num.id === number.id);
               if (!foundNumber) return prevState;
               foundNumber.active = !number.active;
               return tempState;
            });
         })
         .catch((err) => {
            console.log('err:', err);
            makeToast(false, 'Number Was Not Updated');
         });
   };

   const handleArchivePhoneNumber = async (phoneNumberToRemoveId: string) => {
      fetchDbApi(`/api/v2/phone-numbers/${phoneNumberToRemoveId}`, {
         method: 'DELETE',
      })
         .then(() => {
            makeToast(true, 'Number Was Deleted');
            setShowConfirmModal(false);
            router.refresh();
         })
         .catch((err) => {
            console.log('err:', err);
            makeToast(false, 'Number Was Not Deleted');
         });
   };

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button
                     color='blue'
                     onClick={() => {
                        setShowNewNumberModal(true);
                     }}>
                     {'+ Phone Number'}
                  </Button>
                  <Input
                     iconName='MagnifyingGlass'
                     value={searchValue}
                     onChange={(e) => handleSearch(e.target.value)}
                     border
                     shadow
                     onClearInput={() => handleSearch('')}
                  />
               </>
            }>
            <Grid>
               <div className='flex justify-between'>
                  {!!phoneNumberTabs?.length && (
                     <Tabs
                        tabs={phoneNumberTabs}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={(tabIndex) => setActiveTabIndex(tabIndex)}
                     />
                  )}
               </div>
               <Table
                  columns={tableColumns}
                  data={phoneNumberTableData}
                  actions={[
                     {
                        icon: 'Edit',
                        actionKey: 'edit',
                        toolTip: 'Edit Phone Number',
                        callback: handleActionKey,
                     },
                     {
                        icon: 'TrashCan',
                        actionKey: 'delete',
                        toolTip: 'Delete Phone Number',
                        callback: handleActionKey,
                     },
                  ]}
               />
            </Grid>
         </PageContainer>
         <NewNumberModal
            showModal={showNewNumberModal}
            setShowModal={setShowNewNumberModal}
            phoneNumberTypes={phoneNumberTypes}
            users={users}
            leadSources={leadSources}
            states={states}
         />
         <EditNumberModal
            showModal={showEditNumberModal}
            setShowModal={setShowEditNumberModal}
            phoneNumberToEdit={phoneNumberToEdit}
            phoneNumberTypes={phoneNumberTypes}
            users={users}
            leadSources={leadSources}
         />
         <Modal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            size='small'
            title={'Delete Number'}
            primaryButtonText={'Delete'}
            secondaryButtonText={'Cancel'}
            primaryButtonCallback={(e: any) => {
               handleArchivePhoneNumber(phoneNumberToRemove?.id);
            }}
            primaryButtonColor={'red'}>
            <div>Are you sure you want to DELETE phone number: {`"${phoneNumberToRemove?.prettyNumber}"`}?</div>
         </Modal>
      </>
   );
};

export default AllNumbersClient;
