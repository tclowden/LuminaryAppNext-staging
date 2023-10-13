import { cookies } from 'next/headers';
import PageProvider from '../../../../providers/PageProvider';
import PagesClient from './PagesClient';
import { fetchDbApi } from '@/serverActions';

const Pages = async () => {
   // const isDevelopmentEnv = process?.env?.NODE_ENV === 'development';
   // if (!isDevelopmentEnv) {
   //    return (
   //       <PageProvider>
   //          <div>This page doesn't exist in production.</div>
   //       </PageProvider>
   //    );
   // }

   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const allPagesData = await fetchDbApi(`${process.env.CLIENT_SITE}/api/v2/pages`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
   });

   return (
      <PageProvider>
         <PagesClient allPages={allPagesData}></PagesClient>
      </PageProvider>
   );
};

export default Pages;
