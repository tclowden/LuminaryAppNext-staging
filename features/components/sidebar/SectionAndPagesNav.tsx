'use client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import Grid from '../../../common/components/grid/Grid';
import Hr from '../../../common/components/hr/Hr';
import Icon from '../../../common/components/Icon';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setAddToast } from '../../../store/slices/toast';
import { selectUser, setLogoutUser } from '../../../store/slices/user';
import MyLuminaryProfile from './MyLuminaryProfile';
import PageLink from './PageLink';
import GetNextLead from '../get-next-lead/GetNextLead';

interface Props {
   activeRouteStack: Array<any | undefined>;
   currentNavStack: Array<any | undefined>;
   allPages: Array<any>;
   handleSectionClicked?: (e: any, section: any) => void;
   handleGoBack: (e: any) => void;
}

const SectionAndPagesNav = ({
   activeRouteStack,
   currentNavStack,
   allPages,
   handleSectionClicked,
   handleGoBack,
}: Props) => {
   const dispatch = useAppDispatch();
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const hasBackButton = currentNavStack.length > 1;

   const handleLogoutUser = () => {
      Cookies.remove('LUM_AUTH');
      dispatch(setLogoutUser({}));
      router.replace('/login');
      dispatch(
         setAddToast({
            iconName: 'CheckMarkCircle',
            details: [{ label: 'Success', text: 'Logout Success!' }],
            variant: 'success',
            autoCloseDelay: 5,
         })
      );
   };

   // get all pages and sections... then filter pages and pages and sections only if the user is allowed to access those pages...
   // const usersPermissions = user?.role?.permissions ? [...user.role.permissions] : [];
   const pagesAndSections = [...allPages]
      .filter(
         (page: any) =>
            page.parentPageId &&
            // TEMPORARY UNTIL WE GET PERMISSIONS FROM DEVELOPMENT TO PRODUCTION FIGURED OUT
            // UNCCOMMENT BELOW WHEN PERMISSIONS GET FIGURED OUT IN PRODUCTION
            user?.permissions?.find((permission: any) => permission?.pageId === page?.id) &&
            page.showOnSidebar
      )
      .sort((a: any, b: any) => a?.displayOrder - b?.displayOrder);
   const activeSection = [...currentNavStack].reverse().find((page: any) => !page?.route && page?.parentPageId);
   const activeApp = currentNavStack[0];

   // if there are no links to show, then hide the <Hr /> components
   const linksToShow = pagesAndSections.some((pageOrSection: any) => {
      const showLink = activeSection
         ? activeSection?.id === pageOrSection?.parentPageId
         : activeApp?.id === pageOrSection?.parentPageId;
      return showLink;
   });

   return (
      <div className='p-[10px] bg-lum-gray-750  overflow-y-auto [scrollbar-width:thin]'>
         <div className={twMerge(`flex flex-col py-[11px] last:pb-0 h-full gap-y-3`)}>
            {hasBackButton && (
               <div className='flex items-center cursor-pointer' onClick={handleGoBack}>
                  <Icon name={'ChevronLeft'} width={12} height={12} color={'white'} />
                  <span className='text-[11px] ml-[6px] capitalize truncate mr-auto text-lum-gray-400'>
                     {activeSection?.name}
                  </span>
               </div>
            )}
            {activeApp?.name === 'My Luminary' && (
               <>
                  <MyLuminaryProfile />
                  {/* <GetNextLead /> */}
                  {linksToShow && <Hr className='border-t-[.5px] border-t-lum-gray-500 border-top-none my-1' />}
               </>
            )}
            {!!pagesAndSections?.length && (
               <Grid rowGap={0}>
                  {pagesAndSections.map((pageOrSection: any) => {
                     // const activeApp = currentNavStack[0];
                     const showLink = activeSection
                        ? activeSection?.id === pageOrSection?.parentPageId
                        : activeApp?.id === pageOrSection?.parentPageId;

                     return (
                        <React.Fragment key={pageOrSection.id}>
                           <PageLink
                              page={pageOrSection}
                              showLink={showLink}
                              handleSectionClicked={handleSectionClicked}
                              activeRouteStack={activeRouteStack}
                           />
                        </React.Fragment>
                     );
                  })}
               </Grid>
            )}
            {activeApp?.name === 'My Luminary' && (
               <div
               // className='mt-auto'
               >
                  <Hr
                     className={twMerge(`
                        border-t-[.5px] border-t-lum-gray-500 mb-3
                     `)}
                  />
                  {/* ${linksToShow && 'mt-4'} */}
                  <PageLink
                     page={{
                        name: 'Log Out',
                        iconName: 'BackArrow',
                        pages: [],
                        sections: [],
                        showOnSidebar: true,
                     }}
                     // className={'min-h-[0px]'}
                     showLink={true}
                     handleSectionClicked={handleLogoutUser}
                     activeRouteStack={activeRouteStack}
                     isButton={true}
                  />
               </div>
            )}
         </div>
      </div>
   );
};

export default SectionAndPagesNav;
