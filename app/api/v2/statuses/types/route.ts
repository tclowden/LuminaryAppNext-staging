import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
   try {
      const statusTypes = await db.statusTypes.findAll();

      return NextResponse.json(statusTypes, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
