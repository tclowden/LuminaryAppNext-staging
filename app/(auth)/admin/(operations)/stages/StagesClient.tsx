'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Button from '../../../../../common/components/button/Button';
import ConfirmModal from '../../../../../common/components/confirm-modal/ConfirmModal';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import SearchBar from '../../../../../common/components/search-bar/SearchBar';
import Table from '../../../../../common/components/table/Table';
import {
   ColumnType,
   DataType,
   SortingConfiguration,
   SortingType,
} from '../../../../../common/components/table/tableTypes';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import { selectUser } from '../../../../../store/slices/user';
import { fetchDbApi, revalidate } from '@/serverActions';

const columns: ColumnType[] = [
   { keyPath: ['name'], title: 'Stage Name', colSpan: 3, sortable: true },
   { keyPath: ['stageType', 'name'], title: 'Stage Type', colSpan: 1, sortable: true },
   { keyPath: ['productCount'], title: 'Products Using Stage', colSpan: 1, sortable: true },
];

interface Props {
   allStages: Array<any>;
}

const defaultSortingConfig: SortingConfiguration = { column: columns[0], sortType: SortingType.ASC };
const StagesClient = ({ allStages }: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const [stages, setStages] = useState<Array<any>>([]);
   const [sortConfig, setSortConfig] = useState<SortingConfiguration>(defaultSortingConfig);
   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<any[]>([]);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [stageToRemove, setStageToRemove] = useState<any>({});

   useEffect(() => {
      if (!!allStages?.length) {
         setStages((prevState: Array<DataType>) => {
            return allStages.map((stage: any) => {
               const isBeginningStage = stage?.name === 'Beginning Stage';
               return {
                  ...stage,
                  productCount: stage.productsLookup.length.toString(),
                  actionsConfig: { delete: !isBeginningStage, edit: true },
               };
            });
         });
      }
   }, []);

   const handleSearchInput = (e: any) => {};

   const handleArchiveProductStage = async (id: number) => {
      if (!id) return;
      const userAuthToken = user.token;
      if (!userAuthToken) return;

      // archive the productStage by the id
      await fetchDbApi(`/api/v2/products/stages/${id}`, {
         method: 'DELETE',
         headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
      })
         .then((res) => {
            setStages((prevState: Array<any>) => {
               return [...prevState].filter((stage: any) => stage.id !== id);
            });
            dispatch(
               setAddToast({
                  details: [{ label: 'Success', text: 'Stage Successfully Deleted' }],
                  iconName: 'CheckMarkCircle',
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
         })
         .catch((err) => {
            console.log('err', err);
            const errMsg = err.response?.data?.error?.errorMessage || 'Changes Not Saved';
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

   const handleActionClick = async ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            const url = `/admin/stages/${item.id}`;
            await revalidate({ path: url });
            router.push(url);
            break;
         case 'delete':
            setStageToRemove(item);
            setOpenConfirmModal(true);
            break;
         default:
            break;
      }
   };

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button
                     data-test={'createBtn'}
                     iconName='Plus'
                     color='blue'
                     onClick={() => {
                        router.push(`/admin/stages/new`);
                     }}>
                     New Stage
                  </Button>
                  <SearchBar
                     placeholder={'Search Stages...'}
                     searchValue={searchInput}
                     handleChange={handleSearchInput}
                     searchResults={searchResults}
                     onSelectSearchResult={async (e: any, result: any) => {
                        const url = `/admin/stages/${result.id}`;
                        await revalidate({ path: url });
                        if (result?.id) router.push(url);
                        else console.log('hmmm.... no stage id for result:', result);
                     }}
                     keyPath={['label']}
                  />
               </>
            }>
            <Table
               columns={columns}
               data={stages}
               pagination
               sortingConfig={sortConfig}
               onTableSort={async (column, direction, sortedData) => {
                  setStages(sortedData);
                  setSortConfig({ column: column, sortType: direction });
               }}
               emptyStateDisplayText={'No Stages Created Yet...'}
               actions={[
                  { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Field', callback: handleActionClick },
                  { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Field', callback: handleActionClick },
               ]}
            />
         </PageContainer>
         <ConfirmModal
            open={openConfirmModal}
            handleOnClose={(e: any) => {
               setOpenConfirmModal(!openConfirmModal);
            }}
            handleOnConfirm={(e: any) => {
               setOpenConfirmModal(false);
               handleArchiveProductStage(stageToRemove.id);
            }}
            value={'stage, "' + stageToRemove?.name + '"'}
         />
      </>
   );
};

export default StagesClient;
