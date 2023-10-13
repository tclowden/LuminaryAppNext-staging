/*
 * Page Documentation
 * - This page handles 2 requests...
 *    - '/create-password'
 *    - '/reset-password'
 * - on load, validate that the token exists
 * - assuming the token is validated, returns back the row from the db... which contains a key type. Look for one of two:
 *    - 'register'
 *    - 'forgot_password'
 * - pass the data as props to the client & render what is neccessary depending on the token & the key type
 * - if the token does NOT validate, redirect to login.
 */

import { redirect } from 'next/navigation';
import ResetPasswordClient from './ResetPasswordClient';
export const dynamic = 'force-dynamic';

interface Props {
   params?: { slug: string };
   searchParams?: { token: string | undefined };
}

const ResetPassword = async ({ params, searchParams }: Props) => {
   // URL EXAMPLE:
   // http://localhost:3000/create-password?token=aa81dc3698f1798552c882e1dff51cee423eb5e80af7e84929cebb769527ba9871e45a34e42773b92e971a61fb51c6fa21e52a07da7158dd4bb28e264ff1f45

   // get token
   const tokenInParams = searchParams?.token || undefined;
   // if no token, shouldn't be on this page... redirect
   if (!tokenInParams) return redirect('/login');
   const result: any = await fetch(`${process.env.CLIENT_SITE}/api/v2/users/keys/${tokenInParams}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
      cache: 'no-store',
   })
      .then((res) => res.json())
      .catch((err) => {
         console.log('err fetching user keys:', err);
      });

   // if result is null or undefined, then token doesn't exist.. redirect
   // maybe in the future display a toast on the redirect page letting the user know what happened.
   if (!result) return redirect('/login');

   // double check the token isn't expired
   if (result.archived) return redirect('/login');
   const now = new Date();
   const expirationDate = new Date(result.expiration);
   if (now > expirationDate) return redirect('/login');

   // const result = {
   //    id: 1,
   //    user: { emailAddress: 'mrapp@shinesolar.com' },
   //    userId: 1,
   //    value: 'Xyghu784637hXXSfksjfa',
   //    archived: false,
   //    keyTypeId: 1,
   //    keyType: { id: 1, name: 'forgot_password' },
   // };

   return <ResetPasswordClient tokenResult={result} />;
};

export default ResetPassword;
