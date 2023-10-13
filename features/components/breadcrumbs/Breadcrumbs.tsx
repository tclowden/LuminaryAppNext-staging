'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import Icon from '../../../common/components/Icon';
import { apps, appPages } from '../sidebar/SidebarData';
import BreadcrumbBtn from './BreadcrumbBtn';
import Tooltip from '../../../common/components/tooltip/Tooltip';
import { revalidate } from '../../../serverActions/revalidate';

interface LinkObj {
   title: '';
   destination: '';
   iconName?: '';
}

interface LinkSection {
   name: string;
   iconName: string;
   activeColor: string;
}

interface GeneratedBreadcrumbs {
   name: string;
   path: string;
}

interface BreadcrumbsProps {
   currentBreadcrumbTitle?: string;
   children?: JSX.Element | JSX.Element[];
}

const Breadcrumbs = ({ currentBreadcrumbTitle, children }: BreadcrumbsProps) => {
   const [linkSection, setLinkSection] = useState<LinkSection | undefined>(undefined);
   const [linkObj, setLinkObj] = useState<LinkObj | undefined>(undefined);
   const [breadcrumbs, setBreadcrumbs] = useState<GeneratedBreadcrumbs[] | undefined>(undefined);

   const pathname = usePathname() || "";
   const router = useRouter();

   useEffect(() => {
      const pathArray: string[] | undefined = pathname?.split('/');

      if (pathArray) {
         // remove empty elements from start / end
         pathArray[0] === '' && pathArray.shift();
         pathArray[pathArray.length - 1] === '' && pathArray.pop();

         // get the link section
         setLinkSection(
            apps.find((app) => {
               return app.name.toLowerCase() === pathArray[0];
            })
         );

         // Get the base page & image from the url
         const foundApp =
            appPages.find((page) => {
               return page.appName.toLowerCase() === pathArray[0];
            }) || appPages.find((page) => page.appName === 'Dashboard'); // Route links in the 'Dashboard'/profile section of the sidebar do not have prefix path

         foundApp?.linkSections.forEach((section: { links: Array<any> }) => {
            const foundLinkObj = section.links?.find((link: LinkObj) => {
               if (foundApp.appName === 'Dashboard') {
                  // Handles links that are under the profile app of the sidebar.
                  return link.destination === `/${pathArray[0]}`;
               } else {
                  return (
                     link.destination === `/${pathArray[0]}/${pathArray[1]}` ||
                     link.destination === `/${pathArray[0]}/${pathArray[1]}/`
                  );
               }
            });
            if (foundLinkObj) setLinkObj(foundLinkObj);
         });

         // Generate breadcrumbs
         if (pathArray.length >= 1) {
            let tempPath: string = '';
            const generatedBreadcrumbs = pathArray.map((path, i) => {
               tempPath += `/${path}`;
               return { name: path.replaceAll('-', ' '), path: tempPath };
            });
            if (!foundApp || foundApp?.appName !== 'Dashboard') {
               // Makes sure not to shift any breadcrumbs that are linked to the profile app of the sidebar
               generatedBreadcrumbs.shift();
            }
            setBreadcrumbs(generatedBreadcrumbs);
         }
      }
   }, [pathname]);

   const goToPath = useCallback(
      (path: string) => {
         return async (e: Event) => {
            e.preventDefault();
            await revalidate({ path })
            router.push(path);
         };
      },
      [router]
   );

   const refreshPage = useCallback(() => {
      return async (e: Event) => {
         e.preventDefault();
         // await revalidate({ path: `/marketing/lead-ingestion` })
         router.refresh();
      };
   }, [router]);

   const capitalizeWordsInString = (str: string) => {
      return str
         .toLocaleLowerCase()
         .split(' ')
         .map((s) => s.charAt(0).toLocaleUpperCase() + s.substring(1))
         .join(' ');
   };
   return (
      <div className='pb-[10px] flex gap-[10px]'>
         {/* Back Button */}
         <Tooltip content={'Go Back'}>
            <BreadcrumbBtn onClick={async () => {
               await revalidate({ path: pathname })
               router.back()
            }}>
               <Icon
                  name='ChevronLeft'
                  width={12}
                  height={12}
                  color={'gray'}
               // className='fill-none stroke-2 stroke-lum-gray-450 dark:stroke-lum-gray-450 group-hover:stroke-lum-gray-600 dark:group-hover:stroke-lum-white'
               // className=' fill-lum-gray-450 dark:fill-lum-gray-450 group-hover:stroke-lum-gray-600 dark:group-hover:stroke-lum-white'
               />
            </BreadcrumbBtn>
         </Tooltip>

         {/* Breadcrumbs*/}
         {breadcrumbs &&
            breadcrumbs.map((breadcrumb, i, row) => {
               const isFinal = i + 1 === row.length;
               return (
                  <Tooltip
                     key={i}
                     content={
                        !isFinal ? `Go to ${capitalizeWordsInString(breadcrumb.name)}` : 'Click to refresh page data'
                     }>
                     <BreadcrumbBtn
                        isActive={isFinal}
                        leftChevron={i > 0}
                        iconName={i === 0 ? linkObj?.iconName || linkSection?.iconName : ''}
                        onClick={!isFinal ? goToPath(breadcrumb.path) : refreshPage()}>
                        {isFinal && currentBreadcrumbTitle ? currentBreadcrumbTitle : breadcrumb.name}
                     </BreadcrumbBtn>
                  </Tooltip>
               );
            })}

         {/* Page Specific Buttons... */}
         <div className='ml-auto flex flex-wrap gap-[10px] justify-end'>{children}</div>
      </div>
   );
};

export default Breadcrumbs;
