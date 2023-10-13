'use server';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { DataEncryptor } from '@/utilities/keepItSecret/keepItSafe';

/**
 * Server action to request data from an API endpoint.
 * @param data
 * @returns JSON
 */
export async function serverFetchDbApi(
   data: string | { url: RequestInfo | URL; options?: RequestInit; authRequest: boolean }
) {
   // Decrpyt data if endrypted
   const { url, options, authRequest } = typeof data === 'string' ? new DataEncryptor().decryptData(data) : data;

   const authToken = cookies().get('LUM_AUTH')?.value;
   // let authToken = null;
   // if (authRequest) {
   //    // Check for an auth token
   //    const authToken = cookies().get('LUM_AUTH')?.value;
   //    // const userObj = await authUser(authToken);
   //    if (!authToken) {
   //       console.log('Fetch denied. Auth Token Error');
   //       return null;
   //    }
   // }

   // Make the request to the url with default content type and authorization
   const headers: any = { 'Content-type': 'application/json' };
   if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
   // Headers are overridable

   // if you include the base url (Example: 'http://localhost:3000'), fetchDbApi will add the CLIENT_SITE env to the beginning
   // else... if it contains http in the url, will just assume it's a valid full url and will use that
   const newUrl = url.includes('http') ? url : `${process.env.CLIENT_SITE}${url}`;
   const dbRes = await fetch(newUrl, {
      headers: headers,
      ...options,
   }).then(async (res) => {
      // Parse the and return the response
      if (!res?.ok) throw new Error(res?.statusText);
      const results = await res.json();
      if (results?.error) throw new Error(results?.error?.errorMessage);
      return results;
   });

   // options?.next?.tags.length > 0 &&
   //    options?.next?.tags.forEach((tag: string) => {
   //       console.log('revalidating:', tag);
   //       revalidateTag(tag);
   //    });

   return dbRes;
}
