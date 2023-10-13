import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { validateRolesOnProductCoordinator } from '../validators';
import { upsert } from '@/utilities/api/helpers';
export const dynamic = 'force-dynamic';

async function getProdCoordById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;
      const productCoordinator = await db.productCoordinators.findByPk(id, {
         include: [
            {
               model: db.rolesOnProductCoordinators,
               as: 'rolesOnProductCoordinator',
               include: [{ model: db.roles, required: false, as: 'role' }],
               required: false,
            },
         ],
         required: false,
      });
      return NextResponse.json(productCoordinator, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function deleteProdCoord(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const productCoordIdExists = await db.productCoordinators.findByPk(id);
      if (!productCoordIdExists) throw new LumError(400, `Product coordinator with id: ${id} doesn't exist...`);

      await db.productCoordinators.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json(
         { success: true, message: `Product coordinator successfully deleted.` },
         { status: 200 }
      );
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateProdCoord(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
         rolesOnProductCoordinator: Yup.array().required(),
      });
      await schema.validate(reqBody);

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const productCoordinatorIdExists = await db.productCoordinators.findByPk(id, {
         include: [{ model: db.roles, required: false, as: 'roles' }],
      });
      if (!productCoordinatorIdExists) throw new LumError(400, `Product coordinator with id: '${id}' doesn't exist.`);

      if (!!reqBody.rolesOnProductCoordinator?.length) await validateRolesOnProductCoordinator(reqBody, id);

      // delete the id out of the obj, don't want to rewrite the id...
      if (reqBody.id) delete reqBody['id'];

      const updatedProductCoordinator = await db.productCoordinators
         .update(reqBody, { where: { id: id }, returning: true })
         .then((res: any) => res[1][0] || res[1] || res);

      if (!!reqBody.rolesOnProductCoordinator?.length) {
         const rolesOnProdCoords = [...reqBody.rolesOnProductCoordinator].map((roleOnProdCoord: any) => {
            return { ...roleOnProdCoord, productCoordinatorId: id };
         });
         for (const roleOnProdCoord of rolesOnProdCoords) {
            await upsert(roleOnProdCoord, 'rolesOnProductCoordinators', db);
         }
      }

      return NextResponse.json(updatedProductCoordinator, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { updateProdCoord as PUT };
export { deleteProdCoord as DELETE };
export { getProdCoordById as GET };
