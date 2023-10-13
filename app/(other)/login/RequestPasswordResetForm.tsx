import axios from 'axios';
import React, { useState } from 'react';
import * as Yup from 'yup';
import Button from '../../../common/components/button/Button';
import Input from '../../../common/components/input/Input';
import useForm, { YupSchemaObject } from '../../../common/hooks/useForm';

const ValidationSchema: YupSchemaObject<any> = {
   emailAddress: Yup.string().required('Email address is required'),
};

interface Props {
   onForgotPasswordClick: (e: any) => any;
   className?: string;
}

const RequestPasswordResetForm = ({ onForgotPasswordClick, className }: Props) => {
   const handleFormSubmit = (e: any) => {
      // alert(JSON.stringify(formData));
      axios
         .post(`/api/v2/users/password/request-reset`, values)
         .then((res: any) => {
            // console.log('RES', res);
            // set a toast maybe??
            // go back to login
            onForgotPasswordClick('');
         })
         .catch((err: any) => {
            console.log('err:', err);
            if (err?.response?.data?.error?.errorMessage) setErrorAfterSubmit(err.response.data.error.errorMessage);
            // server error... server not started or something...
            else if (err.code === 'ERR_NETWORK')
               setErrorAfterSubmit('Seems like we are having issues... Please try again later.');
            else console.log(err);
         });
   };

   const { handleSubmit, handleChange, handleBlur, setErrorAfterSubmit, values, errors, errorAfterSubmit } = useForm({
      initialValues: { emailAddress: '' },
      validationSchema: ValidationSchema,
      onSubmit: handleFormSubmit,
   });

   return (
      <form className={className ? className : ''} onSubmit={handleSubmit}>
         <div className='text-[24px] text-lum-blue-800'>Password Reset</div>
         <Input
            type={'text'}
            placeholder='Enter Your Email Address'
            name='emailAddress'
            label='Email'
            className='min-w-[500px] text-lum-gray-700 bg-lum-gray-50 text-[14px] h-[40px] rounded-[4px] border-[1px] border-lum-gray-100 px-[10px]'
            value={values['emailAddress']}
            onChange={handleChange}
            onBlur={handleBlur}
            errorMessage={errors.emailAddress}
         />
         <div className='mt-4'></div>
         {errorAfterSubmit && <div className='text-lum-danger text-[14px]'>{errorAfterSubmit}</div>}
         <Button color='blue' onClick={handleSubmit}>
            Request Password Reset
         </Button>
         <div className='text-[14px] text-lum-gray-200 cursor-pointer' onClick={onForgotPasswordClick}>
            Return Back to Login?
         </div>
      </form>
   );
};

export default RequestPasswordResetForm;
