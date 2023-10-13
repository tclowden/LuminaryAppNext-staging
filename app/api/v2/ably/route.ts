import { NextRequest, NextResponse } from 'next/server';
import { getUserDataFromHeaders } from '@/utilities/api/helpers';
import Ably from 'ably/promises';

export async function GET(request: NextRequest) {
   try {
      const userObj = await getUserDataFromHeaders(request.headers);
      const client = new Ably.Realtime(`${process.env.ABLY_ROOT_KEY}`);
      const tokenRequestData = await client.auth.createTokenRequest({ clientId: `${userObj?.id}` });
      return NextResponse.json(tokenRequestData, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
