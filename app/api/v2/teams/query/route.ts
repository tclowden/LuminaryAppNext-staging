import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { Op, Sequelize } from 'sequelize';

async function queryTeams(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);
      const teamsResults = await db.teams.unscoped().findAll({
         ...filterData,
         where: {
            ...filterData?.where,
            // ...(typeof filterData?.where?.archived === 'undefined' && { archived: false }),
         },
      });

      return NextResponse.json(teamsResults, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function queryUsersBySearchParam(request: NextRequest, options: any) {
   try {
      const searchParams = new URLSearchParams(request.nextUrl.searchParams);
      const name = searchParams.get('name');
      const results = await db.teams.findAll({
         offset: 0,
         limit: 10,
         where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), {
            [Op.iLike]: `%${name?.toLowerCase()}%`,
         }),
         include: [{ model: db.users, as: 'users', required: false }],
      });

      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryUsersBySearchParam as GET };
export { queryTeams as POST };
