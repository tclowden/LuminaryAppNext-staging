import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      let filterData = queryObjFormatter(reqBody, db);
      const pagesRes = await db.permissions
         .unscoped()
         .findAll({ ...filterData })
         .catch((err: any) => {
            throw new LumError(400, err);
         });
      return NextResponse.json(pagesRes, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
