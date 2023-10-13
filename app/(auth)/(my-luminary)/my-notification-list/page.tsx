import PageProvider from '@/providers/PageProvider';
import React from 'react';
import MyNotificationListClient from './MyNotificationListClient';
import { cookies } from 'next/headers';
import { fetchDbApi } from '@/serverActions';

interface Props {}
const MyNotificationList = async ({}: Props) => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value || '';
   const myNotifications: Array<any> = await fetchUserNotifications(authToken);

   return (
      <PageProvider enablePageContext defaultPageContext={{ myNotifications }}>
         <MyNotificationListClient />
      </PageProvider>
   );
};

export default MyNotificationList;

const fetchUserNotifications: any = async (token: string) => {
   return fetchDbApi(`/api/v2/notifications/my`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err: any) => {
      console.log('error fetching user notifications', err);
   });
};
