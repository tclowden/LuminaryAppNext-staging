import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function GET(request: NextRequest) {
   try {
      const callRouteActionTypes = await db.callRouteActionTypesLookup.findAll().catch((err: any) => {
         console.log('err:', err);
         throw new LumError(400, err);
      });

      return NextResponse.json(callRouteActionTypes, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
