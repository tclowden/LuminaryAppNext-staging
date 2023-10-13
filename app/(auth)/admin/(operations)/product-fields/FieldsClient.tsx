'use client';
import axios from 'axios';
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
   PaginationConfig,
   SortingConfiguration,
   SortingType,
} from '../../../../../common/components/table/tableTypes';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import { fetchDbApi, revalidate } from '@/serverActions';
import useDebounce from '@/common/hooks/useDebounce';
import { selectUser } from '@/store/slices/user';

const configureActionsConfig = (arr: Array<any>, actionsConfig: any, sortConfig: any) => {
   const { column, sortType } = sortConfig;
   return arr
      ?.map((field: any, i: number) => ({
         ...field,
         fieldId: field.id,
         type: {
            value: field?.fieldType?.name,
            iconConfig: { name: field?.fieldType?.iconName, color: field?.fieldType?.iconColor },
         },
         productCount: field?.productsLookup?.length.toString(),
         actionsConfig: actionsConfig,
      }))
      .sort((a: any, b: any) => {
         let tempKeyPath = column?.keyPath[0] === 'type' ? [...column.keyPath, 'value'] : column.keyPath;
         let valueA = tempKeyPath?.reduce((acc: any, curr: any) => acc[curr as any], a)?.toLowerCase();
         let valueB = tempKeyPath?.reduce((acc: any, curr: any) => acc[curr as any], b)?.toLowerCase();

         if (sortType === SortingType.ASC) return valueA > valueB ? 1 : -1;
         else return valueA < valueB ? 1 : -1;
      });
};

const columns: ColumnType[] = [
   { keyPath: ['type'], title: 'Input Type', colSpan: 1, sortable: false },
   { keyPath: ['label'], title: 'Field Label', colSpan: 2, sortable: true },
   { keyPath: ['placeholder'], title: 'Placeholder Text', colSpan: 2, sortable: true },
   { keyPath: ['productCount'], title: 'Products Using Field', colSpan: 1, sortable: false },
];

interface Props {
   allFields: Array<any>;
   fieldCount: number | string;
}

const defaultFetchLimit = 100;
const defaultPaginationConfig: PaginationConfig = { offset: 0, limit: defaultFetchLimit, fetch: false };
const defaultSortingConfig: SortingConfiguration = { column: columns[1], sortType: SortingType.ASC };

const FieldsClient = ({ allFields, fieldCount }: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const [fields, setFields] = useState<Array<any>>([]);

   const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>(defaultPaginationConfig);
   const [sortConfig, setSortConfig] = useState<SortingConfiguration>(defaultSortingConfig);

   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<any[]>([]);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [fieldToRemove, setFieldToRemove] = useState<any>({});

   const getActionsConfigObj = () => {
      const actionsConfig = { edit: true, delete: true };
      return actionsConfig;
   };

   useEffect(() => {
      if (!!allFields?.length) {
         const actionsConfig = getActionsConfigObj();
         const fieldsToStore = configureActionsConfig(allFields, actionsConfig, sortConfig);
         setFields(fieldsToStore);
      }
   }, []);

   // custom hook to fetch the server with a debounce
   useDebounce(
      async () => {
         if (searchInput?.length < 1) return;
         console.log('debouncing...');
         const token = user?.token;
         const results = await fetchDbApi(`/api/v2/products/fields/query?label=${searchInput}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
         });
         const actionsConfig = getActionsConfigObj();
         const tempFields = configureActionsConfig(results, actionsConfig, sortConfig);
         setSearchResults(tempFields);
      },
      [searchInput],
      500
   );

   const fetchFields = async (offset: number, order: Array<Array<any>> | null) => {
      const token = user?.token;
      return await fetchDbApi(
         `/api/v2/products/fields/query`,
         {
            method: 'POST',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
            cache: 'no-store',
            body: JSON.stringify({
               limit: defaultFetchLimit,
               offset: offset,
               order: order || [['name', 'ASC']],
               include: [
                  { model: 'fieldTypesLookup', as: 'fieldType', required: false },
                  { model: 'productsLookup', as: 'productsLookup', required: false },
               ],
            }),
         },
         false
      );
   };

   useEffect(() => {
      async function runAsync() {
         if (paginationConfig?.fetch) {
            let order: any;
            let colToOrderBy: any;

            const { column, sortType } = sortConfig;
            // colToOrderBy = column.keyPath ? column.keyPath[0] : 'name';
            colToOrderBy = column.keyPath ? (column.keyPath[0] === 'type' ? 'fieldType' : column.keyPath[0]) : 'label';

            // if (sortType === 0) order = [[colToOrderBy, 'ASC']];
            // else order = [[colToOrderBy, 'DESC']];
            if (sortType === SortingType.ASC) {
               if (colToOrderBy === 'fieldType')
                  order = [[{ model: 'fieldTypesLookup', as: 'fieldType' }, 'name', 'ASC']];
               else order = [[colToOrderBy, 'ASC']];
            } else {
               if (colToOrderBy === 'fieldType')
                  order = [[{ model: 'fieldTypesLookup', as: 'fieldType' }, 'name', 'DESC']];
               else order = [[colToOrderBy, 'DESC']];
            }

            const newFields = await fetchFields(paginationConfig?.offset, order);
            setFields((prevState: Array<any>) => {
               const actionsConfig = getActionsConfigObj();
               const fieldsToAdd = configureActionsConfig([...newFields], actionsConfig, sortConfig);
               return [...prevState, ...fieldsToAdd];
            });
            setPaginationConfig((prevState: any) => ({ ...prevState, fetch: false }));
         }
      }
      runAsync();
   }, [paginationConfig]);

   useEffect(() => {
      async function runAsync() {
         if (sortConfig?.fetch) {
            let order: any;
            let colToOrderBy: any;

            const { column, sortType } = sortConfig;
            colToOrderBy = column.keyPath ? (column.keyPath[0] === 'type' ? 'fieldType' : column.keyPath[0]) : 'label';

            // let tempOrder;
            // if (colToOrderBy === 'fieldType') order = [{ model: 'fieldTypesLookup', as: 'fieldType' }, 'name', 'DESC']

            if (sortType === SortingType.ASC) {
               if (colToOrderBy === 'fieldType')
                  order = [[{ model: 'fieldTypesLookup', as: 'fieldType' }, 'name', 'ASC']];
               else order = [[colToOrderBy, 'ASC']];
            } else {
               if (colToOrderBy === 'fieldType')
                  order = [[{ model: 'fieldTypesLookup', as: 'fieldType' }, 'name', 'DESC']];
               else order = [[colToOrderBy, 'DESC']];
            }

            // reset the pagination config
            setPaginationConfig(defaultPaginationConfig);

            const newFields = await fetchFields(defaultPaginationConfig?.offset, order);

            const actionsConfig = getActionsConfigObj();
            setFields(configureActionsConfig(newFields, actionsConfig, sortConfig));
            setSortConfig((prevState: SortingConfiguration) => ({ ...prevState, fetch: false }));
         }
      }
      runAsync();
   }, [sortConfig]);

   const handleSearchInput = (e: any) => {
      const searchVal = e.target.value;
      setSearchInput(searchVal);
   };

   const handleArchiveProductField = async (id: number) => {
      if (!id) return;
      const userAuthToken = Cookies.get('LUM_AUTH');
      if (!userAuthToken) return;
      // archive the productField by the id
      await fetchDbApi(`/api/v2/products/fields/${id}`, {
         method: 'DELETE',
         headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
      })
         .then((res) => {
            setFields((prevState: Array<any>) => {
               return [...prevState].filter((f: any) => f.id !== id);
            });
            dispatch(
               setAddToast({
                  details: [{ label: 'Success', text: 'Field Successfully Deleted' }],
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
            const url = `/admin/product-fields/${item.id}`;
            await revalidate({ path: url });
            router.push(url);
            break;
         case 'delete':
            setFieldToRemove(item);
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
                        router.push(`/admin/product-fields/new`);
                     }}>
                     New Field
                  </Button>
                  <SearchBar
                     placeholder={'Search Fields...'}
                     searchValue={searchInput}
                     handleChange={handleSearchInput}
                     searchResults={searchResults}
                     onSelectSearchResult={async (e: any, result: any) => {
                        if (result.fieldId) {
                           const url = `/admin/product-fields/${result.id}`;
                           await revalidate({ path: url });
                           router.push(url);
                        } else console.log('hmmm.... no field id for result:', result);
                     }}
                     keyPath={['label']}
                  />
               </>
            }>
            <Table
               columns={columns}
               data={fields}
               pagination
               paginationTotalCount={+fieldCount}
               onPaginate={(paginationOptions, pageState) => {
                  const { rowsPerPage } = paginationOptions;
                  const { currPage, prevPage } = pageState;
                  if (currPage != prevPage) {
                     // page change
                     let on2ndToLastPage = false;
                     const dataLength = fields?.length;
                     const totalPages = dataLength / rowsPerPage;
                     on2ndToLastPage = totalPages - 1 <= currPage;
                     if (on2ndToLastPage) {
                        console.log('on 2nd to last page on pagination...');
                        setPaginationConfig((prevState: any) => ({
                           ...prevState,
                           offset: prevState?.limit + prevState?.offset,
                           fetch: true,
                        }));
                     }
                  }
               }}
               sortingConfig={sortConfig}
               onTableSort={(column: ColumnType, direction: SortingType, sortedData) => {
                  setFields(sortedData);
                  setSortConfig({ column: column, sortType: direction, fetch: true });
               }}
               emptyStateDisplayText={`No Product Fields Created Yet...`}
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
               handleArchiveProductField(fieldToRemove.id);
            }}
            value={'input field, "' + fieldToRemove?.label + '"'}
         />
      </>
   );
};

export default FieldsClient;
