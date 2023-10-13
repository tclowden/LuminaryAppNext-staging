import { cookies } from 'next/headers';
import LeadsClient from './LeadsClient';
import PageProvider from '@/providers/PageProvider';
import { fetchDbApi } from '@/serverActions';

const Leads = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   const totalLeadCount: any = await fetchLeadCount(authToken);
   const allLeads: any = await fetchLeads(authToken);

   return (
      <PageProvider>
         <LeadsClient allLeads={allLeads} totalLeadCount={totalLeadCount} />
      </PageProvider>
   );
};

export default Leads;

const fetchLeadCount = async (token: undefined | string) => {
   return await fetchDbApi(`/api/v2/leads/count`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err: any) => {
      console.log('err counting leads:', err);
   });
};

const fetchLeads = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/leads/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
         include: [
            { model: 'leadSources', as: 'leadSource', required: false }, // for some reason this broke leads for me
            { model: 'statuses', as: 'status', required: false },
            { model: 'users', as: 'owner', required: false },
            { model: 'users', as: 'createdBy', required: false },
            { model: 'users', as: 'setterAgent', required: false },
            {
               model: 'fieldsOnLeads',
               include: [{ model: 'leadFields', as: 'leadField', required: false }],
               required: false,
            },
         ],
         order: [['createdAt', 'DESC']],
         limit: 100,
      }),
   }).catch((err: any) => {
      console.log('err:', err);
   });
};
