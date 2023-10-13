import PageProvider from '@/providers/PageProvider';
import { fetchDbApi } from '@/serverActions';
import { cookies } from 'next/headers';
import React from 'react';
import MessagesClient from './MessagesClient';

const Page = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const messagesData = await fetchMessagesData(authToken);

   return (
      <PageProvider>
         <MessagesClient messagesData={!!messagesData?.length ? messagesData : []} />
      </PageProvider>
   );
};

export default Page;

const fetchMessagesData: any = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/sms-logs`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err: any) => {
      console.log('/api/v2/sms-logs -> Error:', err);
   });
};
