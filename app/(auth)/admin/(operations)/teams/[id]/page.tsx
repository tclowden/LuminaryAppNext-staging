import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../../providers/PageProvider';
import TeamClient from './TeamClient';

interface Props {
   params: { id: string };
   searchParams?: { type: string };
}

const Team = async ({ params }: Props) => {
   const teamId = params.id !== 'new' ? params.id : null;
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   const teamTypesRes: any = fetchTeamTypes(authToken);
   const productsRes: any = fetchProducts(authToken);
   const usersRes: any = fetchUsers(authToken);

   let teamRes: any = null;
   if (teamId) teamRes = fetchTeam(authToken, teamId);
   else teamRes = { teamUsers: [], teamProducts: [] };

   const [teamTypes, products, team, users] = await Promise.allSettled([teamTypesRes, productsRes, teamRes, usersRes])
      .then(handleResults)
      .catch((err) => {
         console.log('err:', err);
      });

   return (
      <PageProvider
         enablePageContext
         defaultPageContext={{
            teamTypes: teamTypes,
            products: products,
            users: users,
            team: team,
         }}>
         <TeamClient />
      </PageProvider>
   );
};

export default Team;

const fetchTeam = async (token: string | undefined, teamId: string | undefined) => {
   return await fetch(`${process.env.CLIENT_SITE}/api/v2/teams/${teamId}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   })
      .then((res) => {
         if (res.ok) return res.json();
         else console.log('res was not okay...', res);
      })
      .catch((err) => {
         console.log('err in team page with id:', teamId, ' err -->', err);
      });
};

const fetchTeamTypes = async (token: string | undefined) => {
   return await fetch(`${process.env.CLIENT_SITE}/api/v2/team-types`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      // cache: 'no-store',
   })
      .then((res: any) => {
         if (res.ok) return res.json();
         else console.log('res was not okay...', res);
      })
      .catch((err: any) => {
         console.log('err:', err);
      });
};

const fetchProducts = async (token: string | undefined) => {
   const bodyData = { order: [['createdAt', 'ASC']] };
   return await fetch(`${process.env.CLIENT_SITE}/api/v2/products/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify(bodyData),
   })
      .then((res: any) => {
         if (res.ok) return res.json();
         else console.log('res was not okay...', res);
      })
      .catch((err: any) => {
         console.log('err:', err);
      });
};

const fetchUsers = async (token: string | undefined) => {
   return await fetch(`${process.env.CLIENT_SITE}/api/v2/users`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   })
      .then((res: any) => {
         if (res.ok) return res.json();
         else console.log('res was not okay...', res);
      })
      .catch((err: any) => {
         console.log('err:', err);
      });
};

const handleResults = (results: any) => results.map((result: any) => result.status === 'fulfilled' && result.value);
