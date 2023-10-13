'use client';

/*
    This provider is specifically making sure the user is authenticated...
    - checks global state
    - if not authed in global state, get token from cookies
    - if no token in cookies, redirect to sign in
    - if there is a token, validates the token
    - if token valid, repopulate global state
*/

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectUser, setLoginUser, setLogoutUser } from '../store/slices/user';
import Loading from '@/app/(auth)/loading';

const AuthProvider = ({ children, ...otherProps }: { children: React.ReactNode }) => {
   const [authStatus, setAuthStatus] = useState('pending'); // 'success', 'failed', 'pending'
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const router = useRouter();
   const pathname = usePathname();
   // configuration should be an object
   // maybe we set whiteListPermissions to access that component... if no whiteListPermissions set (empty array...), then anybody can access

   useEffect(() => {
      if (authStatus === 'failed') {
         dispatch(setLogoutUser({}));
         return router.replace('/login');
      }
   }, [authStatus]);

   useEffect(() => {
      const validateToken = async (token: string | null) => {
         if (!token) return { status: 401, data: null };
         const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
         const authIsValid: any = await axios
            .get(`/api/v2/users/verify`, {
               headers: { ...headers },
            })
            .catch((err) => {
               console.log('err in AuthProvider:', err);
               throw new Error(err);
            });

         return authIsValid;
      };

      const authUserAsync = async () => {
         // quickly log user in with default data for testing
         const authToken = Cookies.get('LUM_AUTH');
         // compare the user.token to the authToken from cookies
         const userAuthed: boolean = !!authToken && !!user.token && authToken == user.token;
         if (userAuthed) setAuthStatus('success');
         // if they don't match, but there is a token in the cookies... validate it.
         else if (authToken) {
            try {
               const authIsValid: { status: number; data: any } = await validateToken(authToken);
               if (authIsValid.status === 200) {
                  // if there is no authToken in cookies, that means we validated the token using global state...
                  // set the cookie again using the global state token
                  dispatch(setLoginUser({ ...authIsValid.data }));
                  setAuthStatus('success');
               } else setAuthStatus('failed');
            } catch (err) {
               console.log(err);
               setAuthStatus('failed');
            }
         } else if (!authToken && !userAuthed) {
            setAuthStatus('failed');
         }
      };

      authUserAsync();
   }, [user, pathname]);

   return (
      <>
         {authStatus === 'success' && children}
         {authStatus === 'pending' && <Loading />}
      </>
   );
};

export default AuthProvider;
