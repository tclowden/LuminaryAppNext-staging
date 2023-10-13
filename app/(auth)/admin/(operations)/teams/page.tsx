import { cookies } from 'next/headers';
import React from 'react';
import Breadcrumbs from '../../../../../features/components/breadcrumbs/Breadcrumbs';
import PageProvider from '../../../../../providers/PageProvider';
import TeamsClient from './TeamsClient';

const Teams = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const allTeams: Array<any> = await fetchTeams(authToken);

   return (
      <PageProvider enablePageContext defaultPageContext={{ teams: allTeams }}>
         <TeamsClient />
      </PageProvider>
   );
};

export default Teams;

const fetchTeams: any = async (token: string | undefined) => {
   return await fetch(`${process.env.CLIENT_SITE}/api/v2/teams`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   })
      .then((res) => {
         if (res.ok) return res.json();
         else console.log('res was not okay...', res);
      })
      .catch((err) => {
         // how should we handle errors if here??
         console.log('err:', err);
      });
};
