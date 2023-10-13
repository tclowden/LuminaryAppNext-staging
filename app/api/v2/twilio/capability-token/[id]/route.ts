import { getUserDataFromHeaders } from '@/utilities/api/helpers';
import { NextRequest, NextResponse } from 'next/server';
const AccessToken = require('twilio').jwt.AccessToken;

export async function GET(request: NextRequest, params: { params: { id: string } }) {
   try {
      const VoiceGrant = AccessToken.VoiceGrant;
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioApiKey = process.env.TWILIO_API_KEY;
      const twilioApiSecret = process.env.TWILIO_SECRET;

      const outgoingApplicationSid = process.env.TWIMIL_APP_SID;
      const identity = params.params.id;
      const voiceGrant = new VoiceGrant({
         outgoingApplicationSid: outgoingApplicationSid,
         incomingAllow: true, // Optional: add to allow incoming calls
      });
      const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, { identity: identity });
      token.addGrant(voiceGrant);
      return NextResponse.json({ token: token.toJwt() }, { status: 200 });
   } catch (err: any) {
      console.error('err:', err);
      return NextResponse.json(err.message);
   }
}

export const dynamic = 'force-dynamic';
