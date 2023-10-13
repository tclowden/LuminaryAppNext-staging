import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import ProposalSettingsClient from './ProposalSettingsClient';

const ProposalSettings = async () => {
   return (
      <PageProvider>
         <ProposalSettingsClient />
      </PageProvider>
   );
};

export default ProposalSettings;
