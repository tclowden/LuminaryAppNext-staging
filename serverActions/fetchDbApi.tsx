// gotta comment this out so it hashes out the request.
// 'use server';
/**
 * This is actually a wrapper for the fetchDbApiEncrypted file to allow encryption of data so it
 * can't be seen in the network traffic
 */
import { DataEncryptor } from '@/utilities/keepItSecret/keepItSafe';
import { serverFetchDbApi } from './fetchDbApiEncrypted';

/**
 * This allows you to make a secure request to an API endpoint via server action.
 * It encrypts the data sent to the server action so that you cannot see the data in the request paylod.
 *
 * @param url Address of the requested resource
 * @param options ie. method, next, body
 * @param encrypt Should it be encrypted?
 */
export async function fetchDbApi(
   url: RequestInfo | URL,
   options?: RequestInit,
   encrypt: boolean = true,
   authRequest: boolean = true
): Promise<any> {
   if (encrypt) {
      const encryptedData = new DataEncryptor().encryptData({ url, options, authRequest });
      return serverFetchDbApi(encryptedData);
   } else {
      return serverFetchDbApi({ url, options, authRequest });
   }
}
