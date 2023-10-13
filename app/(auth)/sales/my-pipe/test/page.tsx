import React from 'react'
import Breadcrumbs from '../../../../../features/components/breadcrumbs/Breadcrumbs';
import Link from 'next/link';

const Page = () => {
   return (
      <>
         <Breadcrumbs></Breadcrumbs>
         <div>Test</div>
         <Link href="sales/my-pipe/test/another">Go to Another test page</Link>
      </>
   );
};

export default Page;
