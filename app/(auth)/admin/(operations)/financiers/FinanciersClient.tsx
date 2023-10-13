'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Button from '../../../../../common/components/button/Button';
import ConfirmModal from '../../../../../common/components/confirm-modal/ConfirmModal';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import SearchBar from '../../../../../common/components/search-bar/SearchBar';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { selectPageContext, setPageContext } from '../../../../../store/slices/pageContext';
import { setAddToast } from '../../../../../store/slices/toast';
import { selectUser } from '../../../../../store/slices/user';
import { fetchDbApi, revalidate } from '@/serverActions';

const columns: ColumnType[] = [
   { keyPath: ['name'], title: 'Utitlity Company Name', colSpan: 2 },
   {
      keyPath: ['loanTermInYears'],
      title: 'Term',
      colSpan: 1,
      render: ({ item }) => (item?.loanTermInYears ? item?.loanTermInYears : 0),
   },
   {
      keyPath: ['interestRate'],
      title: 'Rate',
      colSpan: 1,
      render: ({ item }) => (item?.interestRate ? item?.interestRate : 0),
   },
   {
      keyPath: ['dealerFee'],
      title: 'Dealer Fee',
      colSpan: 1,
      render: ({ item }) => (item?.dealerFee ? item?.dealerFee : 0),
   },
   {
      keyPath: ['paymentFactorOne'],
      title: 'Payment Factor',
      colSpan: 1,
      render: ({ item }) => (item?.dealerFee ? item?.dealerFee : 0),
   },
];

interface Props {}
const FinanciersClient = ({}: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const contextData = useAppSelector(selectPageContext);
   const dispatch = useAppDispatch();
   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<Array<string>>([]);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [utilityCompanyToRemove, setUtilityCompanyToRemove] = useState<any>({});

   useEffect(() => {
      const tempUtilityCompanies = [...contextData?.financiers].map((financier: any) => {
         return { ...financier, actionsConfig: { delete: true, edit: true } };
      });
      dispatch(setPageContext({ financiers: tempUtilityCompanies }));
   }, []);

   const handleSearchInput = (e: any) => {
      const searchVal = e.target.value;
      setSearchInput(searchVal);
      const { financiers } = contextData;
      const searchTempUtilityCompanies = [...financiers].filter((uc: any) => uc.name.includes(searchVal));
      setSearchResults(searchTempUtilityCompanies);
   };

   const handleActionClick = ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            const url = `/admin/financiers/${item.id}`;
            revalidate({ path: url });
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

   const handleArchive = async (id: number) => {
      if (!id) return;
      const userAuthToken = user.token;

      await fetchDbApi(`/api/v2/financiers/${id}`, {
         method: 'DELETE',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userAuthToken}` },
      })
         .then((res: any) => {
            const tempFinancier = [...contextData?.financiers].filter((tempFinancier: any) => tempFinancier.id !== id);
            dispatch(
               setPageContext({
                  financiers: tempFinancier,
               })
            );
            dispatch(
               setAddToast({
                  details: [{ label: 'Success', text: 'Financier Successfully Deleted' }],
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
                        router.push('/admin/financiers/new');
                     }}>
                     New Utility Company
                  </Button>
                  <SearchBar
                     placeholder='Search'
                     searchValue={searchInput}
                     handleChange={handleSearchInput}
                     searchResults={searchResults}
                     onSelectSearchResult={(e: any, result: any) => {
                        const url = `/admin/utility-companies/${result.id}`;
                        revalidate({ path: url });
                        if (result?.id) router.push(url);
                     }}
                     keyPath={['name']}
                  />
               </>
            }>
            <Table
               columns={columns}
               data={contextData?.financiers}
               pagination
               actions={[
                  { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Financier', callback: handleActionClick },
                  {
                     icon: 'TrashCan',
                     actionKey: 'delete',
                     toolTip: 'Delete Financier',
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
               handleArchive(utilityCompanyToRemove.id);
            }}
            value={'utility company, "' + utilityCompanyToRemove?.name + '"'}
         />
      </>
   );
};

export default FinanciersClient;
