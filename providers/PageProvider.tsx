// 'use client';

// /*
//     This provider is specifically configuration for the page...
//     - checks global state (authed or not...) | possibly don't need this becuase of AuthProvider
//     - checks the global state permissions array to the configuration permissions array. | if no access, redirects to fallback url, which defaults to /dashboard
//     - (OPTIONAL) provides a page context using redux-toolkit that unmounts the state once you leave the page... this is great if you want to avoid Prop Drilling
// */

// import React, { useEffect, useState } from 'react';
// import { useAppDispatch } from '../store/hooks';
// import { clearPageContext } from '../store/slices/pageContext';
// interface Props {
//    enablePageContext?: boolean;
//    defaultPageContext?: object;
//    children: React.ReactNode;
// }

// const PageProvider = ({ children, enablePageContext, defaultPageContext = {} }: Props) => {
//    const dispatch = useAppDispatch();
//    const [contextSet, setContextSet] = useState<boolean>(false);

//    // constructor
//    useEffect(() => {
//       // if the user wants to use redux to handle the page data to avoid prop drilling... pass in enablePageContext
//       if (enablePageContext) {
//          // dispatch(setPageContext(defaultPageContext));
//          dispatch({ type: 'pageContext/setPageContext', payload: defaultPageContext });
//          setContextSet(true);

//          // this will clear the page context whenever the user leaves the current page
//          return () => {
//             dispatch(clearPageContext({}));
//          };
//       }
//    }, []);

//    if (enablePageContext && contextSet) return <>{children}</>;
//    else if (!enablePageContext) return <>{children}</>;
//    else return <>LOADING</>;
// };

// export default PageProvider;

// TEMPORARY UNTIL WE GET PERMISSIONS FROM DEVELOPMENT TO PRODUCTION FIGURED OUT
// USE THE CODE BELOW ONCE PERMISSIONS GETS FIGURED OUT IN PROD
'use client';

/*
    This provider is specifically configuration for the page...
    - checks global state (authed or not...) | possibly don't need this becuase of AuthProvider
    - checks the global state permissions array to the configuration permissions array. | if no access, redirects to fallback url, which defaults to /dashboard
    - (OPTIONAL) provides a page context using redux-toolkit that unmounts the state once you leave the page... this is great if you want to avoid Prop Drilling
*/

import React, { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearPageContext } from '../store/slices/pageContext';
import { selectUser } from '../store/slices/user';
import { selectSidebar } from '../store/slices/sidebar';
import { selectPermissions, setPermissions } from '../store/slices/permissions';
import axios from 'axios';
import { setAddToast } from '../store/slices/toast';
import Loading from '@/app/(auth)/loading';

interface Props {
   enablePageContext?: boolean;
   defaultPageContext?: object;
   children: React.ReactNode;
}

// right now, if a role/user has any permission to the page, they can view it...
// this is okay tho... why would we give a user to edit a page, but not view it?

const PageProvider = ({ children, enablePageContext, defaultPageContext = {} }: Props) => {
   const [permissionStatus, setPermissionStatus] = useState('pending'); // 'success', 'failed', 'pending'
   // we need this boolean to know if we already fetched the permissions...
   // if so, then set to true...
   // we couldn't use only the length of the permissions because some people in development might not have permissions in their db yet
   const [fetchedPermissions, setFetchedPermissions] = useState<boolean>(false);
   // const [fetchedSidebarData, setFetchedSidebarData] = useState<boolean>(false);
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const router = useRouter();

   // handle getting current page & permissions for the page
   const params: any = useParams();
   let pathname = usePathname()?.slice(1) || '';
   Object.keys(params).forEach((paramKey: any) => {
      pathname = pathname.replace(params[paramKey], '*');
   });
   // const currentPage: any = useAppSelector((state: any) => selectCurrentPage(state, pathname));
   const sidebarData = useAppSelector(selectSidebar).raw;
   // const permissions = useAppSelector(selectPermissions).raw;

   useEffect(() => {
      if (permissionStatus === 'failed') {
         dispatch(
            setAddToast({
               iconName: 'XMarkCircle',
               details: [{ label: 'Error', text: 'Not allowed on page...' }],
               variant: 'danger',
               autoCloseDelay: 5,
            })
         );
         // router.back();
         router.push('/safe');
      }
   }, [permissionStatus]);

   // constructor
   useEffect(() => {
      // if the user wants to use redux to handle the page data to avoid prop drilling... pass in enablePageContext
      if (enablePageContext) {
         // dispatch(setPageContext(defaultPageContext));
         dispatch({ type: 'pageContext/setPageContext', payload: defaultPageContext });

         // this will clear the page context whenever the user leaves the current page
         return () => {
            dispatch(clearPageContext({}));
         };
      }
   }, []);

   // const fetchPermissionsData = async (authToken: string | null) => {
   //    if (!authToken) return console.log('not getting token...');
   //    return axios
   //       .get(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/permissions`, {
   //          headers: { Authorization: `Bearer ${authToken}`, 'Content-type': 'application/json' },
   //       })
   //       .then((res: any) => {
   //          // if (!!res.data) dispatch(setPermissions(res.data));
   //          if (!!res.data) return dispatch(setPermissions(res.data));
   //          else console.log('trouble fetching permissions...', res);
   //       })
   //       .catch((err: any) => {
   //          console.log('err:', err);
   //       });
   // };

   // hanlde permissions here..
   useEffect(() => {
      if (!!sidebarData.length) {
         const currentPage: any = sidebarData?.find((page: any) => page.route === pathname);
         const currentPagePermissions = currentPage?.permissions;
         // const currentPagePermissions = permissions.filter((permission: any) => permission.pageId === currentPage?.id);
         // check to see if user has permissions to access page
         const userHasPermissionToEnterPage = user?.permissions?.some((permission: any) =>
            currentPagePermissions.map((pagePermission: any) => pagePermission?.id).includes(permission?.id)
         );
         if (userHasPermissionToEnterPage) setPermissionStatus('success');
         else {
            setPermissionStatus('failed');
         }
      }
   }, [sidebarData]);

   //// hanlde permissions here..
   // useEffect(() => {
   //    if (!permissions.length && !fetchedPermissions) {
   //       fetchPermissionsData(user.token);
   //       setFetchedPermissions(true);
   //    } else if (!!sidebarData.length) {
   //       const currentPage: any = sidebarData?.find((page: any) => page.route === pathname);
   //       // const currentPagePermissions = currentPage?.permissions;
   //       const currentPagePermissions = permissions.filter((permission: any) => permission.pageId === currentPage?.id);
   //       // check to see if user has permissions to access page
   //       const userHasPermissionToEnterPage = user?.permissions?.some((permission: any) =>
   //          currentPagePermissions.map((pagePermission: any) => pagePermission.id).includes(permission.id)
   //       );
   //       console.log('userHasPermissionToEnterPage:', userHasPermissionToEnterPage);
   //       if (userHasPermissionToEnterPage) setPermissionStatus('success');
   //       else {
   //          setPermissionStatus('failed');
   //          // if (fallbackRoute && fallbackRoute === '/login') {
   //          //    Cookies.remove('LUM_AUTH');
   //          //    router.push(fallbackRoute);
   //          // } else if (fallbackRoute && fallbackRoute !== 'login') router.push(fallbackRoute);
   //          // else router.push('/dashboard');
   //       }
   //    }
   // }, [permissions, sidebarData]);

   return (
      <>
         {permissionStatus === 'success' && children}
         {permissionStatus === 'pending' && <Loading />}
      </>
   );
};

export default PageProvider;
