import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

async function queryWorkOrders(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);
      const results = await db.attachmentTypesLookup.findAll({ ...filterData });

      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryWorkOrders as POST };
