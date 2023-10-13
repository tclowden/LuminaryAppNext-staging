import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';

async function queryAutomationsBySearchValue(request: NextRequest, options: any) {
   try {
      const searchParams = new URLSearchParams(request.nextUrl.searchParams);
      const automationId = searchParams.get('automationId');

      const whereConditions: any = {};
      if (automationId) whereConditions['automationId'] = { [Op.eq]: automationId };

      const results = await db.automationRuns.unscoped().findAll({
         offset: 0,
         // limit: 10,
         where: { ...whereConditions },
      });

      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryAutomationsBySearchValue as GET };
