import { cookies } from 'next/headers';
import LeadStatusClient from './LeadStatusClient';
import { fetchDbApi } from '@/serverActions';

interface Props {
   params: { id: string };
}

const LeadStatus = async ({ params }: Props) => {
   const leadStatusId = params.id !== 'new' ? params.id : null;

   const singleStatusInfo = await fetchDbApi(`${process.env.CLIENT_SITE}/api/v2/statuses/${leadStatusId}`, {
      method: 'GET',
      cache: 'no-store',
   }).then((response) => response);

   const statusRuleTypes = await fetchDbApi(`${process.env.CLIENT_SITE}/api/v2/statuses/rules/types`, {
      method: 'GET',
      cache: 'no-store',
   }).then((response) => response);

   return <LeadStatusClient leadStatus={singleStatusInfo} statusRuleTypes={statusRuleTypes} />;
};

export default LeadStatus;
