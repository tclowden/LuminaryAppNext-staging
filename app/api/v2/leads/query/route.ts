import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { Op, Sequelize } from 'sequelize';

async function queryLeads(request: NextRequest) {
   try {
      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);
      const leadResults = await db.leads.unscoped().findAll({
         ...filterData,
         where: {
            ...filterData?.where,
            // ...(typeof filterData?.where?.archived === 'undefined' && { archived: false }),
         },
         // paranoid: false,
      });

      return NextResponse.json(leadResults, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function queryLeadsByName(request: NextRequest, options: any) {
   try {
      const searchParams = new URLSearchParams(request.nextUrl.searchParams);
      const fullName = searchParams.get('fullName');
      const leadResults = await db.leads.unscoped().findAll({
         offset: 0,
         limit: 10,
         where: Sequelize.where(Sequelize.fn('concat', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')), {
            [Op.iLike]: `%${fullName}%`,
         }),
      });

      return NextResponse.json(leadResults, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryLeads as POST };
export { queryLeadsByName as GET };
