import { cookies } from 'next/headers';
import React from 'react';
import Breadcrumbs from '../../../../../features/components/breadcrumbs/Breadcrumbs';
import PageProvider from '../../../../../providers/PageProvider';
import ProposalPricingClient from './ProposalPricingClient';

const ProposalPricing = async () => {
   return (
      <>
         <PageProvider>
            <ProposalPricingClient />
         </PageProvider>
      </>
   );
};

export default ProposalPricing;
