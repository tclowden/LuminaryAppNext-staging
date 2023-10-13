import PageProvider from '@/providers/PageProvider';
import { cookies } from 'next/headers';
import ManualDialClient from './ManualDialClient';
export const dynamic = 'force-dynamic';

const ManualDial = () => {
   const nextCookies = cookies();
   return (
      <PageProvider>
         <ManualDialClient />
      </PageProvider>
   );
};

export default ManualDial;
