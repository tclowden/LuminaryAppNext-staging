import 'dotenv/config';
import db from '@/sequelize/models';
import Twilio from 'twilio';

const syncTwilioNumbers = async () => {
   const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

   const incomingPhoneNumbers = await client.incomingPhoneNumbers.list();

   const phoneNumberType = await db.phoneNumberTypesLookup.findOne({ where: { name: 'Unassigned' }, raw: true });

   let allNumbersFromTwilio: Array<any> = [];

   incomingPhoneNumbers.forEach((i: any) => {
      allNumbersFromTwilio.push({
         number: i.phoneNumber,
         numberSID: i.sid,
         active: true,
         typeId: phoneNumberType?.id || '27c002f8-a382-4cef-b380-8db225389205',
         archived: false,
      });
   });

   const ourPhoneNumbers = await db.phoneNumbers.findAll().catch((err: any) => console.log(err));

   console.log(ourPhoneNumbers);
   console.log(allNumbersFromTwilio);

   const updatedNumbers = allNumbersFromTwilio.filter((numFromTwilio: any) => {
      return !ourPhoneNumbers.some((ourNum: any) => ourNum.numberSID === numFromTwilio.numberSID);
   });

   await db.phoneNumbers.bulkCreate(updatedNumbers).catch((err: any) => console.log(err));

   process.exit();
};

syncTwilioNumbers();
