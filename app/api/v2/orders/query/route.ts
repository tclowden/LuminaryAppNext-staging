import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { Op, Sequelize } from 'sequelize';
export const dynamic = 'force-dynamic';

async function queryWorkOrders(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);
      const results = await db.orders.unscoped().findAll({
         ...filterData,
         where: {
            ...filterData?.where,
            // ...(typeof filterData?.where?.archived === 'undefined' && { archived: false }),
         },
         // paranoid: false,
      });

      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function queryOrdersBySearchValue(request: NextRequest, options: any) {
   try {
      const searchParams = new URLSearchParams(request.nextUrl.searchParams);
      const leadName = searchParams.get('leadName');
      console.log('here...');
      const orderResults = await db.orders.unscoped().findAll({
         offset: 0,
         limit: 10,
         include: [
            {
               model: db.leads,
               required: false,
               as: 'lead',
               where: Sequelize.where(
                  Sequelize.fn('concat', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')),
                  {
                     [Op.like]: `%${leadName}%`,
                  }
               ),
            },
         ],
      });

      return NextResponse.json(orderResults, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryOrdersBySearchValue as GET };
export { queryWorkOrders as POST };
