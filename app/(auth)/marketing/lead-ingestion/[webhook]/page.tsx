import { cookies } from 'next/headers';
import LIWebhookNav from "./pageNav";

export default async function Page({ params, searchParams }: {
   params: { webhook: string },
   searchParams: { [key: string]: string | string[] | undefined }
}) {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   if (!authToken) {
      console.log('hmmm... how to handle this err?');
   }

   const { endpointData, runHistory } = await fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/leadIngestion/${params.webhook}`, {
      next: {
         tags: ['ingestionWebhookInfo']
      },
      method: 'GET',
      headers: {
         'Content-type': 'application/json',
         Authorization: `Bearer ${authToken}`
      },
   })
      .then(async (res) => {
         const results = await res.json();
         // console.log(results)
         if (results.error) throw new Error(results.error.errorMessage);
         return results;
      })
      .catch((err) => console.error('err', err));


   // Get lead fields
   // const { } = await fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/leadIngestion/leadFields`, {
   //    next: {
   //       tags: ['ingestionWebhookInfo']
   //    },
   //    method: 'GET',
   //    headers: {
   //       'Content-type': 'application/json',
   //       // Authorization: `Bearer ${authToken}`
   //    },
   // })
   //    .then(async (res) => {
   //       const results = await res.json();
   //       // console.log(results)
   //       if (results.error) throw new Error(results.error.errorMessage);
   //       return results;
   //    })
   //    .catch((err) => console.error('err', err));



   return (
      <LIWebhookNav endpointData={endpointData} runHistory={runHistory?.reverse()} searchParams={searchParams}></LIWebhookNav>
   )
}
