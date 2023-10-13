import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
   try {
      const phoneNumberTypes = await db.phoneNumberTypesLookup.findAll().catch((err: any) => {
         throw new LumError(400, err);
      });

      return NextResponse.json(phoneNumberTypes, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
