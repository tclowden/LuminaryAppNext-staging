import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { validateRolesOnProductCoordinator } from './validators';
import { upsert } from '@/utilities/api/helpers';
export const dynamic = 'force-dynamic';

async function getProductCoordinators(request: NextRequest, options: any) {
   try {
      const productCoordinators = await db.productCoordinators.findAll({
         include: [
            { model: db.productsLookup, as: 'productsLookup', required: false },
            // { model: db.roles, required: false },
            {
               model: db.rolesOnProductCoordinators,
               required: false,
               as: 'rolesOnProductCoordinator',
               include: [{ model: db.roles, as: 'role', required: false }],
            },
         ],
         order: [['name', 'ASC']], // order by created at ASC
      });

      return NextResponse.json(productCoordinators, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createProductCoordinator(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
         rolesOnProductCoordinator: Yup.array().required(),
      });
      await schema.validate(reqBody);

      if (!!reqBody.rolesOnProductCoordinator?.length) await validateRolesOnProductCoordinator(reqBody);

      const createdProdCoord = await db.productCoordinators.create(reqBody);

      if (!!reqBody.rolesOnProductCoordinator?.length) {
         const rolesToCreate = [...reqBody.rolesOnProductCoordinator].map((roleOnProdCoord: any) => {
            return {
               ...roleOnProdCoord,
               productCoordinatorId: createdProdCoord.id,
            };
         });
         for (const roleOnProdCoord of rolesToCreate) {
            await upsert(roleOnProdCoord, 'rolesOnProductCoordinators', db);
         }
      }

      return NextResponse.json(createdProdCoord, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createProductCoordinator as POST };

export { getProductCoordinators as GET };
