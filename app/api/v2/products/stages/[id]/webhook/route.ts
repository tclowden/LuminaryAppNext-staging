import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';
import { fetchDbApi } from '@/serverActions';
import { deepCopy } from '@/utilities/helpers';
export const dynamic = 'force-dynamic';

/*
 * For stage "Trigger Webhook" send a post request to
 * the provided webhook in the productStages table, under column 'webhookUrl'. Prove the order data
 */
export async function POST(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         orderId: Yup.string().required(),
      });
      await schema.validate(reqBody);

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id: stageId } = options?.params;

      const stageData = await db.productStages.findByPk(stageId);
      if (!stageData) throw new LumError(400, `Stage with id: ${stageId}, doesn't exist.`);

      const orderData = await db.orders
         .findByPk(reqBody.orderId, {
            include: [
               { model: db.leads, required: false, as: 'lead' },
               { model: db.users, as: 'owner', required: false },
               { model: db.users, as: 'createdBy', required: false },
               { model: db.productsLookup, as: 'product', required: false },
               { model: db.productStages, as: 'productStage', required: false },
               { model: db.utilityCompaniesLookup, as: 'utilityCompany', required: false },
               { model: db.financiersLookup, as: 'financier', required: false },
            ],
         })
         .then(deepCopy);
      if (!orderData) throw new LumError(400, `Order with id: ${reqBody.orderId}, doesn't exist.`);

      const fieldsOnOrders = await db.fieldsOnOrders
         .findAll({
            where: { orderId: reqBody?.orderId },
            attributes: ['id', 'answer', 'updatedAt'],
            include: [
               {
                  model: db.fieldsOnProducts,
                  as: 'fieldOnProduct',
                  attributes: ['id'],
                  required: false,
                  include: [{ model: db.productFields, as: 'productField', attibutes: ['label'], require: false }],
               },
            ],
         })
         .then(deepCopy);

      if (!!fieldsOnOrders?.length) {
         orderData['fieldsOnOrders'] = fieldsOnOrders?.map((fieldOnOrder: any) => ({
            id: fieldOnOrder?.id,
            label: fieldOnOrder?.fieldOnProduct?.productField?.label,
            answer: fieldOnOrder?.answer,
            updatedAt: fieldOnOrder?.updatedAt,
         }));
      }

      // make request to the webhook
      await fetchDbApi(stageData?.webhookUrl, {
         method: 'POST',
         // headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${}`},
         body: JSON.stringify(orderData),
      });

      return NextResponse.json({ success: true, message: 'Successfully fired webhook!' }, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
