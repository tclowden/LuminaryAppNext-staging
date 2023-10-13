import { cookies } from 'next/headers';
import db from '@/sequelize/models';
import { fetchDbApi } from '@/serverActions';
import ProposalsClient from './ProposalsClient';

// EDIT
// /installs/proposals/edit/${id}

// CREATE
// /installs/proposals/new

// VIEW
// /installs/proposals/${id}

const Proposals = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const queueResponse = await fetchProposalQueueInfo(authToken);

   const queueInfo = queueResponse['proposalQueue'];
   const statusTypes = queueResponse['proposalStatusTypesLookup'];

   /*
   Here's what we're missing

   name -- lead name
   consultant -- consultant human readable
   proposal_type -- 'new' is an example
   due_in -- possibly due at


   We'll want to loop over it and put these in
   actionsConfig: { edit: true, duplicate: true, delete: true },
   
   */

   // I'm wanting queueInfo to look like this
   // const all_data = [
   //    {
   //       name: 'Jeremiah & Caryn Dempsey',
   //       consultant: 'Jacob Smiley',
   //       proposal_type: 'new',
   //       date_due: '12/07/2022 5:00 PM',
   //       due_in: '6 weeks ago',
   //       // actionsConfig: { edit: true, duplicate: true, delete: true },
   //    },
   //    {
   //       name: 'Nathan & April Zimmerman',
   //       consultant: 'Carlos Tremols',
   //       proposal_type: 'new',
   //       date_due: '12/07/2022 5:00 PM',
   //       due_in: '6 weeks ago',
   //       // actionsConfig: { edit: true, duplicate: true, delete: true },
   //    },
   // ];

   return <ProposalsClient queueInfo={queueInfo} statusTypes={statusTypes} />;
};

export default Proposals;

const fetchProposalQueueInfo = async (token: any) => {
   return fetchDbApi(`/api/v2/proposal-queue`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => console.log('err:', err));
};
