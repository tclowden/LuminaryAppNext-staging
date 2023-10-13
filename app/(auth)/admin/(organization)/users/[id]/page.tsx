import axios from 'axios';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../../providers/PageProvider';
import UserClient from './UserClient';
import { defaultCustomPermissions, defaultPagePermissions } from './(partials)/dummyData';
import { UserProps } from '../types';

interface Props {
   params: {
      id: string;
   };
}

const User = async ({ params }: Props) => {
   const userId = params.id !== 'new' ? params.id : null;
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   const rolesDataRes: any = fetchRoles(authToken);
   const officesDataRes: any = fetchOffices(authToken);

   let userDataRes: any = null;
   if (userId) userDataRes = fetchUser(authToken, userId);
   else userDataRes = {};

   let [user, roles, offices] = await Promise.allSettled([userDataRes, rolesDataRes, officesDataRes])
      .then(handleResults)
      .catch((err) => {
         console.log('err', err);
      });

   let userData;
   if (user?.length) userData = user[0];
   else {
      // add default role
      const defaultRole = roles.find((role: any) => role.name === 'Default Role');
      const defaultRoleOnUser = { roleId: defaultRole.id, role: defaultRole, id: null, userId: null, archived: false };
      userData = {
         rolesOnUser: [defaultRoleOnUser],
      };
   }

   const pageContext: UserProps = {
      userData: userData,
      rolesData: roles,
      officesData: offices,
      pagePermissions: defaultPagePermissions,
      customPermissions: defaultCustomPermissions,
   };

   return (
      <PageProvider enablePageContext defaultPageContext={pageContext}>
         <UserClient />
         {/* <UserClient
         // userData={userData} // needs at MINIMUM, an id to represent the user
         // rolesData={rolesData}
         // officesData={officesData}
         // pagePermissions={defaultPagePermissions}
         // customPermissions={defaultCustomPermissions}
         /> */}
      </PageProvider>
   );
};

export default User;

const fetchUser = (token: string | undefined, userId: string) => {
   return fetch(`${process.env.CLIENT_SITE}/api/v2/users/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
         where: { id: userId },
         attributes: { exclude: ['passwordHash'] },
         include: [
            {
               model: 'rolesOnUsers',
               as: 'rolesOnUser',
               required: false,
               include: [{ model: 'roles', as: 'role', required: false }],
            },
            { model: 'offices', as: 'office', required: false },
         ],
      }),
   })
      .then((res: any) => {
         if (res.ok) return res.json();
         else console.log('res was not okay...', res);
      })
      .catch((err) => {
         console.log('err:', err);
      });
};

const fetchRoles = (token: string | undefined) => {
   return fetch(`${process.env.CLIENT_SITE}/api/v2/roles/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
         where: {
            id: {
               '[Op.notIn]': ['b1421034-7ad9-40fc-bc3b-dc4f00c7e285'],
            },
         },
         order: [['name', 'ASC']],
      }),
   })
      .then((res: any) => {
         if (res.ok) return res.json();
         else console.log('res was not okay...', res);
      })
      .catch((err) => {
         console.log('err:', err);
      });
};

const fetchOffices = (token: string | undefined) => {
   return fetch(`${process.env.CLIENT_SITE}/api/v2/offices`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   })
      .then((res: any) => {
         if (res.ok) return res.json();
         else console.log('res was not okay...', res);
      })
      .catch((err) => {
         console.log('err:', err);
      });
};

const handleResults = (results: any) => results.map((result: any) => result.status === 'fulfilled' && result.value);
