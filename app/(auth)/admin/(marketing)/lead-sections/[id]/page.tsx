import { fetchDbApi } from '@/serverActions';
import { cookies } from 'next/headers';
import ErrorClient from '../../../../../../common/components/error-client/ErrorClient';
import { LeadField } from '../../../../../../common/types/Leads';
import { getObjectProp } from '../../../../../../utilities/helpers';
import LeadFieldsSectionClient from './LeadFieldsSectionClient';

type Props = {
   params: { id: string };
};

const LeadFieldsSection = async ({ params }: Props) => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   if (!authToken) {
      console.log('hmmm... how to handle this err?');
   }
   const leadFieldsSectionId = params.id;

   if (!leadFieldsSectionId) return console.error('Id parameter is missing or invalid.');

   const getSectionData = () => {
      return fetchDbApi(`/api/v2/leads/sections/${leadFieldsSectionId}`, {
         method: 'GET',
      }).catch((err: any) => console.error('err', err));
   };

   const getLeadFieldsData = () => {
      return fetchDbApi(`/api/v2/leads/lead-fields`, {
         method: 'GET',
      }).catch((err) => console.error('err', err));
   };

   const handleResults = (results: any) => {
      return results.map((result: any) => {
         if (result.status === 'fulfilled') return result.value;
      });
   };

   const response = await Promise.allSettled([getSectionData(), getLeadFieldsData()]);
   const [sectionResults, leadFieldsResults] = handleResults(response);

   if (!sectionResults) return console.error(`Section with ID, "${leadFieldsSectionId}", does not exist.`);
   if (!sectionResults?.editable) return console.error(`Section, "${sectionResults?.name}", is not editable.`);
   if (!leadFieldsResults?.length)
      return (
         <ErrorClient
            errorMessage={`Looks like you don't have any Lead Fields`}
            primaryBtnText='Create Lead Field'
            primaryBtnRoute={'/admin/lead-fields/new'}
         />
      );

   const leadFieldsData = leadFieldsResults.map((leadField: LeadField) => ({
      ...leadField,
      fieldType: {
         ...getObjectProp(leadField, ['fieldType']),
         iconConfig: {
            name: getObjectProp(leadField, ['fieldType', 'iconName']),
            color: getObjectProp(leadField, ['fieldType', 'iconColor']),
         },
      },
   }));

   return <LeadFieldsSectionClient leadFieldsSectionData={sectionResults} leadFieldsData={leadFieldsData} />;
};

export default LeadFieldsSection;
