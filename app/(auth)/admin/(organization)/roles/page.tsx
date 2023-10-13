import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import RolesClient from './RolesClient';

const Roles = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   const roles: Array<any> = await fetchRoles(authToken);
   return (
      <PageProvider>
         <RolesClient allRoles={roles} />
      </PageProvider>
   );
};

export default Roles;

const fetchRoles = async (token: string | undefined) => {
   return fetch(`${process.env.CLIENT_SITE}/api/v2/roles/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
         where: {
            name: {
               '[Op.notIn]': ['Super Secret Dev'],
            },
         },
         order: [['name', 'ASC']],
         include: [{ model: 'rolesOnUsers', required: false, as: 'rolesOnUser' }],
         // include: [{ model: 'users', required: false }],
      }),
   })
      .then((res) => {
         if (res.ok) return res.json();
         else console.log('res not okay...', res);
      })
      .catch((err) => console.log('err:', err));
};
