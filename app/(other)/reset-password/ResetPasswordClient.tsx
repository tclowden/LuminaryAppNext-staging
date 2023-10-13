'use client';

import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import Button from '../../../common/components/button/Button';
import Icon from '../../../common/components/Icon';
import Input from '../../../common/components/input/Input';
import useForm, { YupSchemaObject } from '../../../common/hooks/useForm';
import LumBlueTextureImg from '../../../public/assets/images/lum-blue-texture.png';
import { ValidationParams } from '../../../utilities/formValidation/types';

interface TokenResult {
   id: number;
   user: { emailAddress: string };
   userId: number;
   value: string;
   typeId: number;
   archived: boolean;
   expiration: string | Date;
   createdAt: string | Date;
   keyType: { id: number; name: string };
}

const passwordSetValidationSchema: YupSchemaObject<any> = {
   password: Yup.string().required('Password is required'),
   confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
};

interface Props {
   tokenResult: TokenResult;
}

const ResetPasswordClient = ({ tokenResult }: Props) => {
   const router = useRouter();
   console.log(tokenResult);

   useEffect(() => {
      // delete auth cookie
      Cookies.remove('LUM_AUTH');
   }, []);

   const createPassword = (e: any) => {
      // make sure passwords match
      axios
         .post(`/api/v2/users/password/create`, {
            tokenId: tokenResult.id,
            userId: tokenResult.userId,
            emailAddress: tokenResult.user.emailAddress,
            password: values.password,
         })
         .then((res: any) => {
            if (res.status === 200) {
               console.log('SUCCESS PASSWORD CREATION');
               router.replace('/login');
            } else {
               console.log(res);
            }
         })
         .catch((err) => {
            console.log('err:', err);
            if (err?.response?.data?.error?.errorMessage) setErrorAfterSubmit(err.response.data.error.errorMessage);
            // server error... server not started or something...
            else if (err.code === 'ERR_NETWORK')
               setErrorAfterSubmit('Seems like we are having issues... Please try again later.');
            else console.log(err);
         });
   };

   const resetPassword = (e: any) => {
      // make sure passwords match
      axios
         .post(`/api/v2/users/password/reset`, {
            tokenId: tokenResult.id,
            userId: tokenResult.userId,
            emailAddress: tokenResult.user.emailAddress,
            password: values.password,
         })
         .then((res) => {
            if (res.status === 200) {
               console.log('SUCCESS PASSWORD RESET');
               router.replace('/login');
            } else {
               console.log(res);
            }
         })
         .catch((err) => {
            console.log('err:', err);
            if (err?.response?.data?.error?.errorMessage) setErrorAfterSubmit(err.response.data.error.errorMessage);
            // server error... server not started or something...
            else if (err.code === 'ERR_NETWORK')
               setErrorAfterSubmit('Seems like we are having issues... Please try again later.');
            else console.log(err);
         });
   };

   const handleFormSubmit = (e: any) => {
      // alert(JSON.stringify(formData));
      if (tokenResult.keyType?.name === 'register') createPassword(e);
      if (tokenResult.keyType?.name === 'forgot_password') resetPassword(e);
   };

   const { handleSubmit, handleChange, handleBlur, setErrorAfterSubmit, values, errors, errorAfterSubmit } = useForm({
      initialValues: { password: '', confirmPassword: '' },
      validationSchema: passwordSetValidationSchema,
      onSubmit: handleFormSubmit,
   });

   return (
      <div className='min-h-[100vh] bg-lum-black relative'>
         {/* BACKGROUND IMAGE... NEXTJS WAY */}
         <Image src={LumBlueTextureImg} alt={'Welcome To Luminary'} fill className='z-0' />
         <div className='z-10 relative m-auto flex flex-col items-center justify-center min-h-[100vh] gap-y-[6rem]'>
            <Icon name='LuminaryAppsColorFullLogo' className='w-[300px] h-[45px]' />
            <form className='bg-lum-white rounded-[4px] p-8 flex flex-col items-center justify-center gap-y-8'>
               <div>
                  <div className='text-[24px] text-center text-lum-gray-700 mb-[6px]'>
                     {tokenResult.keyType.name === 'register' && <>Welcome To LuminaryApps!</>}
                     {tokenResult.keyType.name === 'forgot_password' && <>Password Reset</>}
                  </div>
                  <div className='text-[14px] text-center text-lum-gray-700'>
                     {tokenResult.keyType.name === 'register' && (
                        <>A Luminary Account has been created with your email address:</>
                     )}
                     {tokenResult.keyType.name === 'forgot_password' && (
                        <>Password reset has been requested for user with email:</>
                     )}
                  </div>
                  <div className='text-[14px] text-center text-lum-blue-500'>{tokenResult.user.emailAddress}</div>
               </div>
               <div onSubmit={handleSubmit}>
                  <div className='text-[24px] text-center text-lum-gray-700 mb-[6px]'>
                     {tokenResult.keyType.name === 'register' && <>Create Your Password</>}
                     {tokenResult.keyType.name === 'forgot_password' && <>Set New Password</>}
                  </div>
                  <div className='text-[12px] text-center text-lum-gray-500 max-w-[430px] mx-auto'>
                     Password must be 8+ characters and include at least one of each of the following: Uppercase,
                     Lowercase, Number, Special Character
                  </div>
                  <div>
                     <Input
                        type={'password'}
                        placeholder='Password Field'
                        label='Password'
                        name='password'
                        className='min-w-[500px] text-lum-gray-700 bg-lum-gray-50 text-[14px] h-[40px] rounded-[4px] border-[1px] border-lum-gray-100 px-[10px]'
                        value={values['password']}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errorMessage={errors.password}
                     />
                     <Input
                        type={'password'}
                        placeholder='Password Field'
                        label='Confirm Password'
                        name='confirmPassword'
                        className='min-w-[500px] text-lum-gray-700 bg-lum-gray-50 text-[14px] h-[40px] rounded-[4px] border-[1px] border-lum-gray-100 px-[10px]'
                        value={values['confirmPassword']}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errorMessage={errors.confirmPassword}
                     />
                  </div>
               </div>
               {errorAfterSubmit && <div className='text-lum-danger text-[14px]'>{errorAfterSubmit}</div>}
               <Button color='blue' onClick={handleSubmit}>
                  {tokenResult.keyType?.name === 'register' && <>Create Password & Sign In</>}
                  {tokenResult.keyType?.name === 'forgot_password' && <>Reset Password</>}
               </Button>
            </form>
         </div>
      </div>
   );
};

export default ResetPasswordClient;
