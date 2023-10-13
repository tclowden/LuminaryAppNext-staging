import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import FieldsClient from './FieldsClient';
import { cookies } from 'next/headers'; // Import cookies
import { fetchDbApi } from '@/serverActions';

const Fields = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   const allFields: Array<any> = await fetchFields(authToken);
   const fieldCount: any = await fetchFieldCount(authToken);

   return (
      // PAGE PROVIDER: validates the users permissions to required page permissions to give them access to the page or redirect them (fallback route)
      <PageProvider>
         <FieldsClient allFields={allFields} fieldCount={fieldCount} />
      </PageProvider>
   );
};

export default Fields;

const fetchFieldCount: any = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/products/fields/count`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err fetching all fields:', err);
   });
};

const fetchFields: any = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/products/fields/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
         limit: 100,
         offset: 0,
         include: [
            { model: 'fieldTypesLookup', as: 'fieldType', required: false },
            { model: 'productsLookup', as: 'productsLookup', required: false },
         ],
         order: [['createdAt', 'ASC']], // order by created at ASC
      }),
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err fetching all fields:', err);
   });
};
