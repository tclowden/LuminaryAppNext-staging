import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { Op, Sequelize } from 'sequelize';
export const dynamic = 'force-dynamic';

async function queryTasks(request: NextRequest) {
   try {
      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);
      const results = await db.productTasks.unscoped().findAll({
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

async function queryTasksBySearchParam(request: NextRequest, options: any) {
   try {
      const searchParams = new URLSearchParams(request.nextUrl.searchParams);
      const name = searchParams.get('name');

      const results = await db.productTasks.unscoped().findAll({
         offset: 0,
         limit: 10,
         where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), {
            [Op.like]: `%${name?.toLowerCase()}%`,
         }),
      });

      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryTasksBySearchParam as GET };
export { queryTasks as POST };
