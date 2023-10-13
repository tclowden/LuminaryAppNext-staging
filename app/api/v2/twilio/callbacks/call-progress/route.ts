import { convertFormDataToJson } from '@/utilities/helpers';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
const VoiceResponse = require('twilio').twiml.VoiceResponse;

export async function POST(request: NextRequest) {
   try {
      const callProgressData: any = convertFormDataToJson(await request.formData());

      const response = new VoiceResponse();

      if (callProgressData?.CallStatus === 'in-progress') {
         // const io = socket.getIO();
         // if (io) {
         //    io.emit('call-answered', { callSid: callProgressData?.ParentCallSid });
         // }
         if (callProgressData?.to?.includes('client')) {
            const userId = callProgressData?.to.split(':')[1];
         }
      }
      await updateCallStatus(callProgressData);

      const res = new NextResponse(response, { status: 200 });
      res.headers.set('Content-Type', 'text/xml');
      return res;
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateCallStatus(payload: any) {
   try {
      const userId = getUserId(payload?.To);
      return await db.callLogs.update(
         { callStatus: payload?.CallStatus, duration: payload?.CallDuration, userId },
         { where: { sid: payload?.ParentCallSid } }
      );
   } catch (err: any) {
      console.log(err);
      throw new Error(err.message);
   }
}

function getUserId(clientString: string | null = null) {
   if (!clientString) return clientString;
   return clientString.split(':')[1] || null;
}
