import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
   try {
      const statusRules = await db.statuses
         .findAll({
            attributes: ['id', 'name', 'typeId'],
            include: [
               {
                  model: db.rulesOnStatuses,
                  as: 'rulesOnStatuses',
                  required: false,
                  include: [
                     {
                        model: db.statusRulesTypes,
                        as: 'statusRulesType',
                        required: false,
                     },
                  ],
               },
               {
                  model: db.statusTypes,
                  attributes: ['id', 'name'],
               },
            ],
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      return NextResponse.json(statusRules, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
