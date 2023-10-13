import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import { Op, Sequelize } from 'sequelize';

async function queryAutomations(request: NextRequest, options: any) {
   try {
      const searchParams = new URLSearchParams(request.nextUrl.searchParams);
      let type = searchParams.get('type')?.toLowerCase() || null;

      // if (type !== 'operations' && type !== 'marketing' && type !== null)
      //    throw new LumError(400, `Must specify a automation type in the params.`);

      // let automationType = null;
      // if (type === 'operations' || type === 'marketing') {
      //    automationType = await db.automationTypesLookup
      //       .findOne({
      //          where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), {
      //             [Op.like]: `%${type?.toLowerCase()}%`,
      //          }),
      //       })
      //       .then(deepCopy);
      // }

      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);

      const results = await db.automations.unscoped().findAll({
         ...filterData,
         where: {
            ...filterData?.where,
            // ...(automationType && { automationTypeId: { [Op.contains]: [automationType?.id] } }),
            ...(type && { type: type }),
         },
         attributes: [
            'id',
            'name',
            'isActive',
            'createdAt',
            [Sequelize.literal('(SELECT COUNT(*) FROM "automationRuns" WHERE "automationRuns"."automationId" = "automations"."id")'), 'totalRuns'],
            [Sequelize.literal('(SELECT COUNT(*) FROM "automationRuns" WHERE "automationRuns"."automationId" = "automations"."id" AND "automationRuns"."statusType" LIKE \'success%\' )'), 'totalSuccess'],
            [Sequelize.literal('(SELECT COUNT(*) FROM "automationRuns" WHERE "automationRuns"."automationId" = "automations"."id" AND "automationRuns"."statusType" LIKE \'failed\' )'), 'totalFailed'],
            [Sequelize.literal('(SELECT COUNT(*) FROM "automationRuns" WHERE "automationRuns"."automationId" = "automations"."id" AND "automationRuns"."statusType" LIKE \'waiting\' )'), 'totalWaiting'],
         ]
      });

      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/automations/query -> POST -> Error:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function queryAutomationsBySearchValue(request: NextRequest, options: any) {
   try {
      const searchParams = new URLSearchParams(request.nextUrl.searchParams);
      const name = searchParams.get('name');
      const type = searchParams.get('type');
      const trigger = searchParams.get('trigger');

      const whereConditions: any = {};
      if (trigger) whereConditions['triggers'] = { [Op.contains]: [{ name: trigger }] };
      if (name) whereConditions['name'] = { [Op.iLike]: `%${name}%` };
      if (type) whereConditions['type'] = { [Op.eq]: type };

      const results = await db.automations.unscoped().findAll({
         offset: 0,
         limit: 10,
         where: { ...whereConditions },
      });

      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/automations/query -> GET -> Error:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryAutomationsBySearchValue as GET };
export { queryAutomations as POST };
