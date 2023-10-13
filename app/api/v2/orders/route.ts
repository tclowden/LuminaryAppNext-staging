import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { foreignKeysExists, validateFieldsOnOrderArr } from './validators';
import db from '@/sequelize/models';
import { deepCopy } from '@/utilities/helpers';
import { fetchDbApi } from '@/serverActions';
import { headers } from 'next/headers';
import { upsert } from '@/utilities/api/helpers';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, options: any) {
   try {
      const orders = await db.orders.findAll({
         limit: 100,
         offset: 0,
         include: [
            { model: db.users, as: 'owner' },
            { model: db.users, as: 'createdBy' },
            { model: db.productsLookup, as: 'product' },
            { model: db.leads, as: 'lead' },
            // {
            //    model: db.fieldsOnOrders,
            //    as: 'fieldsOnOrder',
            //    required: false,
            //    include: [
            //       {
            //          model: db.productFields,
            //          include: [{ model: db.fieldTypesLookup, as: 'fieldType', required: false }],
            //          as: 'productField',
            //       },
            //    ],
            // },
            { model: db.financiersLookup, as: 'financier' },
            { model: db.utilityCompaniesLookup, as: 'utilityCompany' },
         ],
      });
      return NextResponse.json(orders, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function POST(request: NextRequest, options: any) {
   try {
      const nextHeaders = headers();
      const userAuth = nextHeaders.get('authorization');

      const reqBody = await request.json();
      const schema = Yup.object({
         ownerId: Yup.string().required(),
         createdById: Yup.string().required(),
         productId: Yup.string().required(),
         leadId: Yup.string().required(),
         fieldsOnOrder: Yup.array().required(),
         // tasksOnOrder: Yup.array().required(),
         // stagesOnOrder: Yup.array().required(),
         total: Yup.number().required(),
      });
      await schema.validate(reqBody);

      // MAKE SURE ALL FOREIGN KEYS CHECK OUT
      await foreignKeysExists(reqBody);

      // need to validate the fieldsOnOrder
      if (!!reqBody.fieldsOnOrder?.length) await validateFieldsOnOrderArr(reqBody);

      // add default stage to the order being created
      const defaultStage = await db.productStages.findOne({ where: { name: 'Beginning Stage' } }).then(deepCopy);
      if (defaultStage) reqBody['productStageId'] = defaultStage?.id;

      // create the order here
      const createdOrder = await db.orders.create(reqBody);

      if (!!reqBody.fieldsOnOrder?.length) {
         // with the created orderId, create all the fieldsOnOrder
         for (const fieldOnOrder of reqBody.fieldsOnOrder) {
            delete fieldOnOrder['id'];
            fieldOnOrder['orderId'] = createdOrder?.id;
            await upsert(fieldOnOrder, 'fieldsOnOrders', db);
         }
         // const fieldsOnOrderCopy = [...reqBody.fieldsOnOrder].map((fieldOnOrder: any) => {
         //    delete fieldOnOrder['id'];
         //    return { ...fieldOnOrder, orderId: createdOrder.id };
         // });
         // await db.fieldsOnOrders.bulkCreate(fieldsOnOrderCopy);
      }

      // THIS WAS REQUESTED BY TOMMY
      // // need to create tasksOnProducts rows for this order
      // // grab all the tasks for the product id && create new rows in the tasksOnOrders table
      // const tasksOnProduct = await db.tasksOnProducts
      //    .findAll({ where: { productId: reqBody.productId } })
      //    .then(deepCopy);

      // if (!!tasksOnProduct?.length) {
      //    const tasksOnOrder = [...tasksOnProduct].map((taskOnProd: any) => ({
      //       completed: false,
      //       taskOnProductId: taskOnProd?.id,
      //       productTaskId: taskOnProd?.productTaskId,
      //       orderId: createdOrder?.id,
      //    }));
      //    await db.tasksOnOrders.bulkCreate(tasksOnOrder);
      // }

      // only add the current stage to the stagesOnOrders table... so we can keep track of
      // - assignedToId, assignedAt, completedAt
      const beginningStageOnProd = await db.stagesOnProducts.findOne({ where: { productStageId: defaultStage?.id } });
      if (beginningStageOnProd?.id) {
         const stageOnOrder = { stageOnProductId: beginningStageOnProd?.id, orderId: createdOrder?.id };
         await db.stagesOnOrders.create(stageOnOrder);
      }

      // see if there is a webhook to fire
      if (defaultStage?.id && defaultStage?.webhookUrl && userAuth) {
         await fetchDbApi(`/api/v2/products/stages/${defaultStage?.id}/webhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: userAuth },
            body: JSON.stringify({ orderId: createdOrder?.id }),
         });
      }

      return NextResponse.json({ id: createdOrder?.id }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
