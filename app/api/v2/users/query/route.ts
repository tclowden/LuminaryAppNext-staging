import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { Op, Sequelize } from 'sequelize';

async function queryUsers(request: NextRequest) {
   try {
      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);
      const userResults = await db.users.unscoped().findAll({
         ...filterData,
         where: {
            ...filterData?.where,
            // ...(typeof filterData?.where?.archived === 'undefined' && { archived: false }),
         },
         // paranoid: false,
      });

      return NextResponse.json(userResults, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function queryUsersBySearchParam(request: NextRequest, options: any) {
   try {
      const searchParams = new URLSearchParams(request.nextUrl.searchParams);
      const fullName = searchParams.get('fullName');
      const userResults = await db.users.findAll({
         offset: 0,
         limit: 10,
         // where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), {
         //    [Op.like]: `%${name?.toLowerCase()}%`,
         // }),
         where: Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.fn('concat', Sequelize.col('firstName'), ' ', Sequelize.col('lastName'))),
            {
               [Op.iLike]: `%${fullName}%`,
            }
         ),
      });

      return NextResponse.json(userResults, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryUsersBySearchParam as GET };
export { queryUsers as POST };
