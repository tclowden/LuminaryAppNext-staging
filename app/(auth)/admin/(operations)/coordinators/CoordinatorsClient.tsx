'use client';
import Cookies from 'js-cookie';
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
import { useAppDispatch } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import { fetchDbApi, revalidate } from '@/serverActions';

const columns: ColumnType[] = [
   { keyPath: ['name'], title: 'Coordinator Name', colSpan: 2, sortable: true },
   { keyPath: ['roleNames'], title: 'Associated Roles', colSpan: 1, sortable: true },
   { keyPath: ['productCount'], title: 'Products Using Coordinator', colSpan: 1, sortable: true },
];

interface Props {
   allCoordinators: Array<any>;
}

const defaultSortingConfig: SortingConfiguration = { column: columns[0], sortType: SortingType.ASC };
const CoordinatorsClient = ({ allCoordinators }: Props) => {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const [coords, setCoords] = useState<Array<any>>([]);
   const [sortConfig, setSortConfig] = useState<SortingConfiguration>(defaultSortingConfig);
   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<DataType[]>([]);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [coordToRemove, setCoordToRemove] = useState<any>({});

   useEffect(() => {
      if (!!allCoordinators?.length) {
         setCoords((prevState: Array<any>) => {
            return allCoordinators.map((coord: any, i: number) => {
               return {
                  ...coord,
                  roleNames: coord.rolesOnProductCoordinator
                     .map((roleOnProdCoord: any) => roleOnProdCoord?.role?.name)
                     .join(', '),
                  productCount: coord.productsLookup.length.toString(),
                  actionsConfig: { delete: true, edit: true },
               };
            });
         });
      }
   }, []);

   const handleSearchInput = (e: any) => {
      if (!!!coords.length) return;
      const searchVal = e.target.value;
      setSearchInput(searchVal);
      const tempCoords = [...coords].filter(
         (coord: DataType) =>
            coord.name?.toLowerCase().includes(searchVal.toLowerCase()) |
            coord.roleNames?.toLowerCase().includes(searchVal.toLowerCase())
      );
      setSearchResults([...tempCoords]);
   };

   const handleArchiveProductCoordinator = async (id: number) => {
      if (!id) return;
      const userAuthToken = Cookies.get('LUM_AUTH');
      if (!userAuthToken) return;
      // archive the productField by the id
      await fetchDbApi(`/api/v2/products/coordinators/${id}`, {
         method: 'DELETE',
         headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
      })
         .then((res) => {
            setCoords((prevState: Array<DataType>) => {
               return [...prevState].filter((f: any) => f.id !== id);
            });
            dispatch(
               setAddToast({
                  details: [{ label: 'Success', text: 'Coordinator Successfully Deleted' }],
                  iconName: 'CheckMarkCircle',
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
         })
         .catch((err: any) => {
            console.log('Error archiving product field:', err);
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
            const url = `/admin/coordinators/${item.id}`;
            await revalidate({ path: url });
            router.push(url);
            break;
         case 'delete':
            setCoordToRemove(item);
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
                        router.push(`/admin/coordinators/new`);
                     }}>
                     New Coordinator
                  </Button>
                  <SearchBar
                     placeholder={'Search Fields...'}
                     searchValue={searchInput}
                     handleChange={handleSearchInput}
                     searchResults={searchResults}
                     onSelectSearchResult={async (e: any, result: any) => {
                        const url = `/admin/coordinators/${result.id}`;
                        await revalidate({ path: url });
                        if (result.id) router.push(url);
                        else console.log('hmmm.... no field id for result:', result);
                     }}
                     keyPath={['name']}
                  />
               </>
            }>
            <Table
               data={coords}
               columns={columns}
               pagination
               sortingConfig={sortConfig}
               onTableSort={async (column, direction, sortedData) => {
                  setCoords(sortedData);
                  setSortConfig({ column: column, sortType: direction });
               }}
               emptyStateDisplayText={'No Coordinators Created Yet...'}
               actions={[
                  { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Coordinator', callback: handleActionClick },
                  {
                     icon: 'TrashCan',
                     actionKey: 'delete',
                     toolTip: 'Delete Coordinator',
                     callback: handleActionClick,
                  },
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
               handleArchiveProductCoordinator(coordToRemove.id);
            }}
            value={'coordinator, "' + coordToRemove?.name + '"'}
         />
      </>
   );
};

export default CoordinatorsClient;
