import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { validateProductFieldOptions } from './validators';
import { upsert } from '@/utilities/api/helpers';
export const dynamic = 'force-dynamic';

async function getProductFields(request: NextRequest, options: any) {
   try {
      const prodFields = await db.productFields.findAll({
         include: [
            { model: db.fieldTypesLookup, as: 'fieldType', required: false },
            { model: db.productsLookup, as: 'productsLookup', required: false },
            // { model: db.productFieldOptions },
         ],
         order: [['createdAt', 'ASC']], // order by created at ASC
      });
      return NextResponse.json(prodFields, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createProductField(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = await Yup.object({
         label: Yup.string().required(),
         placeholder: Yup.string().required(),
         productFieldOptions: Yup.array().required(),
         fieldTypeId: Yup.string().required(),
         configuredListId: Yup.string().required().nullable(),
         whereCondition: Yup.object().nullable(),
      });
      await schema.validate(reqBody);

      // check to see if fieldTypeId exists... will return null if not there
      const fieldTypeExists = await db.fieldTypesLookup.findByPk(reqBody.fieldTypeId);
      if (!fieldTypeExists) throw new LumError(400, `Field type with id: ${reqBody.fieldTypeId} doesn't exist.`);

      // check to see if configuredListId exists... will return null if not there
      if (reqBody.configuredListId) {
         const configuredListIdExists = await db.configuredListsLookup.findByPk(reqBody.configuredListId);
         if (!configuredListIdExists)
            throw new LumError(400, `Configured List with id: ${reqBody.configuredListId} doesn't exist.`);
      }

      if (!!reqBody.productFieldOptions?.length) validateProductFieldOptions(reqBody);

      if (reqBody.configuredList && reqBody?.whereCondition) {
         if (reqBody?.configuredList?.tableName === 'users' && reqBody?.whereCondition?.roleId) {
            // structure the where condition
            reqBody['whereCondition'] = JSON.stringify({ roleId: { '[Op.in]': [...reqBody?.whereCondition?.roleId] } });
         } else if (reqBody?.configuredList?.tableName === 'proposalOptions') {
            reqBody['whereCondition'] = JSON.stringify(reqBody.whereCondition);
         } else delete reqBody['whereCondition']; // should only have a where condition if there tablename is users and proposalOptions for now
      } else if (!reqBody.configuredListId && reqBody?.whereCondition) delete reqBody['whereCondition']; // should only have a where condition if there is a configuredListId

      const createdProductField = await db.productFields.create(reqBody);

      if (!!reqBody.productFieldOptions?.length) {
         const prodFieldOptions = [...reqBody.productFieldOptions].map((option: any) => ({
            ...option,
            productFieldId: createdProductField?.id,
         }));
         for (const option of prodFieldOptions) {
            await upsert(option, 'productFieldOptions', db);
         }
      }

      return NextResponse.json(createdProductField, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createProductField as POST };
export { getProductFields as GET };
