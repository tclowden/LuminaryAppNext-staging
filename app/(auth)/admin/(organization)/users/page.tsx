import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import UsersClient from './UsersClient';
import { fetchDbApi } from '@/serverActions';

const Users = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   const users: Array<any> = await fetchUsers(authToken);
   const userCount: number = await fetchUserCount(authToken);

   return (
      <PageProvider>
         <UsersClient allUsers={users} totalUserCount={userCount} />
      </PageProvider>
   );
};

export default Users;

const fetchUserCount = async (token: undefined | string) => {
   return await fetchDbApi(`/api/v2/users/count`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
   }).catch((err: any) => {
      console.log('err counting leads:', err);
   });
};

const fetchUsers = async (token: string | undefined) => {
   return fetchDbApi(`/api/v2/users/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
         limit: 100,
         offset: 0,
         order: [['firstName', 'ASC']],
         include: [
            {
               model: 'rolesOnUsers',
               required: false,
               as: 'rolesOnUser',
               include: [
                  {
                     model: 'roles',
                     as: 'role',
                     required: false,
                  },
               ],
            },
         ],
      }),
   }).catch((err) => console.log('err:', err));
};
