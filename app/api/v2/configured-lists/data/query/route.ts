import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';

async function queryConfiguredListsData(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);

      const tableName = request.nextUrl.searchParams.get('tableName');
      if (!tableName) throw new LumError(400, `No tablename passed as param...`);

      const results = await db[tableName].unscoped().findAll({
         ...filterData,
         where: {
            ...filterData?.where,
            // ...(typeof filterData?.where?.archived === 'undefined' && { archived: false }),
         },
         limit: filterData?.limit && filterData?.limit <= 380 ? filterData?.limit : 380,
         // paranoid: false,
      });

      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryConfiguredListsData as POST };
