import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import { Op, Sequelize } from 'sequelize';

async function getTotalAutomationCount(request: NextRequest, options: any) {
   try {
      const searchParams = new URLSearchParams(request.nextUrl.searchParams);
      let type = searchParams.get('type')?.toLowerCase() || null;

      // if (type !== 'operations' && type !== 'marketing' && type !== null)
      //    throw new LumError(400, `Must specify a automation type in the params.`);

      const count = await db.automations.count({
         where: {
            ...(type && {type: type}),
         },
      });

      return NextResponse.json(count, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getTotalAutomationCount as GET };
