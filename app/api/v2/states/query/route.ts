import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';

async function queryStates(request: NextRequest) {
   try {
      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);
      const statesRes = await db.statesLookup.unscoped().findAll({
         ...filterData,
         where: {
            ...filterData?.where,
            // ...(typeof filterData?.where?.archived === 'undefined' && { archived: false }),
         },
      });

      return NextResponse.json(statesRes, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryStates as POST };
