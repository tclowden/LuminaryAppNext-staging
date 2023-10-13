import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { NextRequest, NextResponse } from 'next/server';

async function queryTeamTypes(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);
      const teamTypesRes = await db.teamTypesLookup.unscoped().findAll({
         ...filterData,
         where: {
            ...filterData?.where,
            // ...(typeof filterData?.where?.archived === 'undefined' && { archived: false }),
         },
      });

      return NextResponse.json(teamTypesRes, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryTeamTypes as POST };
