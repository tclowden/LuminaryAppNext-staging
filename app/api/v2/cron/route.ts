import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import Ably from 'ably/promises';

export async function GET(request: NextRequest) {
   try {
      const client = new Ably.Realtime(`${process.env.ABLY_ROOT_KEY}`);

      const channelIds = await db.roles.findAll({
         where: {
            name: 'Super Secret Dev',
         },
         raw: true,
      });

      const ids = channelIds.map((id: any) => id.id);

      ids.forEach((id: any) => {
         const channel = client.channels.get(id);
         channel.publish({ name: 'cron', data: { message: 'Hello from cron!' } });
      });

      return NextResponse.json(ids, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
