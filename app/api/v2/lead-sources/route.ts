import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
   try {
      const leadSources = await db.leadSources
         .findAll({
            include: {
               model: db.leadSourceTypes,
               required: false,
            },
            order: [['name', 'ASC']],
         })
         .catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

      return NextResponse.json(leadSources, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
