import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
export const dynamic = 'force-dynamic';

async function getStage(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const productStage = await db.productStages.findByPk(id, {
         include: [{ model: db.stageTypesLookup, as: 'stageType', required: false }],
         required: false,
      });

      return NextResponse.json(productStage, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function deleteStage(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const stageIdExists = await db.productStages.findByPk(id);
      if (!stageIdExists) throw new LumError(400, `Product stage with id: ${id} doesn't exist...`);

      await db.productStages.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json(`Product stage successfully deleted.`, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateStage(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
         stageTypeId: Yup.string().required(),
         webhookUrl: Yup.string()
            .nullable()
            .matches(/^https?:\/\/(www\.)?[a-zA-Z0-9\-\.]+(:\d{1,5})?(\/[a-zA-Z0-9\-]+)*\/?$/, 'Must be a valid url.'),
      });
      await schema.validate(reqBody);

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const stageIdExists = await db.productStages.findByPk(id);
      if (!stageIdExists) throw new LumError(400, `Product stage with id: ${id} doesn't exist...`);

      // validate the stageTypeId exists
      const stageTypeIdExists = await db.stageTypesLookup.findByPk(reqBody.stageTypeId);
      if (!stageTypeIdExists) throw new LumError(400, `Stage type with id: ${reqBody.stageTypeId} doesn't exist.`);

      if (reqBody?.id) delete reqBody['id'];

      const updatedProductStage = await db.productStages
         .update(reqBody, { where: { id }, returning: true, individualHooks: true })
         .then((res: any) => res[1][0] || res[1] || res);

      return NextResponse.json(updatedProductStage, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { updateStage as PUT };
export { deleteStage as DELETE };
export { getStage as GET };
