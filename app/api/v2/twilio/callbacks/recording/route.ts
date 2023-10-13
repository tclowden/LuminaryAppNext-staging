import { NextRequest, NextResponse } from 'next/server';
const VoiceResponse = require('twilio').twiml.VoiceResponse;
// import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { convertFormDataToJson } from '@/utilities/helpers';

export async function POST(request: NextRequest) {
   try {
      const recordingData: any = convertFormDataToJson(await request.formData());

      const response = new VoiceResponse();

      await updateCallLog(recordingData);

      const res = new NextResponse(response, { status: 200 });
      res.headers.set('Content-Type', 'text/xml');
      return res;
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateCallLog(payload: any) {
   try {
      return await db.callLogs.update({ recordingUrl: payload?.RecordingUrl }, { where: { sid: payload?.CallSid } });
   } catch (err: any) {
      console.log(err);
      throw new Error(err.message);
   }
}
