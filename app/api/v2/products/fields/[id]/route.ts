import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { validateProductFieldOptions } from '../validators';
import { upsert } from '@/utilities/api/helpers';
import { deepCopy } from '@/utilities/helpers';
export const dynamic = 'force-dynamic';

async function deleteProductField(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const productFieldIdExists = await db.productFields.findByPk(id);
      if (!productFieldIdExists) throw new LumError(400, `Product field with id: ${id} doesn't exist...`);

      await db.productFields.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json({ success: true, message: `Product field successfully deleted.` }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function getProductFieldById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const productField = await db.productFields
         .findByPk(id, {
            include: [
               { model: db.productFieldOptions, required: false },
               { model: db.fieldTypesLookup, as: 'fieldType', required: false },
               { model: db.configuredListsLookup, as: 'configuredList', required: false },
            ],
            required: false,
         })
         .then(deepCopy);

      // reformat the whereCondition
      if (productField?.whereCondition) {
         if (productField?.configuredList?.tableName === 'users') {
            const temp = JSON.parse(productField.whereCondition);
            productField['whereCondition'] = { roleId: temp['roleId']['[Op.in]'] };
         } else if (productField?.configuredList?.tableName === 'proposalOptions') {
            const temp = JSON.parse(productField.whereCondition);
            console.log('temp:', temp);
            productField['whereCondition'] = temp;
         }
      }

      return NextResponse.json(productField, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateProductField(request: NextRequest, options: any) {
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

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

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

      // delete the id out of the obj, don't want to rewrite the id...
      if (reqBody?.id) delete reqBody['id'];

      if (reqBody.configuredList && reqBody?.whereCondition) {
         if (reqBody?.configuredList?.tableName === 'users' && reqBody?.whereCondition?.roleId) {
            // structure the where condition
            reqBody['whereCondition'] = JSON.stringify({ roleId: { '[Op.in]': [...reqBody?.whereCondition?.roleId] } });
         } else if (reqBody?.configuredList?.tableName === 'proposalOptions') {
            reqBody['whereCondition'] = JSON.stringify(reqBody.whereCondition);
         } else delete reqBody['whereCondition']; // should only have a where condition if there tablename is users and proposalOptions for now
      } else if (!reqBody.configuredListId && reqBody?.whereCondition) delete reqBody['whereCondition']; // should only have a where condition if there is a configuredListId

      const updatedProductField = await db.productFields
         .update(reqBody, {
            where: { id: id },
            returning: true,
            individualHooks: true,
         })
         .then((res: any) => res[1][0] || res[1] || res);

      // update / create / archive product field options
      if (!!reqBody.productFieldOptions?.length) {
         const productFieldOptionsCopy = [...reqBody.productFieldOptions].map((option: any) => ({
            ...option,
            productFieldId: id,
         }));
         for (const prodFieldOption of productFieldOptionsCopy) {
            await upsert(prodFieldOption, 'productFieldOptions', db);
         }
      }

      return NextResponse.json(updatedProductField, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { updateProductField as PUT };
export { getProductFieldById as GET };
export { deleteProductField as DELETE };
