import { NextRequest, NextResponse } from 'next/server';
const VoiceResponse = require('twilio').twiml.VoiceResponse;

export async function POST(request: NextRequest) {
   try {
      const response = new VoiceResponse();

      const res = new NextResponse(response, { status: 200 });
      res.headers.set('Content-Type', 'text/xml');
      return res;
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
