import React from 'react';
import PageProvider from '../../../../../../providers/PageProvider';
import CoordinatorClient from './CoordinatorClient';
import { cookies } from 'next/headers'; // I
import { fetchDbApi } from '@/serverActions';

interface Props {
   params: { id: string };
   searchParams?: { type: string };
}

const Coordinator = async ({ params, searchParams }: Props) => {
   const coordinatorId = params.id !== 'new' ? params.id : null;
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   // get all input types from the db
   const rolesRes: any = fetchRoles(authToken);

   let coordinatorDataRes: any = null;
   if (coordinatorId) {
      // we want to update
      coordinatorDataRes = fetchCoordinator(authToken, coordinatorId);
   } else {
      // set default values
      coordinatorDataRes = { rolesOnProductCoordinator: [] };
   }

   // fetching data in parallel
   const [roles, coordinatorData] = await Promise.allSettled([rolesRes, coordinatorDataRes])
      .then(handleResults)
      .catch((err) => {
         console.log('err', err);
      });

   return (
      <PageProvider>
         <CoordinatorClient roles={roles} coordinator={coordinatorData} />
      </PageProvider>
   );
};

export default Coordinator;

const fetchRoles = (token: string | undefined) => {
   return fetchDbApi(`/api/v2/roles/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
         where: {
            name: {
               '[Op.notIn]': ['Super Secret Dev', 'Default Role'],
            },
         },
         order: [['name', 'ASC']],
      }),
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err:', err);
   });
};

const fetchCoordinator = (token: string | undefined, coordinatorId: number | string) => {
   return fetchDbApi(`/api/v2/products/coordinators/${coordinatorId}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      // how should we handle errors if here??
      console.log('err:', err);
   });
};

const handleResults = (results: any) => results.map((result: any) => result.status === 'fulfilled' && result.value);
