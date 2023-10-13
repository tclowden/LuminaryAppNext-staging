import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
   try {
      const statusRuleTypes = await db.statusRulesTypes
         .findAll({
            order: [['name', 'ASC']],
         })
         .catch((err: any) => {
            throw new LumError(500, err);
         });

      return NextResponse.json(statusRuleTypes, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
