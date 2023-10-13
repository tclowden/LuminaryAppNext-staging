'use client';
import { fetchDbApi } from '@/serverActions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../../../../common/components/button/Button';
import ConfirmModal from '../../../../../common/components/confirm-modal/ConfirmModal';
import Input from '../../../../../common/components/input/Input';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';
import { LeadField } from '../../../../../common/types/Leads';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import { selectUser } from '../../../../../store/slices/user';
import { getObjectProp } from '../../../../../utilities/helpers';

const columns: ColumnType[] = [
   {
      keyPath: ['type'],
      title: 'Input Type',
      colSpan: 1,
   },
   {
      keyPath: ['label'],
      title: 'Field Label',
      colSpan: 1,
   },
   {
      keyPath: ['placeholder'],
      title: 'Placeholder Text',
      colSpan: 1,
   },
];

type Props = {
   leadFieldsData: any[];
};

const LeadFieldsClient = ({ leadFieldsData }: Props) => {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);

   const [leadFields, setLeadFields] = useState<LeadField[]>([...leadFieldsData]);
   const [searchValue, setSearchValue] = useState<string>('');

   const [leadFieldToRemove, setLeadFieldToRemove] = useState<any>({});
   const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

   useEffect(() => {
      setLeadFields(() => {
         return addTableItemConfig([...leadFieldsData]);
      });
   }, [leadFieldsData]);

   const addTableItemConfig = (data: Array<any>) => {
      return data.map((leadField: any) => ({
         ...leadField,
         type: {
            value: getObjectProp(leadField, ['fieldType', 'name']),
            iconConfig: {
               name: getObjectProp(leadField, ['fieldType', 'iconName']),
               color: getObjectProp(leadField, ['fieldType', 'iconColor']),
            },
         },
         actionsConfig: { edit: true, delete: true },
      }));
   };

   const handleActionClick = ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            router.push(`/admin/lead-fields/${item.id}`);
            break;
         case 'delete':
            setLeadFieldToRemove(item);
            setShowConfirmModal(true);
            break;
         default:
            break;
      }
   };

   const handleSearch = (e: any) => {
      const searchString = e.target.value;
      setSearchValue(searchString);
      setLeadFields(() => {
         const tempData = [...leadFieldsData].filter((leadField) =>
            leadField?.label.toLowerCase().includes(searchString.toLowerCase())
         );
         return addTableItemConfig(tempData);
      });
   };

   const handleArchiveLeadField = async (leadFieldToRemoveId: string) => {
      await fetchDbApi(`/api/v2/leads/lead-fields/${leadFieldToRemoveId}`, {
         method: 'DELETE',
      })
         .then(() => {
            setLeadFields((prevState: Array<LeadField>) => {
               return [...prevState].filter((leadField: LeadField) => leadField.id !== leadFieldToRemoveId);
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
            console.error('handleArchiveLeadField -> Error:', err);
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

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button
                     iconName='Plus'
                     color='blue'
                     onClick={() => {
                        router.push(`/admin/lead-fields/new`);
                     }}>
                     New Field
                  </Button>
                  <Input iconName='MagnifyingGlass' value={searchValue} onChange={handleSearch} border shadow />
               </>
            }>
            <Table
               columns={columns}
               data={leadFields}
               actions={[
                  { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Field', callback: handleActionClick },
                  { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Field', callback: handleActionClick },
               ]}
               pagination
               paginationTotalCount={leadFieldsData?.length}
            />
         </PageContainer>
         <ConfirmModal
            open={showConfirmModal}
            handleOnClose={(e: any) => {
               setShowConfirmModal(false);
            }}
            handleOnConfirm={(e: any) => {
               handleArchiveLeadField(leadFieldToRemove?.id);
            }}
            value={`lead record field, "${leadFieldToRemove?.label}"`}
         />
      </>
   );
};

export default LeadFieldsClient;
