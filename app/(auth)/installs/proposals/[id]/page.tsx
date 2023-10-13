import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import ConfigProposalClient from '../ConfigProposalClient';
import ViewProposalClient from '../ViewProposalClient';

interface Props {
   params: { id: string };
   searchParams?: { lead: string };
}

const NewProposal = ({ params, searchParams }: Props) => {
   const proposalId = params.id !== 'new' ? params.id : null;

   if (proposalId == null && searchParams?.lead == undefined) {
      throw new Error('Missing Lead id, or Proposal id');
   }

   return (
      <PageProvider>
         <ViewProposalClient proposalId={proposalId} leadId={searchParams?.lead} />
      </PageProvider>
   );
};

export default NewProposal;
