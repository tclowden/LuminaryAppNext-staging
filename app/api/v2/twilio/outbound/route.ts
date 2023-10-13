import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { convertFormDataToJson } from '@/utilities/helpers';
const VoiceResponse = require('twilio').twiml.VoiceResponse;
import { kv } from '@vercel/kv';
const twilio = require('twilio');

export async function POST(request: any) {
   try {
      const outboundCallData: any = convertFormDataToJson(await request.formData());
      const toNumber = outboundCallData?.To;
      const fromNumber = outboundCallData?.From;
      const callerId = outboundCallData?.CallerId;
      const friendlyName = outboundCallData?.FriendlyName;
      const response = new VoiceResponse();
      const baseUrl = process.env.NODE_ENV === 'development' ? process.env.NGROK_ROOT_URL : process.env.CLIENT_SITE;
      const userId = outboundCallData?.Caller.split(':')[1];
      const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      if (toNumber === 'inbound-call-queue') {
         const dial = response.dial({
            From: fromNumber,
            callerId: callerId || fromNumber,
            timeout: 25,
            record: 'record-from-ringing-dual',
            recordingStatusCallback: `${baseUrl}/api/v2/twilio/callbacks/recording`,
            action: `${baseUrl}/api/v2/twilio/callbacks/dial-status`,
            method: 'POST',
         });
         dial.queue(
            {
               url: `${baseUrl}/api/v2/twilio/callbacks/about-to-connect-call`,
            },
            'inbound-call-queue'
         );
      } else {
         await kv.setex(friendlyName, 3600, {
            to: toNumber,
            from: fromNumber,
            userId: userId,
         });

         const dial = response.dial({
            callerId: fromNumber,
            timeout: 25,
            record: 'record-from-ringing-dual',
            recordingStatusCallback: `${baseUrl}/api/v2/twilio/callbacks/recording`,
         });

         dial.conference(friendlyName, {
            startConferenceOnEnter: true,
            endConferenceOnExit: false,
            beep: false,
            statusCallback: `${baseUrl}/api/v2/twilio/callbacks/conference/${friendlyName}`,
            method: 'POST',
            statusCallbackEvent: 'start end join leave mute hold',
         });

         await client.calls.create({
            to: toNumber,
            from: fromNumber,
            twiml:
               '<Response><Dial><Conference startConferenceOnEnter="true" endConferenceOnExit="true" beep="false" timeout="25">' +
               friendlyName +
               '</Conference></Dial></Response>',
         });
      }

      const foundLead = await db.leads.findOne({ where: { phoneNumber: toNumber } });

      await storeCallData(foundLead?.id, userId, outboundCallData);

      const res = new NextResponse(response, { status: 200 });
      res.headers.set('Content-Type', 'text/xml');
      return res;
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function storeCallData(leadId: string, userId: string, payload: any) {
   try {
      return await db.callLogs
         .create({
            leadId: leadId,
            userId: userId,
            sid: payload?.CallSid,
            from: payload?.From,
            to: payload?.To,
            callStatus: payload?.CallStatus,
            direction: 'outbound',
         })
         .catch((err: any) => console.log('err: ', err));
   } catch (err: any) {
      throw new LumError(400, err);
   }
}

export const dynamic = 'force-dynamic';
