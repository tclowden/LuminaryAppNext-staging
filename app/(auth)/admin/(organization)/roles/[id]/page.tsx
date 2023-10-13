import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../../providers/PageProvider';
import RoleClient from './RoleClient';
import { redirect } from 'next/navigation';

interface Props {
   params: { id: string };
   searchParams?: { type: string };
}

const Role = async ({ params }: Props) => {
   const roleId = params.id !== 'new' ? params.id : null;
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   const usersDataRes: any = fetchUsers(authToken);
   const pagesDataRes: any = fetchPages(authToken);

   let roleDataRes: any = null;
   if (roleId) {
      // get the role data
      roleDataRes = fetchRole(authToken, roleId);
   } else {
      roleDataRes = [{ permissionsOnRole: [], usersOnRole: [] }];
   }

   // fetching data in parallel
   const [roles, users, pages] = await Promise.allSettled([roleDataRes, usersDataRes, pagesDataRes])
      .then(handleResults)
      .catch((err) => {
         console.log('err', err);
      });

   // this mean that the id doesn't exist... let's just create a new role
   // this might happen if someone tries to hardcode in the url to the super admin role
   if (roleId && !roles?.length) return redirect('/admin/roles/new');

   return (
      <PageProvider>
         <RoleClient role={roles[0]} users={users} pages={pages} />
      </PageProvider>
   );
};

export default Role;

const fetchUsers = (token: string | undefined) => {
   return fetch(`${process.env.CLIENT_SITE}/api/v2/users`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   })
      .then((res) => {
         if (res.ok) return res.json();
         else console.log('res was not okay...', res);
      })
      .catch((err) => {
         console.log('err:', err);
      });
};

const fetchPages = (authToken: string | undefined) => {
   return fetch(`${process.env.CLIENT_SITE}/api/v2/pages/query`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
         where: {
            name: {
               '[Op.notIn]': ['Dev'],
            },
         },
         order: [['displayOrder', 'ASC']],
         include: [
            {
               model: 'permissions',
               required: false,
               include: [{ model: 'roles', required: false }],
            },
         ],
      }),
   })
      .then((res) => {
         if (res.ok) return res.json();
         else console.log('res not okay...', res);
      })
      .catch((err) => console.log('err:', err));
};

const fetchRole = (token: string | undefined, roleId: string) => {
   return fetch(`${process.env.CLIENT_SITE}/api/v2/roles/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
         where: {
            id: roleId,
            name: {
               '[Op.notIn]': ['Super Admin', 'Super Secret Dev'],
            },
         },
         include: [
            {
               model: 'rolesOnUsers',
               required: false,
               as: 'usersOnRole',
               include: [{ model: 'users', as: 'user', required: false }],
            },
            {
               model: 'permissionsOnRoles',
               as: 'permissionsOnRole',
               required: false,
               include: [{ model: 'permissions', required: false, as: 'permission' }],
            },
         ],
      }),
   })
      .then((res) => {
         if (res.ok) return res.json();
         else console.log('res was not okay...', res);
      })
      .catch((err) => {
         console.log('err:', err);
      });
};

const handleResults = (results: any) => results.map((result: any) => result.status === 'fulfilled' && result.value);
