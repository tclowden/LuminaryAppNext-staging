import { NextRequest, NextResponse } from 'next/server';
const VoiceResponse = require('twilio').twiml.VoiceResponse;
import db from '@/sequelize/models';
import { convertFormDataToJson } from '@/utilities/helpers';

export async function POST(request: NextRequest) {
   try {
      const statusData: any = convertFormDataToJson(await request.formData());

      const response = new VoiceResponse();

      await db.callLogs.update(
         { callStatus: statusData?.CallStatus, duration: statusData?.CallDuration },
         { where: { sid: statusData?.ParentCallSid } }
      );

      const res = new NextResponse(response, { status: 200 });
      res.headers.set('Content-Type', 'text/xml');
      return res;
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
