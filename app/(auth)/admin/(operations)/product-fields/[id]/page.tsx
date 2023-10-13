import React from 'react';
import PageProvider from '../../../../../../providers/PageProvider';
import FieldClient from './FieldClient';
import { cookies } from 'next/headers';
import { fetchDbApi } from '@/serverActions';

interface Props {
   params: { id: string };
   searchParams?: { type: string };
}

const Field = async ({ params, searchParams }: Props) => {
   const fieldId = params.id !== 'new' ? params.id : null;
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   // get all input types from the db
   const fieldTypesRes: any = fetchFieldTypes(authToken);
   // get all configuredLists from the db
   const configuredListsRes: any = fetchConfiguredLists(authToken);
   // get all roles form the db
   const rolesRes: any = fetchRoles(authToken);

   let fieldDataRes: any = null;
   if (fieldId) {
      // we want to update the field... get the field data by id
      fieldDataRes = fetchField(authToken, fieldId);
   } else {
      fieldDataRes = { productFieldOptions: [] };
   }

   // fetching data in parallel
   const [fieldTypes, fieldData, configuredLists, roles] = await Promise.allSettled([
      fieldTypesRes,
      fieldDataRes,
      configuredListsRes,
      rolesRes,
   ])
      .then(handleResults)
      .catch((err) => {
         console.log('err', err);
      });

   const showOptions =
      fieldData?.fieldType?.name === 'Dropdown' || fieldData?.fieldType?.name === 'Checkbox' ? true : false;

   if (fieldData?.whereCondition && !!roles?.length) {
      // figure out what configured list it's for
      if (fieldData?.configuredList?.tableName === 'users') {
         const tempRoles = fieldData?.whereCondition?.roleId?.map((roleId: any) => {
            const found = roles.find((role: any) => role?.id === roleId);
            return found;
         });
         fieldData['whereCondition'] = { listType: 'users', roles: tempRoles };
      } else if (fieldData?.configuredList?.tableName === 'proposalOptions') {
         const name = Object.keys(fieldData?.whereCondition)[0] === 'leadId' ? 'Lead' : null;
         fieldData['whereCondition'] = { listType: 'proposalOptions', fkToGroupBy: { name: name } };
      }
   }

   return (
      <PageProvider>
         <FieldClient
            field={fieldData}
            fieldTypes={fieldTypes}
            configuredLists={configuredLists}
            showOptionsDefault={showOptions}
            roles={roles}
         />
      </PageProvider>
   );
};

export default Field;

const fetchFieldTypes = (token: string | undefined) => {
   return fetchDbApi(`/api/v2/field-types`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err:', err);
   });
};

const fetchConfiguredLists = (token: string | undefined) => {
   return fetchDbApi(`/api/v2/configured-lists`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err:', err);
   });
};

const fetchRoles = (token: string | undefined) => {
   return fetchDbApi(`/api/v2/roles/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
         where: {
            name: {
               '[Op.notIn]': ['Default Role', 'Super Secret Dev'],
            },
         },
      }),
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err:', err);
   });
};

const fetchField = (token: string | undefined, fieldId: number | string) => {
   return fetchDbApi(`/api/v2/products/fields/${fieldId}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err:', err);
   });
};

const handleResults = (results: any) => results.map((result: any) => result.status === 'fulfilled' && result.value);
