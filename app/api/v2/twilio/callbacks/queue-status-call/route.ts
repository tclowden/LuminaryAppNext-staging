import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { convertFormDataToJson } from '@/utilities/helpers';
import { kv } from '@vercel/kv';
import Ably from 'ably/promises';

export async function POST(request: NextRequest): Promise<NextResponse> {
   try {
      const statusData: any = convertFormDataToJson(await request.formData());

      if (statusData?.QueueResult === 'hangup') {
         // const reply: string | null = await kv.get(statusData?.CallSid);
         const notifiedChannels = (await kv.get(statusData?.CallSid)) as any[];
         if (!notifiedChannels?.length) {
            return NextResponse.json(null, { status: 404 });
         }

         const client = new Ably.Realtime(`${process.env.ABLY_ROOT_KEY}`);
         const channels = notifiedChannels.map((ch) => client.channels.get(ch));

         channels.forEach((channel) => {
            channel.publish({
               name: 'call-hung-up',
               data: {
                  callSid: statusData?.CallSid,
               },
            });
         });

         await db.callLogs.update(
            { callStatus: 'queue-hangup', duration: statusData?.QueueTime },
            { where: { sid: statusData?.CallSid } }
         );
      }

      const res = new NextResponse(null, { status: 200 });
      res.headers.set('Content-Type', 'text/xml');
      return res;
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
