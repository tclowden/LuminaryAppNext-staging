import { fetchDbApi } from '@/serverActions';
import { cookies } from 'next/headers';
import React from 'react';
import { FieldType } from '../../../../../../common/types/Leads';
import PageProvider from '../../../../../../providers/PageProvider';
import { getObjectProp } from '../../../../../../utilities/helpers';
import LeadFieldClient from './LeadFieldClient';

interface Props {
   params: { id: string };
}

const LeadField = async ({ params }: Props) => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   if (!authToken) {
      console.log('hmmm... how to handle this err?');
   }
   const leadFieldId = params.id !== 'new' ? params.id : null;

   const getLeadField = () => {
      return fetchDbApi(`/api/v2/leads/lead-fields/${leadFieldId}`, {
         method: 'GET',
      }).catch((err) => console.error('err', err));
   };

   const getFieldTypes = () => {
      return fetchDbApi(`/api/v2/field-types`, {
         method: 'GET',
      }).catch((err) => console.log('err:', err));
   };

   const handleResults = (results: any) => {
      return results.map((result: any) => {
         if (result.status === 'fulfilled') return result.value;
      });
   };

   let fieldTypes: any = {};
   let leadField: any = {};
   await Promise.allSettled(leadFieldId ? [getFieldTypes(), getLeadField()] : [getFieldTypes()]).then(
      (results: any) => {
         const [fieldTypesResult, leadFieldResult] = handleResults(results);
         if (fieldTypesResult?.length) {
            fieldTypes = fieldTypesResult
               .filter((fieldType: FieldType) => fieldType.name !== 'Checkbox')
               .map((fieldType: FieldType) => ({
                  ...fieldType,
                  iconConfig: { name: fieldType?.iconName, color: fieldType?.iconColor },
               }));
         }
         if (leadFieldResult) {
            leadField = {
               ...leadFieldResult,
               fieldType: {
                  ...getObjectProp(leadFieldResult, ['fieldType']),
                  iconConfig: {
                     name: getObjectProp(leadFieldResult, ['fieldType', 'iconName']),
                     color: getObjectProp(leadFieldResult, ['fieldType', 'iconColor']),
                  },
               },
            };
         }
      }
   );

   return (
      <PageProvider>
         <LeadFieldClient leadField={leadField} fieldTypes={!!fieldTypes?.length ? fieldTypes : []} />
      </PageProvider>
   );
};

export default LeadField;
