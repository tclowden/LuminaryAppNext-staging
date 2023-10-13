'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Button from '../../../../../common/components/button/Button';
import Icon from '../../../../../common/components/Icon';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import SearchBar from '../../../../../common/components/search-bar/SearchBar';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { selectUser } from '../../../../../store/slices/user';
import ConfirmModal from '../../../../../common/components/confirm-modal/ConfirmModal';
import { setAddToast } from '../../../../../store/slices/toast';
import { revalidate } from '@/serverActions';

const columns: ColumnType[] = [
   {
      keyPath: ['iconName'],
      title: 'Icon',
      colSpan: 1,
      render: ({ item }: any) => {
         return <Icon color={item.iconColor} name={item.iconName} width={20} height={20} />;
      },
   },
   { keyPath: ['name'], title: 'Product Name', colSpan: 2 },
   { keyPath: ['fieldsOnProductCount'], title: 'Fields', colSpan: 1 },
   { keyPath: ['stagesOnProductCount'], title: 'Stages', colSpan: 1 },
   { keyPath: ['tasksOnProductCount'], title: 'Tasks', colSpan: 1 },
   { keyPath: ['coordinatorsOnProductCount'], title: 'Coordinators', colSpan: 1 },
   {
      keyPath: ['primary'],
      title: 'Primary?',
      colSpan: 1,
      render: ({ item }: any) => (item.primary ? 'Yes' : 'No'),
   },
];

//
interface Props {
   allProducts: Array<any>;
}

const ProductsClient = ({ allProducts }: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const [products, setProducts] = useState<any[]>(allProducts?.length ? [...allProducts] : []);
   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<Array<string>>([]);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [prodToRemove, setProdToRemove] = useState<any>({});

   useEffect(() => {
      setProducts((prevState: Array<any>) => {
         return [...prevState].map((product: any) => {
            return {
               ...product,
               actionsConfig: { delete: true, edit: true },
            };
         });
      });
   }, []);

   const handleSearchInput = (e: any) => {
      const searchVal = e.target.value;
      setSearchInput(searchVal);
      const tempProducts = [...products].filter((product: any) => product.name.includes(searchVal));
      setSearchResults([...tempProducts]);
   };

   const handleArchiveProduct = async (id: number) => {
      if (!id) return;
      const userAuthToken = user.token;
      if (!userAuthToken) return;

      // archive the product by the id
      await axios
         .delete(`/api/v2/products/${id}`, {
            headers: { Authorization: `Bearer ${userAuthToken}` },
         })
         .then((res) => {
            console.log('Result archiving product:', res);
            setProducts((prevState: Array<any>) => {
               return [...prevState].filter((stage: any) => stage.id !== id);
            });
            dispatch(
               setAddToast({
                  details: [{ label: 'Success', text: 'Product Successfully Deleted' }],
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

   const handleActionClick = async ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            const url = `/admin/products/${item.id}`;
            await revalidate({ path: url });
            router.push(url);
            break;
         case 'delete':
            setProdToRemove(item);
            setOpenConfirmModal(true);
            // handleArchiveProduct(item.id);
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
                        router.push(`/admin/products/new`);
                     }}>
                     New Product
                  </Button>
                  <SearchBar
                     placeholder={'Search Products...'}
                     searchValue={searchInput}
                     handleChange={handleSearchInput}
                     searchResults={searchResults}
                     onSelectSearchResult={(e: any, result: any) => {
                        if (result.id) router.push(`/admin/products/${result.id}`);
                        else console.log('hmmm.... no product id for result:', result);
                     }}
                     keyPath={['name']}
                  />
               </>
            }>
            <Table
               columns={columns}
               data={products}
               pagination
               emptyStateDisplayText={'No Products Created Yet...'}
               actions={[
                  { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Product', callback: handleActionClick },
                  { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Product', callback: handleActionClick },
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
               handleArchiveProduct(prodToRemove.id);
            }}
            value={'product, "' + prodToRemove?.name + '"'}
         />
      </>
   );
};

export default ProductsClient;
