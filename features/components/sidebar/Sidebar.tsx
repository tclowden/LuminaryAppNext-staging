'use client';
import Image from 'next/image';
import defaultImageSrc from '../../../public/assets/images/profile.jpg';
import AppsNav from './AppsNav';
import Badge from './Badge';
import { useEffect, useState } from 'react';
import Icon from '../../../common/components/Icon';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectSidebar, setSidebar } from '../../../store/slices/sidebar';
import axios from 'axios';
import { selectUser } from '../../../store/slices/user';
import SectionAndPagesNav from './SectionAndPagesNav';
import { LuminaryColors } from '../../../common/types/LuminaryColors';

export type Page = {
   id?: string;
   name: string;
   route?: string;
   parentPageId?: number;
   iconName?: string;
   iconColor?: LuminaryColors;
   displayOrder?: number;
   pages: Page[];
   sections: Page[];
   showOnSidebar: boolean;
};

const Sidebar = () => {
   const dispatch = useAppDispatch();
   const rawPages = useAppSelector(selectSidebar).raw;
   const pathname = usePathname();
   const user = useAppSelector(selectUser);
   const router = useRouter();

   // need this stack to keep track of where the user is currently navigating
   const [currentNavStack, setCurrentNavStack] = useState<Array<Page | undefined>>([]);
   // activeRouteStack is a persistent stack of the current route. Will change when route path updates
   const [activeRouteStack, setActiveRouteStack] = useState<Array<Page>>([]);
   const [timesFetched, setTimesFetched] = useState<number>(0);

   const fetchSidebarData = (authToken: string | null) => {
      if (!authToken) return console.log('not getting token...');
      return axios
         .post(
            `/api/v2/pages/query`,
            { order: [['createdAt', 'ASC']], include: [{ model: 'permissions', required: false }] },
            { headers: { Authorization: `Bearer ${authToken}` } }
         )
         .then((res: any) => {
            if (!!res.data) dispatch(setSidebar(res.data));
            else console.log('hmmm... what is res.data??', res.data);
         })
         .catch((err: any) => {
            console.log('err:', err);
         });
   };

   // sets activeRouteStack and sets currentNavStack to initially match to the same stack
   useEffect(() => {
      if (!rawPages.length && timesFetched < 3) {
         fetchSidebarData(user.token);
         setTimesFetched((prevState: number) => prevState + 1);
         // console.log(
         //    `fetching pages for the ${timesFetched + 1 === 1 ? '1st' : timesFetched + 1 === 2 ? '2nd' : '3rd'} time`
         // );
      } else if (!!rawPages.length) {
         const pathArray: string[] | undefined = pathname?.split('/');
         if (pathArray) {
            // remove empty elements from start / end
            pathArray[0] === '' && pathArray.shift();
            pathArray[pathArray.length - 1] === '' && pathArray.pop();

            const foundActivePage = rawPages.find((page: Page) => {
               return (
                  page.route === `/${pathArray[0]}` ||
                  page.route === `/${pathArray[0]}/` ||
                  page.route === `${pathArray[0]}` ||
                  page.route === `${pathArray[0]}/` ||
                  page.route === `/${pathArray[0]}/${pathArray[1]}` ||
                  page.route === `/${pathArray[0]}/${pathArray[1]}/` ||
                  page.route === `${pathArray[0]}/${pathArray[1]}` ||
                  page.route === `${pathArray[0]}/${pathArray[1]}/`
               );
            });

            const recurse: any = (arr: any, pages: Array<any>) => {
               const lastStackItem = arr[0];
               if (lastStackItem?.parentPageId) {
                  const foundNextItem = pages.find((page) => page.id === lastStackItem?.parentPageId);
                  const copy = [foundNextItem, ...arr];
                  return recurse(copy, pages);
               } else return arr;
            };
            const newStack = recurse([foundActivePage], rawPages);
            setActiveRouteStack([...newStack]);

            // remove the page from currentNavStack
            setCurrentNavStack([...newStack.slice(0, -1)]);
         }
      } else {
         console.log(
            `fetched the sidebar data ${timesFetched} times... & still no sidebar data. might have to run pages script.`
         );
         router.push('/safe');
      }
   }, [rawPages, pathname]);

   const selectApp = (app: Page) => {
      setCurrentNavStack([app]);
   };

   const handleSectionClicked = (e: any, section: any) => {
      // append new section to the current nav stack
      setCurrentNavStack((prevState: Array<any>) => [...prevState, section]);
   };
   const handleGoBack = (e: any) => {
      // remove the last item off the current nav stack
      setCurrentNavStack((prevState: Array<any>) => [...prevState].slice(0, -1));
   };

   // get all the apps inside the raw pages array
   // then filter all the apps to show only apps users are allowed to access
   // const usersPermissions = user?.role?.permissions ? [...user.role.permissions] : [];

   // TEMPORARY UNTIL WE GET PERMISSIONS FROM DEVELOPMENT TO PRODUCTION FIGURED OUT
   // const allApps = [...rawPages].filter((page: any) => !page.parentPageId);
   // USE THIS BELOW WHEN PERMISSIONS ARE FIGURED OUT

   const allApps = [...rawPages].filter(
      (page: any) => !page.parentPageId && user?.permissions.find((permission: any) => permission?.pageId === page?.id)
   );

   const badgeCount = user?.notificationCount;

   return (
      <div className='grid grid-cols-[76px_1fr] overflow-y-hidden'>
         <AppsNav
            apps={allApps
               .filter((page: any) => page.name !== 'My Luminary' && page.showOnSidebar)
               .sort((a: any, b: any) => a?.displayOrder - b?.displayOrder)}
            activeApp={currentNavStack[0]}
            selectApp={selectApp}>
            <div className='w-full py-3 flex justify-center'>
               <Icon name='LuminaryAppsColorIconLogo' width={30} height={34} />
            </div>
            <div
               className={`${
                  currentNavStack[0]?.name === 'My Luminary' ? 'bg-lum-gray-750' : 'hover:bg-lum-gray-750'
               } flex justify-center mb-[10px] cursor-pointer`}
               onClick={() => {
                  const profileApp = rawPages.find((page: Page) => page.name === 'My Luminary');
                  if (profileApp) selectApp(profileApp);
               }}>
               <div className='relative py-3 px-1 h-full border-y-[3px] border-solid border-lum-gray-750'>
                  {/* <Image
                     className='rounded-full cursor-pointer'
                     src={user?.profileUrl || profileImage}
                     alt='Profile Image'
                     width={42}
                     height={42}
                  /> */}
                  <div className='relative w-[42px] h-[42px]'>
                     <Image
                        className='rounded-full'
                        src={user?.profileUrl || defaultImageSrc}
                        alt='User Profile Image'
                        style={{ objectFit: 'cover' }}
                        priority
                        fill
                        sizes='42px'
                     />
                  </div>
                  <span className='absolute top-[8px] right-0'>
                     <Badge count={badgeCount} />
                  </span>
               </div>
            </div>
         </AppsNav>
         <SectionAndPagesNav
            allPages={rawPages}
            activeRouteStack={activeRouteStack}
            currentNavStack={currentNavStack}
            handleGoBack={handleGoBack}
            handleSectionClicked={handleSectionClicked}
         />
      </div>
   );
};

export default Sidebar;
