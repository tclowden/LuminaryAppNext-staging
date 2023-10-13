import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
   try {
      const statuses = await db.statuses
         .findAll({
            include: [
               {
                  model: db.rulesOnStatuses,
                  required: false,
                  include: [
                     {
                        model: db.statusRulesTypes,
                     },
                  ],
               },
            ],
         })
         .catch((err: any) => {
            console.log('ERR: ', err);
            throw new LumError(400, err);
         });

      return NextResponse.json(statuses, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
