'use client';

import React, { useId } from 'react';
import Breadcrumbs from '../../../features/components/breadcrumbs/Breadcrumbs';

interface Props {
   breadcrumbsChildren?: JSX.Element | JSX.Element[];
   breadcrumbsTitle?: string;
   children: JSX.Element | JSX.Element[];
}

const PageContainer = ({ breadcrumbsChildren, breadcrumbsTitle, children }: Props) => {
   const id = useId();

   return (
      <div id={`pageContainer-${id}`}>
         <Breadcrumbs currentBreadcrumbTitle={breadcrumbsTitle}>{breadcrumbsChildren}</Breadcrumbs>
         {children}
      </div>
   );
};

export default PageContainer;
