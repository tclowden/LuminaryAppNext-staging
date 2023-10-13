import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PageProvider from '../../../../../providers/PageProvider';
import LeadClient from './LeadClient';
import { fetchDbApi } from '@/serverActions';

const Lead = async ({ params }: { params: { id: string } }) => {
   if (!params.id) return redirect('/dashboard');

   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   const lead = await fetchLead(authToken, params?.id);
   if (!lead) return redirect('/dashboard');

   const pageContext = {
      lead: { ...lead, notesOnLead: [], attachmentsOnLead: [] },
      orders: [],
      products: [],
      financiers: [],
      utilityCompanies: [],
      proposals: [],
      notes: [],
      attachments: [],
      history: [],
      callLogs: [],
      // appointments: [...lead?.appointments],
      originalFieldsOnLeadData: [...lead?.fieldsOnLeads],
      newFieldsOnLeadData: [...lead?.fieldsOnLeads],
   };

   return (
      <PageProvider enablePageContext defaultPageContext={pageContext}>
         <LeadClient />
      </PageProvider>
   );
};

export default Lead;

const fetchLead = async (token: string | undefined, leadId: string) => {
   return await fetchDbApi(`/api/v2/leads/${leadId}`, {
      method: 'GET',
      headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      console.log('err:', err);
   });
};
