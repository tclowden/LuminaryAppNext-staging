import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
const twilio = require('twilio');

export async function POST(request: NextRequest) {
   try {
      const { phoneNumbers } = await request.json();

      if (!phoneNumbers?.length) throw new LumError(400, 'Must Provide Available Phone Number(s)');

      const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      const purchasedPhoneNumberPromises = phoneNumbers.map(async (number: any) => {
         const purchasedNumber = await client.incomingPhoneNumbers
            .create({
               phoneNumber: `${number?.phoneNumber}`,
               voiceUrl: `${process.env.CLIENT_SITE}/api/v2/twilio/inbound`,
            })
            .catch((err: any) => {
               console.log('Purchase Error:', err);
               throw new LumError(500, err);
            });

         const newPhoneNumber = await db.phoneNumbers.create({
            number: number?.phoneNumber,
            numberSID: purchasedNumber?.sid,
            active: true,
            typeId: number?.type?.id,
         });

         // if lead source type, create phoneNumbersOnLeadSources
         if (number?.type?.name === 'Lead Source' && number?.leadSource?.id) {
            await db.phoneNumbersOnLeadSources.create({
               phoneNumberId: newPhoneNumber.id,
               leadSourceId: number?.leadSource?.id,
            });
         }
         // if User type, create phoneNumbersOnUsers
         if (number?.type?.name === 'User' && number?.user?.id) {
            await db.phoneNumbersOnUsers.create({
               phoneNumberId: newPhoneNumber.id,
               userId: number?.user?.id,
            });
         }
         // create reputationOnPhoneNumbers
         if (number?.reputation) {
            await db.reputationOnPhoneNumbers.create({
               phoneNumberId: newPhoneNumber.id,
               score: 100 - number?.reputation,
            });
         }

         return newPhoneNumber;
      });

      const newlyPurchasedPhoneNumbers = await Promise.all(purchasedPhoneNumberPromises);

      return NextResponse.json(newlyPurchasedPhoneNumbers, { status: 200 });
   } catch (err: any) {
      console.error('/api/v2/twilio/phone-numbers/buy -> err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
