import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import ProductsClient from './ProductsClient';
import { fetchDbApi } from '@/serverActions';

const Page = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const allProducts: Array<any> = await fetchProducts(authToken);

   return (
      <PageProvider>
         <ProductsClient allProducts={allProducts} />
      </PageProvider>
   );
};

export default Page;

const fetchProducts: any = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/products`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err:', err);
   });
};
