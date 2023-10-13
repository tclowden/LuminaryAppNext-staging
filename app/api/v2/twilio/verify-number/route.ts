import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';

export async function POST(request: NextRequest): Promise<NextResponse> {
   try {
      const { phoneNumber } = await request.json();
      if (!phoneNumber) {
         return NextResponse.json(null, { status: 400 });
      }

      const formattedPhoneNumber = ensureCountryCode(phoneNumber);
      const foundLead = await db.leads.findOne({ where: { phoneNumber: formattedPhoneNumber } });
      if (foundLead?.phoneVerified) {
         return NextResponse.json({ verifiedNumber: foundLead.phoneNumber }, { status: 200 });
      }

      const verifiedNumber = await lookupPhoneNumber(formattedPhoneNumber);

      if (verifiedNumber && foundLead) {
         foundLead.phoneVerified = true;
         await foundLead.save();
      }

      return NextResponse.json({ verifiedNumber: verifiedNumber }, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

function ensureCountryCode(phoneNumber: string) {
   // Remove any existing country code and special characters
   const cleanedNumber = phoneNumber.replace(/[^\d]/g, '');
   // Add the '+1' country code
   return `+1${cleanedNumber}`;
}

function lookupPhoneNumber(phoneNumber: string) {
   const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
   return client.lookups.v2
      .phoneNumbers(phoneNumber)
      .fetch({ type: 'carrier' })
      .then((response: any) => {
         return response.phoneNumber;
      })
      .catch((err: any) => {
         throw new Error(err.message);
      });
}
