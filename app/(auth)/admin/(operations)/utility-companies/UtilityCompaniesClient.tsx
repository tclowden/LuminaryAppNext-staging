'use client';
import axios from 'axios';
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
import { selectPageContext, setPageContext } from '../../../../../store/slices/pageContext';
import { setAddToast } from '../../../../../store/slices/toast';
import { selectUser } from '../../../../../store/slices/user';
import { fetchDbApi, revalidate } from '@/serverActions';
import useDebounce from '@/common/hooks/useDebounce';

const configureActionsConfig = (arr: Array<any>, actionsConfig: any, sortConfig: SortingConfiguration) => {
   const { column, sortType } = sortConfig;
   return arr
      ?.map((u: any, i: number) => ({
         ...u,
         actionsConfig: actionsConfig,
      }))
      .sort((a: any, b: any) => {
         // const valueA = columns[0].keyPath?.reduce((acc, curr) => acc[curr as any], a);
         // const valueB = columns[0].keyPath?.reduce((acc, curr) => acc[curr as any], b);
         // return valueA > valueB ? 1 : -1;
         const valueA = column.keyPath?.reduce((acc, curr) => acc[curr as any], a)?.toLowerCase();
         const valueB = column.keyPath?.reduce((acc, curr) => acc[curr as any], b)?.toLowerCase();

         if (sortType === 0) return valueA > valueB ? 1 : -1;
         else return valueA < valueB ? 1 : -1;
      });
};

const columns: ColumnType[] = [
   { keyPath: ['name'], title: 'Utitlity Company Name', colSpan: 2, sortable: true },
   { keyPath: ['connectionFee'], title: 'Connection Fee', colSpan: 1 },
   { keyPath: ['additionalCost'], title: 'Additional Cost', colSpan: 1 },
   { keyPath: ['state', 'name'], title: 'State', colSpan: 1 },
   {
      keyPath: ['netMeter'],
      title: 'Net Metering',
      colSpan: 1,
      render: ({ item }: any) => (item.netMeter ? 'Yes' : 'No'),
   },
];

interface Props {}

const defaultFetchLimit = 100;
const defaultPaginationConfig: PaginationConfig = { offset: 0, limit: defaultFetchLimit, fetch: false };
const defaultSortingConfig: SortingConfiguration = { column: columns[0], sortType: SortingType.ASC, fetch: false };
const UtilityCompaniesClient = ({}: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const contextData = useAppSelector(selectPageContext);
   const dispatch = useAppDispatch();

   const [paginationConfig, setPaginationConfig] = useState<PaginationConfig>(defaultPaginationConfig);
   const [sortConfig, setSortConfig] = useState<SortingConfiguration>(defaultSortingConfig);

   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<Array<string>>([]);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [utilityCompanyToRemove, setUtilityCompanyToRemove] = useState<any>({});

   const getActionsConfigObj = () => {
      const actionsConfig = { delete: true, edit: true };
      return actionsConfig;
   };

   useEffect(() => {
      if (!!contextData?.utilityCompanies?.length) {
         const actionsConfig = getActionsConfigObj();
         const tempUtilityCompanies = configureActionsConfig(contextData.utilityCompanies, actionsConfig, sortConfig);
         dispatch(setPageContext({ utilityCompanies: tempUtilityCompanies }));
      }
   }, []);

   // custom hook to fetch the server with a debounce
   useDebounce(
      async () => {
         if (searchInput?.length < 1) return;
         console.log('debouncing...');
         const token = user?.token;
         const results = await fetchDbApi(`/api/v2/utility-companies/query?name=${searchInput}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
         });
         const actionsConfig = getActionsConfigObj();
         const tempOrders = configureActionsConfig(results, actionsConfig, sortConfig);

         // setLeads(tempLeads);
         setSearchResults(tempOrders);
      },
      [searchInput],
      500
   );

   const fetchUtilityCompanies: any = async (offset: number, order: Array<Array<string>> | null) => {
      const token = user?.token;
      return await fetchDbApi(`/api/v2/utility-companies/query`, {
         method: 'POST',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
         cache: 'no-store',
         body: JSON.stringify({
            limit: defaultFetchLimit,
            offset: offset,
            order: order || [['name', 'ASC']],
            include: [{ model: 'statesLookup', as: 'state', required: false }],
         }),
      }).catch((err) => console.log('err:', err));
   };

   useEffect(() => {
      async function runAsync() {
         if (paginationConfig?.fetch) {
            let order: any;
            let colToOrderBy: any;

            const { column, sortType } = sortConfig;
            colToOrderBy = column.keyPath ? column.keyPath[0] : 'name';

            if (sortType === 0) order = [[colToOrderBy, 'ASC']];
            else order = [[colToOrderBy, 'DESC']];

            const newUtilCompanies = await fetchUtilityCompanies(paginationConfig?.offset, order);
            const actionsConfig = getActionsConfigObj();
            const utilCompaniesToAdd = configureActionsConfig(newUtilCompanies, actionsConfig, sortConfig);
            dispatch(setPageContext({ utilityCompanies: [...contextData?.utilityCompanies, ...utilCompaniesToAdd] }));
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

            colToOrderBy = column.keyPath ? column.keyPath[0] : 'name';

            if (sortType === SortingType.ASC) order = [[colToOrderBy, 'ASC']];
            else order = [[colToOrderBy, 'DESC']];

            // reset the pagination config
            setPaginationConfig(defaultPaginationConfig);

            const newUtilCompanies = await fetchUtilityCompanies(defaultPaginationConfig?.offset, order);
            const actionsConfig = getActionsConfigObj();
            const utilCompaniesToAdd = configureActionsConfig(newUtilCompanies, actionsConfig, sortConfig);

            dispatch(setPageContext({ utilityCompanies: utilCompaniesToAdd }));
            setSortConfig((prevState: SortingConfiguration) => ({ ...prevState, fetch: false }));
         }
      }
      runAsync();
   }, [sortConfig]);

   const handleSearchInput = (e: any) => {
      const searchVal = e.target.value;
      setSearchInput(searchVal);
      // const { utilityCompanies } = contextData;
      // const tempUtilityCompanies = [...utilityCompanies].filter((uc: any) => uc.name.includes(searchVal));
      // setSearchResults(tempUtilityCompanies);
   };

   const handleActionClick = async ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            const url = `/admin/utility-companies/${item?.id}`;
            await revalidate({ path: url });
            router.push(url);
            break;
         case 'delete':
            setUtilityCompanyToRemove(item);
            setOpenConfirmModal(true);
            break;
         default:
            break;
      }
   };

   const handleArchiveUtilityCompany = async (id: number) => {
      if (!id) return;
      const userAuthToken = user.token;
      fetchDbApi(`/api/v2/utility-companies/${id}`, {
         method: 'DELETE',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userAuthToken}` },
      })
         .then((res: any) => {
            const tempUtilityCompanies = [...contextData?.utilityCompanies].filter(
               (utilCompany: any) => utilCompany.id !== id
            );

            dispatch(setPageContext({ utilityCompanies: tempUtilityCompanies }));
            dispatch(
               setAddToast({
                  details: [{ label: 'Success', text: 'Utility Company Successfully Deleted' }],
                  iconName: 'CheckMarkCircle',
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
         })
         .catch((err: any) => {
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

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button
                     data-test={'createBtn'}
                     iconName={'Plus'}
                     color={'blue'}
                     onClick={(e: any) => {
                        router.push('/admin/utility-companies/new');
                     }}>
                     New Utility Company
                  </Button>
                  {console.log('searchResults:', searchResults)}
                  <SearchBar
                     placeholder='Search'
                     searchValue={searchInput}
                     handleChange={handleSearchInput}
                     searchResults={searchResults}
                     onSelectSearchResult={async (e: any, result: any) => {
                        const url = `/admin/utility-companies/${result.id}`;
                        await revalidate({ path: url });
                        if (result.id) router.push(url);
                     }}
                     keyPath={['name']}
                  />
               </>
            }>
            <Table
               columns={columns}
               data={contextData?.utilityCompanies}
               sortingConfig={sortConfig}
               onTableSort={(column, direction, sortedData) => {
                  setSortConfig({ column: column, sortType: direction, fetch: true });
               }}
               pagination
               paginationTotalCount={contextData?.totalUtilCompanyCount}
               onPaginate={(paginationOptions, pageState) => {
                  const { rowsPerPage } = paginationOptions;
                  const { currPage, prevPage } = pageState;
                  if (currPage != prevPage) {
                     // page change
                     let on2ndToLastPage = false;
                     const dataLength = contextData?.utilityCompanies?.length;
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
               // emptyStateDisplayText={'No Utility Companies Created Yet...'}
               actions={[
                  { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Utility Company', callback: handleActionClick },
                  {
                     icon: 'TrashCan',
                     actionKey: 'delete',
                     toolTip: 'Delete Utility Company',
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
               handleArchiveUtilityCompany(utilityCompanyToRemove.id);
            }}
            value={'utility company, "' + utilityCompanyToRemove?.name + '"'}
         />
      </>
   );
};

export default UtilityCompaniesClient;
