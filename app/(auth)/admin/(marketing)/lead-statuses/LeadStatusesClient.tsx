'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../../../../common/components/button/Button';
import ConfirmModal from '../../../../../common/components/confirm-modal/ConfirmModal';
import Grid from '../../../../../common/components/grid/Grid';
import Icon from '../../../../../common/components/Icon';
import Input from '../../../../../common/components/input/Input';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import TableCellLink from '../../../../../common/components/table-cell-link/TableCellLink';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';
import Tabs from '../../../../../common/components/tabs/Tabs';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import { selectUser } from '../../../../../store/slices/user';

const columns: ColumnType[] = [
   {
      keyPath: ['name'],
      title: 'Status',
      colSpan: 2,
      render: ({ item }: { item: any }) => (
         <TableCellLink path={`/admin/lead-statuses/${item.id}`}>{item.name}</TableCellLink>
      ),
   },
   {
      keyPath: ['label'],
      title: 'Leads in Status',
      colSpan: 1,
      render: ({ item }: { item: any }) => <span>{item?.leadCount || 0}</span>,
   },
   {
      keyPath: ['placeholder'],
      title: 'Human Answered Status',
      colSpan: 1,
      render: ({ item }: { item: any }) => {
         const { rulesOnStatuses } = item;

         const dncStatus = rulesOnStatuses.some(
            ({ statusRulesType: { name } }: { statusRulesType: any }) => name === 'Human Answered Status'
         );

         if (!dncStatus) {
            return null;
         }

         return <Icon name={'CheckMark'} color='green' width={14} />;
      },
   },
   {
      keyPath: ['placeholder'],
      title: 'Do Not Contact',
      colSpan: 1,
      render: ({ item }: { item: any }) => {
         const { rulesOnStatuses } = item;

         const dncStatus = rulesOnStatuses.some(
            ({ statusRulesType: { name } }: { statusRulesType: any }) => name === 'Do Not Contact'
         );

         if (!dncStatus) {
            return null;
         }

         return <Icon name={'CheckMark'} color='green' width={14} />;
      },
   },
   {
      keyPath: ['placeholder'],
      title: 'Hidden Status',
      colSpan: 1,
      render: ({ item }: { item: any }) => {
         const { rulesOnStatuses } = item;

         const hiddenStatus = rulesOnStatuses.some(
            ({ statusRulesType: { name } }: { statusRulesType: any }) => name === 'Hidden Status'
         );

         if (!hiddenStatus) {
            return null;
         }

         return <Icon name={'CheckMark'} color='green' width={14} />;
      },
   },
   {
      keyPath: ['placeholder'],
      title: 'Require Note',
      colSpan: 1,
      render: ({ item }: { item: any }) => {
         const { rulesOnStatuses } = item;

         const requireNoteRule = rulesOnStatuses.some(
            ({ statusRulesType: { name } }: { statusRulesType: any }) => name === 'Require Note'
         );

         if (!requireNoteRule) {
            return null;
         }

         return <Icon name={'CheckMark'} color='green' width={14} />;
      },
   },
];

type Props = {
   statusesWithTypes: any[];
};

const LeadStatusesClient = ({ statusesWithTypes }: Props) => {
   console.log('Statuses with types: ', statusesWithTypes);
   const router = useRouter();
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);

   const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
   const [statusData, setStatusData] = useState<any[]>(statusesWithTypes);
   const [searchValue, setSearchValue] = useState<string>('');
   const [leadStatusToRemove, setLeadStatusToRemove] = useState<any>({});
   const [tabs, setTabs] = useState<any[]>([]);
   const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
   const [tableHeaders, setTableHeaders] = useState<ColumnType[]>([]);

   // Adds the action configs to table rows
   // TODO: add permissions to edit and delete
   useEffect(() => {
      const statusDataWithActionsConfig = statusData.map((data: any) => {
         const updatedStatuses = data.statuses.map((status: any) => {
            return {
               ...status,
               actionsConfig: { edit: true, delete: true },
            };
         });

         return {
            ...data,
            statuses: updatedStatuses,
         };
      });

      setStatusData(statusDataWithActionsConfig);
   }, []);

   useEffect(() => {
      // each status type will be a tab
      const statusTypes = statusData.map((item, index) => ({ name: item.name, activeIndex: index, id: item.id }));
      statusTypes.sort((a, b) => a.name.localeCompare(b.name));
      setTabs(statusTypes);
   }, []);

   const handleActionClick = ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            router.push(`/admin/lead-statuses/${item.id}`);
            break;
         case 'delete':
            setLeadStatusToRemove(item);
            setShowConfirmModal(true);
            break;
         default:
            break;
      }
   };

   const handleSearch = (searchString: string) => {
      setSearchValue(searchString);
   };

   const handleArchiveStatus = async (leadStatusToRemoveId: number) => {
      await fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/statuses/archive/${leadStatusToRemoveId}`, {
         method: 'GET',
         headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
         },
      })
         .then(async (res) => {
            const results = await res.json();
            if (results.error) throw new Error(results.error.errorMessage);

            setStatusData((prevState: Array<any>) => {
               return [...prevState].filter((leadField: any) => leadField.id !== leadStatusToRemoveId);
            });
            setShowConfirmModal(false);
            dispatch(
               setAddToast({
                  iconName: 'CheckMarkCircle',
                  details: [{ label: 'Success', text: 'Lead Field Was Deleted' }],
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
         })
         .catch((err) => {
            console.error('err:', err);
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: 'Could Not Delete Lead Field' }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const getStatuses = (tab: any) => {
      if (!!!tab) return;
      const data = statusData.find((type: any) => type.id === tab.id);
      return data?.statuses;
   };

   const handlePaginate = () => {
      console.log('Paginate');
   };
   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <Input
                  iconName='MagnifyingGlass'
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  border
                  shadow
                  onClearInput={() => handleSearch('')}
               />
            }>
            <Grid>
               <div className='flex justify-between'>
                  <Tabs
                     tabs={tabs}
                     activeTabIndex={activeTabIndex}
                     setActiveTabIndex={(tabIndex) => setActiveTabIndex(tabIndex)}
                  />
                  <Button
                     iconName='Plus'
                     color='blue'
                     onClick={() => {
                        router.push(`/admin/lead-statuses/new`);
                     }}>
                     New Status
                  </Button>
               </div>
               {statusData && (
                  <Table
                     columns={columns}
                     pagination
                     onPaginate={handlePaginate}
                     data={getStatuses(tabs[activeTabIndex]) || []}
                     actions={[
                        { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Field', callback: handleActionClick },
                        {
                           icon: 'TrashCan',
                           actionKey: 'delete',
                           toolTip: 'Delete Field',
                           callback: handleActionClick,
                        },
                     ]}
                  />
               )}
            </Grid>
         </PageContainer>
         <ConfirmModal
            open={showConfirmModal}
            handleOnClose={(e: any) => {
               setShowConfirmModal(false);
            }}
            handleOnConfirm={(e: any) => {
               handleArchiveStatus(leadStatusToRemove?.id);
            }}
            value={`lead status, "${leadStatusToRemove?.name}"`}
         />
      </>
   );
};

export default LeadStatusesClient;
