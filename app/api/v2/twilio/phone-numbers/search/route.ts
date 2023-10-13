import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
const twilio = require('twilio');

export async function GET(request: NextRequest) {
   try {
      const url = new URL(request.url);
      const state = url.searchParams.get('state');
      const areaCode = url.searchParams.get('areaCode');
      const prefix = url.searchParams.get('prefix');

      const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      const availableNumbers = await client
         .availablePhoneNumbers('US')
         .local.list({
            inRegion: state,
            areaCode: areaCode,
            contains: prefix?.length === 1 ? `*${prefix}*` : prefix,
            smsEnabled: true,
            mmsEnabled: true,
            voiceEnabled: true,
            limit: 10,
         })
         .catch((err: any) => {
            throw new LumError(500, err);
         });

      const numberPromises = availableNumbers.map(async (number: any) => {
         const reputation = await client.lookups.v1
            .phoneNumbers(number?.phoneNumber)
            .fetch({ addOns: 'icehook_scout' })
            .then((result: any) => result?.addOns?.results?.icehook_scout?.result?.risk_level);
         return { ...JSON.parse(JSON.stringify(number)), reputation };
      });
      const numbersWithReputation = await Promise.all(numberPromises);

      return NextResponse.json(numbersWithReputation?.length ? numbersWithReputation : [], { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
