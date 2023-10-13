import React from 'react';
import PageProvider from '@/providers/PageProvider';
import SettingsClient from './SettingsClient';
import { cookies } from 'next/headers';

const SettingsPage = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   return (
      <PageProvider>
         <SettingsClient />
      </PageProvider>
   );
};

export default SettingsPage;
