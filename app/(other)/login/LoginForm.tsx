import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import Button from '../../../common/components/button/Button';
import Input from '../../../common/components/input/Input';
import Cookies from 'js-cookie';
import { useAppDispatch } from '../../../store/hooks';
import { setLoginUser } from '../../../store/slices/user';
import useForm, { YupSchemaObject } from '../../../common/hooks/useForm';
import { fetchDbApi } from '@/serverActions';

const loginFormValidationSchema: YupSchemaObject<any> = {
   emailAddress: Yup.string().required('Email address is required'),
   password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
};

interface Props {
   onForgotPasswordClick: (e: any) => any;
   className?: string;
}

const LoginForm = ({ onForgotPasswordClick, className }: Props) => {
   const dispatch = useAppDispatch();

   const handleFormSubmit = (e: any, updatedValues: any) => {
      axios
         .post(`/api/v2/users/login`, updatedValues)
         .then((res: any) => {
            if (res.status === 200) {
               // set the cookie
               Cookies.set('LUM_AUTH', res.data.token);
               // set user global state
               dispatch(setLoginUser({ ...res.data }));
               // redirect to the dashboard page (this is happening in the useEffect inside the LoginClient component)
            } else {
               console.log('res is not a status of 200... why?:', res);
            }
         })
         .catch((err: any) => {
            if (err?.response?.data?.error?.errorMessage) setErrorAfterSubmit(err.response.data.error.errorMessage);
            // server error... server not started or something...
            else if (err.code === 'ERR_NETWORK')
               setErrorAfterSubmit('Seems like we are having issues... Please try again later.');
            else console.log(err);
         });
   };

   const { handleSubmit, handleChange, handleBlur, setErrorAfterSubmit, values, errors, errorAfterSubmit } = useForm({
      initialValues: { emailAddress: '', password: '' },
      validationSchema: loginFormValidationSchema,
      onSubmit: handleFormSubmit,
   });

   return (
      <form className={className ? className : ''} onSubmit={handleSubmit}>
         <div className='text-[24px] text-lum-blue-800'>Sign In</div>
         <Input
            data-test={'emailAddress'}
            type={'text'}
            placeholder='Enter Your Email Address'
            name='emailAddress'
            label='Email'
            errorMessage={errors.emailAddress}
            className='min-w-[500px] text-lum-gray-700 bg-lum-gray-50 text-[14px] h-[40px] rounded-[4px] border-[1px] border-lum-gray-100 px-[10px]'
            value={values['emailAddress']}
            onBlur={handleBlur}
            onChange={handleChange}
         />
         <Input
            data-test={'password'}
            type={'password'}
            placeholder='Password Field'
            name='password'
            label='Enter Your Password'
            errorMessage={errors.password}
            className='min-w-[500px] text-lum-gray-700 bg-lum-gray-50 text-[14px] h-[40px] rounded-[4px] border-[1px] border-lum-gray-100 px-[10px]'
            value={values['password']}
            onBlur={handleBlur}
            onChange={handleChange}
         />
         <div className='mt-4'></div>
         {errorAfterSubmit && <div className='text-lum-danger text-[14px]'>{errorAfterSubmit}</div>}
         <Button data-test={'submitBtn'} color='blue' onClick={handleSubmit}>
            Sign In
         </Button>
         <div className='text-[14px] text-lum-gray-200 cursor-pointer' onClick={onForgotPasswordClick}>
            Forgot Password?
         </div>
      </form>
   );
};

export default LoginForm;
