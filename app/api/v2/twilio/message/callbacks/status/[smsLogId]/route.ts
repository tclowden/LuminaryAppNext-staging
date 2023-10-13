import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { convertFormDataToJson } from '@/utilities/helpers';
const { MessagingResponse } = require('twilio').twiml;

export async function POST(request: NextRequest, options: { params: { smsLogId: string } }) {
   try {
      const outgoingMessageStatusData: any = convertFormDataToJson(await request.formData());

      const { smsLogId } = options?.params;

      const smsLog = await db.smsLogs.findByPk(smsLogId);

      if (smsLog) {
         smsLog.deliveryStatus = outgoingMessageStatusData?.MessageStatus;
         await smsLog.save();
      }

      const response = new MessagingResponse();
      const res = new NextResponse(response, { status: 200 });
      res.headers.set('Content-Type', 'text/xml');
      return res;
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
