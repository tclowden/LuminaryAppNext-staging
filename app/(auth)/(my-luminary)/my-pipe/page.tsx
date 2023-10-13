import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../providers/PageProvider';
import MyPipeClient from './MyPipeClient';

const MyPipe = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const usersPipe: any = await fetchPipe(authToken);

   return (
      <PageProvider>
         <MyPipeClient myPipe={usersPipe?.length ? usersPipe : []} />
      </PageProvider>
   );
};

export default MyPipe;

const fetchPipe = async (token: string | undefined) => {
   return await fetch(`${process.env.CLIENT_SITE}/api/v2/leads/my/pipe`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   })
      .then((res) => {
         if (res.ok) return res.json();
         else console.log('res not okay...', res);
      })
      .catch((err) => console.log('err:', err));
};
