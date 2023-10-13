import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';
import { LumError } from '@/utilities/models/LumError';
import { deepCopy } from '@/utilities/helpers';
export const dynamic = 'force-dynamic';

async function queryStagesOnProduct(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      let { id } = options?.params;

      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);
      const results = await db.stagesOnProducts
         .unscoped()
         .findAll({
            ...filterData,
            where: {
               productId: id,
               ...filterData?.where,
            },
         })
         .then(deepCopy);

      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { queryStagesOnProduct as POST };
