import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import { kv } from '@vercel/kv';
const twilio = require('twilio');
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
   try {
      const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      const queues = await client.queues.list({ friendlyName: 'inbound-call-queue', limit: 1 });
      if (!queues?.length) throw new LumError(400, 'Twilio queue not found');

      const queueSid = queues[0].sid;
      const callsInQueue = await client.queues(queueSid).members.list();

      const queueCalls = [];

      for (const call of callsInQueue) {
         const callData = await client.calls(call.callSid).fetch();
         const fromNumber = callData.from;

         const foundLead = await db.leads.findOne({
            where: { phoneNumber: fromNumber },
            attributes: ['id', 'firstName', 'lastName'],
         });

         const notifiedChannels = await kv.get(call.callSid);
         queueCalls.push({
            from: callData.from,
            callSid: call.callSid,
            callStartTime: call.dateEnqueued,
            leadId: foundLead?.id,
            leadName: [foundLead?.firstName, foundLead?.lastName].some((val: any) => !!val)
               ? `${foundLead?.firstName || ''} ${foundLead?.lastName || ''}`.trim()
               : null,
            notifiedChannels: notifiedChannels || [],
         });
      }

      return NextResponse.json(queueCalls || [], { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
