import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
   try {
      const phoneNumbers = await db.phoneNumbers
         .findAll({
            include: [
               {
                  model: db.phoneNumbersOnUsers,
                  as: 'usersOnPhoneNumber',
                  required: false,
                  include: { model: db.users, required: false },
               },
               {
                  model: db.phoneNumbersOnLeadSources,
                  as: 'leadSourcesOnPhoneNumber',
                  required: false,
                  include: { model: db.leadSources, required: false },
               },
               {
                  model: db.phoneNumbersOnCallRoutes,
                  as: 'callRoutesOnPhoneNumber',
                  required: false,
                  include: { model: db.callRoutes, required: false },
               },
               {
                  model: db.phoneNumberTypesLookup,
                  as: 'type',
                  attributes: ['id', 'name'],
                  required: false,
               },
               {
                  model: db.reputationOnPhoneNumbers,
                  as: 'reputation',
                  order: [['createdAt', 'DESC']],
                  limit: 1,
                  attributes: ['id', 'score', 'createdAt'],
                  required: false,
               },
            ],
         })
         .catch((err: any) => {
            console.log('err:', err);
            throw new Error(JSON.stringify(err));
         });

      return NextResponse.json(phoneNumbers, { status: 200 });
   } catch (err: any) {
      console.log('ERR At PHONE numbers: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
