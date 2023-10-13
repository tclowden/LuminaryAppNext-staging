import db from '@/sequelize/models';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

async function getTasksOnProductByProductId(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      let tasksOnProduct = await db.tasksOnProducts
         .findAll({
            where: { productId: id },
            include: [
               { model: db.productTasks, required: false, as: 'productTask' },
               { model: db.taskDueDateTypesLookup, as: 'taskDueDateType', required: false },
            ],
         })
         .then(deepCopy);

      return NextResponse.json(tasksOnProduct, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getTasksOnProductByProductId as GET };
