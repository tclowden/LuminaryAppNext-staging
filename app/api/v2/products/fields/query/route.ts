import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { Op, Sequelize } from 'sequelize';
export const dynamic = 'force-dynamic';

async function queryFields(request: NextRequest) {
   try {
      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);
      const results = await db.productFields.unscoped().findAll({
         ...filterData,
         where: {
            ...filterData?.where,
         },
      });

      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function queryFieldsBySearchParam(request: NextRequest, options: any) {
   try {
      const searchParams = new URLSearchParams(request.nextUrl.searchParams);
      const label = searchParams.get('label');

      const results = await db.productFields.unscoped().findAll({
         offset: 0,
         limit: 10,
         where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('label')), {
            [Op.like]: `%${label?.toLowerCase()}%`,
         }),
      });

      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryFieldsBySearchParam as GET };
export { queryFields as POST };
