import db from '@/sequelize/models';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

async function getCoordinatorsOnProductByProductId(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      let coordinatorsOnProduct = await db.coordinatorsOnProducts
         .findAll({
            where: { productId: id },
            include: [
               {
                  model: db.productCoordinators,
                  required: false,
                  as: 'productCoordinator',
                  include: [
                     // {
                     //    model: db.rolesOnProductCoordinators,
                     //    as: 'rolesOnProductCoordinator',
                     //    required: false,
                     //    // include: [{ model: db.roles, as: 'role', required: false }],
                     // },
                     // only need roles for faster querying... not roles on product coordinators
                     {
                        model: db.roles,
                        as: 'roles',
                        required: false,
                     },
                  ],
               },
            ],
         })
         .then(deepCopy);

      return NextResponse.json(coordinatorsOnProduct, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getCoordinatorsOnProductByProductId as GET };
