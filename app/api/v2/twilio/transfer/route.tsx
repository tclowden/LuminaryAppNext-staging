import { NextRequest, NextResponse } from 'next/server';
const twilio = require('twilio');
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest) {
   try {
      const { callSid, transferNumber, conferenceId } = await request.json();
      if (!callSid) throw new Error('No Call Sid provided');

      const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      const callData: any = await kv.get(conferenceId);

      await twilioClient
         .conferences(conferenceId)
         .participants.create({
            label: '3rd party',
            earlyMedia: true,
            beep: 'onEnter',
            record: true,
            from: callData?.from,
            to: transferNumber,
         })
         .catch((err: any) => {
            throw new Error(err?.message);
         });

      return NextResponse.json({ success: true }, { status: 200 });
   } catch (err: any) {
      console.log('twilio/transfer/POST -> err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

function lookupPhoneNumber(phoneNumber: string) {
   const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
   return client.lookups.v2
      .phoneNumbers(phoneNumber)
      .fetch({ type: 'carrier' })
      .then((response: any) => response.phoneNumber)
      .catch((err: any) => {
         throw new Error(err.message);
      });
}
