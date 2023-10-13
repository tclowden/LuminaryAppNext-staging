import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
export const dynamic = 'force-dynamic';

async function getStages(request: NextRequest, options: any) {
   try {
      const productStages = await db.productStages.findAll({
         include: [
            { model: db.productsLookup, as: 'productsLookup', required: false },
            { model: db.stageTypesLookup, as: 'stageType', required: false },
         ],
         order: [['name', 'ASC']], // order by created at ASC
      });
      return NextResponse.json(productStages, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createStage(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
         stageTypeId: Yup.string().required(),
         // webhookUrl: Yup.string().nullable().url(),
         webhookUrl: Yup.string()
            .nullable()
            .matches(/^https?:\/\/(www\.)?[a-zA-Z0-9\-\.]+(:\d{1,5})?(\/[a-zA-Z0-9\-]+)*\/?$/, 'Must be a valid url.'),
      });
      await schema.validate(reqBody);

      // validate the stageTypeId exists
      const stageTypeIdExists = await db.stageTypesLookup.findByPk(reqBody.stageTypeId);
      if (!stageTypeIdExists) throw new LumError(400, `Stage type with id: ${reqBody.stageTypeId} doesn't exist.`);

      const createdProductStage = await db.productStages.create(reqBody);

      return NextResponse.json(createdProductStage, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createStage as POST };

export { getStages as GET };
