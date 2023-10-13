import db from '@/sequelize/models';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

async function getStagesOnProductByProductId(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      let stagesOnProduct = await db.stagesOnProducts
         .findAll({
            where: { productId: id },
            include: [
               {
                  model: db.productStages,
                  required: false,
                  as: 'productStage',
                  include: [{ model: db.stageTypesLookup, as: 'stageType', required: false }],
               },
               {
                  model: db.stageOnProductRoleConstraints,
                  as: 'excludedRoles',
                  required: false,
               },
               {
                  model: db.fieldsOnProducts,
                  as: 'requiredFieldsOnProduct',
                  required: false,
               },
               {
                  model: db.tasksOnProducts,
                  as: 'requiredTasksOnProduct',
                  required: false,
               },
            ],
            order: [['displayOrder', 'ASC']], // order by created at ASC
         })
         .then(deepCopy);

      return NextResponse.json(stagesOnProduct, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getStagesOnProductByProductId as GET };
