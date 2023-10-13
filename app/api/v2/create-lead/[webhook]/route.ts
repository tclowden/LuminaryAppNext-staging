import { NextResponse } from 'next/server';
import { LeadIngestion } from '../../../../../features/components/lead-ingestion/leadIngestion';

export async function POST(request: Request, { params }: { params: { webhook: string } }) {
   const webhook = params.webhook;

   const rawData = await request.json();

   const res = await fetch('http://localhost:8010/api/v1/leadIngestion/request', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ webhook, rawData }),
   })
   .then(async res => {
      const data = await res.json()
      // console.log(data)
      console.log(data.error)
   })
   // .catch(err => console.log('err', err.errorMessage))

   //   const data = await res.json()

   return NextResponse.json({ slug: webhook, rawData }, { status: 200 });
}
