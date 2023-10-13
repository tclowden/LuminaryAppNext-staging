import React from 'react';
import PageProvider from '../../../../providers/PageProvider';
import PermissionsClient from './PermissionsClient';
import { cookies } from 'next/headers';

interface Props {}

const Permissions = async ({}: Props) => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   if (!authToken) {
      console.log('hmmm... how to handle this err?');
   }

   const allPermissions = await fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/permissions`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
   })
      .then(async (res) => {
         const results = await res.json();
         if (results.error) throw new Error(results.error.errorMessage);
         return results;
      })
      .catch((err) => {
         console.error('err', err);
      });

   return (
      <PageProvider>
         <PermissionsClient allPermissions={allPermissions} />
      </PageProvider>
   );
};

export default Permissions;
