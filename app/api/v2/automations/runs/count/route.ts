import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import { Op, Sequelize } from 'sequelize';

async function getTotalAutomationRunsCount(request: NextRequest, options: any) {
   try {
      const searchParams = new URLSearchParams(request.nextUrl.searchParams);
      let automationId = searchParams.get('automationId')?.toLowerCase() || null;
      if (!automationId) throw new LumError(400, `Must specify a automation type in the params.`);

      const count = await db.automations.count({
         where: {
            ...(automationId && { automationId: automationId }),
         },
      });

      return NextResponse.json(count, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getTotalAutomationRunsCount as GET };
