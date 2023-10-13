import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { getObjectProp } from '@/utilities/helpers';
const twilio = require('twilio');

export async function PUT(request: NextRequest, options: { params: { id: string } }) {
   try {
      const { id } = options.params;

      if (!id) throw new LumError(400, `Invalid Id in params.`);

      const reqBody = await request.json();

      const phoneNumberId = id;
      const phoneNumber = await db.phoneNumbers.findByPk(phoneNumberId).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!phoneNumber) throw new LumError(400, `Phone Number with id: "${phoneNumberId}" doesn't exist.`);

      const previousType = getObjectProp(reqBody, ['prevState', 'type']);
      const currentType = getObjectProp(reqBody, ['newState', 'type']);

      if (previousType.id === currentType.id) {
         // if type user or lead source, then check if assigned user or lead source has changed
         if (currentType.name === 'Lead Source') {
            const previousLeadSource = getObjectProp(reqBody, [
               'prevState',
               'leadSourcesOnPhoneNumber',
               0,
               'leadSource',
            ]);
            const currentLeadSource = getObjectProp(reqBody, ['newState', 'leadSourcesOnPhoneNumber', 0, 'leadSource']);

            if (previousLeadSource?.id !== currentLeadSource?.id) {
               // Archive previous association
               await db.phoneNumbersOnLeadSources
                  .destroy({
                     where: { id: getObjectProp(reqBody, ['leadSourcesOnPhoneNumber', 0, 'id']) },
                  })
                  .catch((err: any) => {
                     throw new LumError(400, err);
                  });

               // Create new association
               db.phoneNumbersOnLeadSources
                  .create({ leadSourceId: currentLeadSource?.id, phoneNumberId: phoneNumberId })
                  .catch((err: any) => {
                     throw new LumError(400, err);
                  });
            }
         } else if (currentType.name === 'User') {
            const previousUser = getObjectProp(reqBody, ['prevState', 'usersOnPhoneNumber', 0, 'user']);
            const currentUser = getObjectProp(reqBody, ['newState', 'usersOnPhoneNumber', 0, 'user']);
            if (previousUser?.id !== currentUser?.id) {
               // Archive previous association
               await db.phoneNumbersOnUsers
                  .destroy({ where: { id: getObjectProp(reqBody, ['prevState', 'usersOnPhoneNumber', 0, 'id']) } })
                  .catch((err: any) => {
                     throw new LumError(400, err);
                  });

               // Create new association
               db.phoneNumbersOnUsers
                  .create({ userId: currentUser.id, phoneNumberId: phoneNumber.id })
                  .catch((err: any) => {
                     throw new LumError(400, err);
                  });
            }
         }
      } else {
         if (previousType.name === 'Lead Source') {
            await db.phoneNumbersOnLeadSources
               .destroy({
                  where: { id: getObjectProp(reqBody, ['prevState', 'leadSourcesOnPhoneNumber', 0, 'id']) },
               })
               .catch((err: any) => {
                  throw new LumError(400, err);
               });
         } else if (previousType.name === 'User') {
            await db.phoneNumbersOnUsers
               .destroy({ where: { id: getObjectProp(reqBody, ['prevState', 'usersOnPhoneNumber', 0, 'id']) } })
               .catch((err: any) => {
                  throw new LumError(400, err);
               });
         }

         phoneNumber.typeId = currentType.id;

         if (currentType.name === 'Lead Source') {
            const currentLeadSource = getObjectProp(reqBody, ['newState', 'leadSourcesOnPhoneNumber', 0, 'leadSource']);
            db.phoneNumbersOnLeadSources
               .create({ leadSourceId: currentLeadSource?.id, phoneNumberId: phoneNumberId })
               .catch((err: any) => {
                  throw new LumError(400, err);
               });
         } else if (currentType.name === 'User') {
            const currentUser = getObjectProp(reqBody, ['newState', 'usersOnPhoneNumber', 0, 'user']);
            db.phoneNumbersOnUsers
               .create({ userId: currentUser?.id, phoneNumberId: phoneNumber.id })
               .catch((err: any) => {
                  throw new LumError(400, err);
               });
         }
      }
      if (phoneNumber.active !== getObjectProp(reqBody, ['newState', 'active'])) {
         phoneNumber.active = getObjectProp(reqBody, ['newState', 'active']);
      }

      const updatedPhoneNumber = await phoneNumber.save();

      return NextResponse.json(updatedPhoneNumber, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function DELETE(request: NextRequest, options: { params: { id: string } }) {
   try {
      const { id } = options.params;

      if (!id) throw new LumError(400, `Invalid Id in params.`);

      const phoneNumberExists = await db.phoneNumbers.findByPk(id).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!phoneNumberExists) throw new LumError(400, `Phone Number with id: "${id}" doesn't exist.`);

      if (!phoneNumberExists?.numberSID) throw new LumError(400, `Invalid Phone Number SID`);

      const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client
         .incomingPhoneNumbers(phoneNumberExists.numberSID)
         .remove()
         .catch((err: any) => {
            // If Phone Number was not found on twilio (status = 404), then continue to delete number from Luminary Database. Otherwise throw error
            if (err?.status == 404) {
               console.log('/api/v2/phone-numbers/[id] DELETE -> Phone Number not found on Twilio. Error:', err);
            } else {
               throw new LumError(500, err);
            }
         });

      await db.phoneNumbers.destroy({ where: { id: id }, individualHooks: true }).catch((err: any) => {
         throw new LumError(400, err);
      });

      return NextResponse.json({ success: true, message: 'Phone Number successfully deleted.' }, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/phone-numbers/[id] DELETE -> Error:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
