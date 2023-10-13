import { NextRequest, NextResponse } from 'next/server';
import Ably from 'ably/promises';

export async function GET(request: NextRequest) {
   try {
      const client = new Ably.Realtime(`${process.env.ABLY_ROOT_KEY}`);

      const date = new Date();
      const stats = await client.stats({
         start: `${new Date()}`,
         end: `${date.setMinutes(date.getMinutes() - 5)}`,
         limit: '100',
      });

      console.log('stats:', stats.current());
      return NextResponse.json(stats, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
