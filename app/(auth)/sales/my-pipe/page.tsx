import React from 'react'
import Breadcrumbs from '../../../../features/components/breadcrumbs/Breadcrumbs';
import Link from 'next/link';

const Page = () => {
   return (
      <>
         <Breadcrumbs></Breadcrumbs>
         <div>My Pipe</div>
         <Link href="sales/my-pipe/test">Go to Test Page</Link>
      </>
   );
};

export default Page;
