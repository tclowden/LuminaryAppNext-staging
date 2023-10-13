'use client';

import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Icon from '../../../common/components/Icon';
import LumBlueTextureImg from '../../../public/assets/images/lum-blue-texture.png';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/user';
import LoginForm from './LoginForm';
import RequestPasswordResetForm from './RequestPasswordResetForm';

const LoginClient = () => {
   const [forgotPassword, setForgotPassword] = useState<boolean>(false);
   const user = useAppSelector(selectUser);
   const router = useRouter();

   useEffect(() => {
      console.log('user:', user);
      const authToken = Cookies.get('LUM_AUTH');
      // compare the user.token to the authToken from cookies
      const userAuthed = !!authToken && !!user.token && authToken == user.token;
      console.log('userAuthed:', userAuthed);
      // const pageToRouteTo = user.permissions?.find((permission: any) => permission.page?.route);
      if (userAuthed) router.replace('/dashboard');

      // we shouldn't get here... if we are redirected here, the authprovider destroys the cookie
      // if we try to route here manually, then the first if statement will redirect them any way
      // else if (authToken) {
      //    console.log('WE CAN VALIDATE TOKEN HERE');
      // }
   }, [user]);

   const handleForgotPasswordClick = (e: any) => {
      setForgotPassword(!forgotPassword);
   };

   return (
      <div className='min-h-[100vh] bg-lum-black relative'>
         {/* BACKGROUND IMAGE... NEXTJS WAY */}
         <Image src={LumBlueTextureImg} alt={'Welcome To Luminary'} fill className='z-0' />

         <div className='z-10 relative m-auto flex flex-col items-center justify-center min-h-[100vh] gap-y-[6rem]'>
            <Icon name='LuminaryAppsColorFullLogo' className='w-[300px] h-[45px]' />
            {!forgotPassword ? (
               <LoginForm
                  className={`bg-lum-white rounded-[4px] p-8 flex flex-col items-center justify-center gap-y-2`}
                  onForgotPasswordClick={handleForgotPasswordClick}
               />
            ) : (
               <RequestPasswordResetForm
                  className={`bg-lum-white rounded-[4px] p-8 flex flex-col items-center justify-center gap-y-2`}
                  onForgotPasswordClick={handleForgotPasswordClick}
               />
            )}
         </div>
      </div>
   );
};

export default LoginClient;
