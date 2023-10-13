import { NextRequest, NextResponse } from 'next/server';
const twilio = require('twilio');
import Ably from 'ably/promises';
import { convertFormDataToJson } from '@/utilities/helpers';
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest, params: { params: { id: string } }) {
   try {
      // Need to find the original call side to get the from and to numbers of the call
      const response = new twilio.twiml.VoiceResponse();
      const conferenceData: any = convertFormDataToJson(await request.formData());
      const conferenceSid = conferenceData?.ConferenceSid;

      const redisKey = conferenceData.FriendlyName;
      const redisCallData: any = await kv.get(redisKey);

      if (conferenceData.ParticipantLabel == '3rd party' && conferenceData.StatusCallbackEvent == 'participant-join') {
         const ablyClient = new Ably.Realtime(`${process.env.ABLY_ROOT_KEY}`);
         const channel = ablyClient.channels.get(redisCallData.userId);
         await channel.publish({ name: 'transfer-connected' });
      }

      if (conferenceData.StatusCallbackEvent === 'participant-leave' && !!conferenceSid) {
         const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

         // Query to find how many participants are currently in the conference call
         const participants = await client.conferences(conferenceSid).participants.list();

         // When event 'participant-leave' occurs, end the conference call if only one participant remains in the conference call.
         if (participants?.length === 1) {
            await client.conferences(conferenceSid).update({ status: 'completed' });
         }
      }

      const res = new NextResponse(response, { status: 200 });
      res.headers.set('Content-Type', 'text/xml');
      return res;
   } catch (err: any) {
      console.log('/api/v2/twilio/callbacks/conference/[id] -> Error: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export const dynamic = 'force-dynamic';
