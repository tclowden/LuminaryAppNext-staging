import { fetchDbApi } from '@/serverActions';
import PageProvider from '../../../../../providers/PageProvider';
import AllNumbersClient from './AllNumbersClient';
export const dynamic = 'force-dynamic';

const AllNumbers = async () => {
   const [phoneNumbersData, phoneNumberTypesData, usersData, leadSourcesData, statesData] = await Promise.all([
      fetchPhoneNumbers(),
      fetchPhoneNumberTypes(),
      fetchUsers(),
      fetchLeadSources(),
      fetchStates(),
   ]);

   return (
      <PageProvider>
         <AllNumbersClient
            phoneNumbersData={phoneNumbersData?.length ? phoneNumbersData : []}
            phoneNumberTypes={phoneNumberTypesData?.length ? phoneNumberTypesData : []}
            users={usersData?.length ? usersData : []}
            leadSources={leadSourcesData?.length ? leadSourcesData : []}
            states={statesData?.length ? statesData : []}
         />
      </PageProvider>
   );
};

export default AllNumbers;

const fetchPhoneNumbers = () => {
   return fetchDbApi(`/api/v2/phone-numbers`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};

const fetchPhoneNumberTypes = () => {
   return fetchDbApi(`/api/v2/phone-numbers/types`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};

const fetchUsers = () => {
   return fetchDbApi(`/api/v2/users`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};

const fetchLeadSources = () => {
   return fetchDbApi(`/api/v2/lead-sources`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};

const fetchStates = () => {
   return fetchDbApi(`/api/v2/states`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};
