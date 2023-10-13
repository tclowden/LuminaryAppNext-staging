import { NextRequest, NextResponse } from 'next/server';
import { actionsQueue } from '@/workers/queue.worker';
const twilio = require('twilio');
import Ably from 'ably/promises';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
   try {
      const reqBody = await request.json();

      const baseUrl = process.env.NODE_ENV === 'development' ? process.env.NGROK_ROOT_URL : process.env.CLIENT_SITE;

      const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      const response = new twilio.twiml.VoiceResponse();
      const dial = response.dial({
         record: 'record-from-ringing-dual',
         timeout: 25,
         recordingStatusCallback: `${baseUrl}/api/v2/twilio/callbacks/recording`,
      });
      const client = dial.client({
         statusCallbackEvent: 'initiated ringing answered completed',
         statusCallback: `${baseUrl}/api/v2/twilio/callbacks/call-progress`,
         statusCallbackMethod: 'POST',
      });
      client.identity(reqBody?.userId);

      await twilioClient
         .calls(reqBody?.callSid)
         .update({
            twiml: response.toString(),
         })
         .then(() => {
            // Remove all Bull queue jobs associated with callSid
            removeJobsFromQueue(reqBody?.callSid);
         })
         .catch((err: any) => console.log('err:', err));

      return NextResponse.json({ success: true }, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function notifyChannelsOnClient(channelIds: Array<string>, data: any) {
   const client = new Ably.Realtime(`${process.env.ABLY_ROOT_KEY}`);

   channelIds.forEach((id) => {
      const channel = client.channels.get(id);
      channel.publish({ name: 'call-answered', data });
   });
}

async function removeJobsFromQueue(callSid: string) {
   if (actionsQueue) {
      const jobs = await actionsQueue.getDelayed();
      if (!jobs?.length) return;
      jobs.forEach((job) => {
         if (callSid === job?.data?.incomingCall?.CallSid) {
            return job.remove();
         }
      });
   }
}
