import React from 'react';
import WorkOrdersClient from './WorkOrdersClient';
import { cookies } from 'next/headers';
import PageProvider from '../../../../providers/PageProvider';
import { fetchDbApi } from '@/serverActions';

const Page = async () => {
   const cookiesInstance = cookies();
   const authToken = cookiesInstance.get('LUM_AUTH')?.value;

   const orders = await getOrders(authToken);
   const orderCount = await getOrderCount(authToken);

   return (
      <PageProvider>
         <WorkOrdersClient allOrders={orders || []} totalOrderCount={orderCount} />
      </PageProvider>
   );
};

export default Page;

const getOrderCount = async (token: undefined | string) => {
   return await fetchDbApi(`/api/v2/orders/count`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
   }).catch((err: any) => {
      console.log('err counting leads:', err);
   });
};

const getOrders = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/orders/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
         limit: 100,
         offset: 0,
         order: [['createdAt', 'DESC']],
         include: [
            { model: 'users', as: 'owner', required: false },
            { model: 'users', as: 'createdBy', required: false },
            { model: 'productsLookup', as: 'product', required: false },
            { model: 'leads', as: 'lead', required: false },
            // {
            //    model: 'fieldsOnOrders',
            //    as: 'fieldsOnOrder',
            //    required: false,
            //    include: [
            //       {
            //          model: 'productFields',
            //          include: [{ model: 'fieldTypesLookup', as: 'fieldType', required: false }],
            //          as: 'productField',
            //       },
            //    ],
            // },
            { model: 'financiersLookup', as: 'financier', required: false },
            { model: 'utilityCompaniesLookup', as: 'utilityCompany', required: false },
         ],
      }),
   }).catch((err: any) => {
      console.log('err querying orders', err);
   });
};
