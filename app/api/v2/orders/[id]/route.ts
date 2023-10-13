import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import {
   foreignKeysExists,
   validateFieldsOnOrderArr,
   validateStagesOnOrderArr,
   validateTasksOnOrderArr,
} from '../validators';
import { upsert } from '@/utilities/api/helpers';
import { deepCopy } from '@/utilities/helpers';
import { headers } from 'next/headers';
import { fetchDbApi } from '@/serverActions';
import { Op } from 'sequelize';
export const dynamic = 'force-dynamic';

async function getOrderById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const order = await db.orders
         .findByPk(id, {
            include: [
               { model: db.users, as: 'owner', required: false },
               { model: db.users, as: 'createdBy', required: false },
               { model: db.productsLookup, as: 'product', required: false },
               { model: db.leads, as: 'lead', required: false },
               { model: db.financiersLookup, as: 'financier', required: false },
               { model: db.utilityCompaniesLookup, as: 'utilityCompany', required: false },
               // {
               //    model: db.productStages,
               //    as: 'productStage',
               //    required: false,
               //    include: [],
               // },
            ],
         })
         .then(deepCopy);

      let fieldsOnOrder: any = [];
      let stagesOnOrder: any = [];
      let tasksOnOrder: any = [];
      let notesOnOrder: any = [];
      let attachmentsOnOrder = [];

      let leadNotes: any = [];
      let leadAttachments: any = [];

      if (order) {
         fieldsOnOrder = db.fieldsOnOrders
            .findAll({
               where: { orderId: id },
               include: [
                  {
                     model: db.fieldsOnProducts,
                     as: 'fieldOnProduct',
                     required: false,
                     include: [
                        {
                           model: db.productFields,
                           include: [{ model: db.fieldTypesLookup, as: 'fieldType', required: false }],
                           as: 'productField',
                           required: false,
                        },
                     ],
                  },
               ],
            })
            .then(deepCopy)
            .catch((err: any) => {
               console.log('err here', err);
            });

         tasksOnOrder = db.tasksOnOrders
            .findAll({
               where: { orderId: id },
               include: [
                  {
                     model: db.tasksOnProducts,
                     as: 'taskOnProduct',
                     required: false,
                     include: [
                        {
                           model: db.productTasks,
                           as: 'productTask',
                           required: false,
                        },
                     ],
                  },
                  {
                     model: db.users,
                     as: 'assignedTo',
                     required: false,
                  },
               ],
            })
            .then(deepCopy);

         stagesOnOrder = db.stagesOnOrders.findAll({
            where: { orderId: id },
            order: [['createdAt', 'ASC']],
            include: [
               {
                  model: db.stagesOnProducts,
                  as: 'stageOnProduct',
                  required: false,
                  include: [{ model: db.productStages, required: false, as: 'productStage' }],
               },
               {
                  model: db.users,
                  as: 'assignedTo',
                  required: false,
               },
            ],
         });

         notesOnOrder = db.notes.findAll({
            where: { [Op.or]: [{ orderId: id }, { leadId: order?.leadId }] },
            order: [['createdAt', 'ASC']],
            include: [
               { model: db.users, as: 'createdBy', required: false },
               {
                  model: db.notifications,
                  as: 'notifications',
                  required: false,
                  include: [
                     { model: db.notificationTypesLookup, as: 'notificationType', required: false },
                     {
                        model: db.users,
                        as: 'taggedUser',
                        required: false,
                        // include: [{ model: db.teamsUsers, as: 'teamUsers', required: false }],
                     },
                  ],
               },
            ],
         });

         attachmentsOnOrder = db.attachments.findAll({
            where: { [Op.or]: [{ orderId: id }, { leadId: order?.leadId }] },
            order: [['createdAt', 'ASC']],
            include: [
               { model: db.users, as: 'createdBy', required: false },
               { model: db.attachmentTypesLookup, as: 'attachmentType', required: false },
            ],
         });

         [fieldsOnOrder, tasksOnOrder, stagesOnOrder, notesOnOrder, attachmentsOnOrder] = await Promise.allSettled([
            fieldsOnOrder,
            tasksOnOrder,
            stagesOnOrder,
            notesOnOrder,
            attachmentsOnOrder,
         ]).then(handleResults);

         order['fieldsOnOrder'] = fieldsOnOrder;
         order['tasksOnOrder'] = tasksOnOrder;
         order['stagesOnOrder'] = stagesOnOrder;
         order['notesOnOrder'] = notesOnOrder;
         order['attachmentsOnOrder'] = attachmentsOnOrder;
      } else {
         throw new LumError(404, `Order not found.`);
      }

      return NextResponse.json(order, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function deleteOrder(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const orderIdExists = await db.orders.findByPk(id);
      if (!orderIdExists) throw new LumError(400, `Order with id: ${id} doesn't exist...`);

      await db.orders.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json({ success: true, message: `Order successfully deleted.` }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateOrder(request: NextRequest, options: any) {
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
         tasksOnOrder: Yup.array().required(),
         stagesOnOrder: Yup.array().required(),
         total: Yup.number().nullable(),
         productStageId: Yup.string().required(),
         utilityCompanyId: Yup.string().nullable(),
         financierId: Yup.string().nullable(),
      });
      await schema.validate(reqBody);

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      // validate the product exists by the id
      const orderExists = await db.orders.findByPk(id);
      if (!orderExists) throw new LumError(400, `Order with id: ${id} doesn't exist.`);

      // MAKE SURE ALL FOREIGN KEYS CHECK OUT
      await foreignKeysExists(reqBody);

      // need to validate the fieldsOnOrder
      if (!!reqBody?.fieldsOnOrder?.length) await validateFieldsOnOrderArr(reqBody, id);
      if (!!reqBody?.tasksOnOrder?.length) await validateTasksOnOrderArr(reqBody, id);
      if (!!reqBody?.stagesOnOrder?.length) await validateStagesOnOrderArr(reqBody, id);

      // delete the id out of the obj, don't want to rewrite the id...
      if (reqBody?.id) delete reqBody['id'];

      const updatedOrder = await db.orders.update(reqBody, { where: { id: id } });

      // update or create - fieldsOnOrder
      if (!!reqBody?.fieldsOnOrder?.length) {
         const fieldsOnOrderCopy = [...reqBody.fieldsOnOrder].map((fieldOnOrder: any) => ({
            ...fieldOnOrder,
            orderId: id,
         }));

         for (let fieldOnOrder of fieldsOnOrderCopy) {
            await upsert(fieldOnOrder, 'fieldsOnOrders', db);
         }
      }

      // update or create - tasksOnOrder
      if (!!reqBody?.tasksOnOrder?.length) {
         const tasksOnOrderCopy = [...reqBody.tasksOnOrder].map((taskOnOrder: any) => ({
            ...taskOnOrder,
            orderId: id,
         }));

         for (let taskOnOrder of tasksOnOrderCopy) {
            await upsert(taskOnOrder, 'tasksOnOrders', db);
         }
      }

      // update or create - stagesOnOrder
      // this will have the previous stages, and current stage...
      // someone updates a stage [{ ...stage1, }, { ...currentStage, completedAt: new Date() }, { ...newStage, id: undefined }]
      // the new stage will be the same stage as productStageId on the orders table... (maybe drop that column???)
      if (!!reqBody?.stagesOnOrder?.length) {
         const stagesOnOrderCopy = [...reqBody.stagesOnOrder].map((stageOnOrder: any) => ({
            ...stageOnOrder,
            orderId: id,
         }));

         for (let stageOnOrder of stagesOnOrderCopy) {
            await upsert(stageOnOrder, 'stagesOnOrders', db);
         }
      }

      // see if we need to trigger webhook...
      // if the productStageId coming in the request is different that what's currently in the db... fire webhook
      if (reqBody.productStageId !== orderExists?.productStageId) {
         const productStage = await db.productStages.findByPk(reqBody.productStageId);
         // get the productStage data by id
         if (productStage?.webhookUrl && userAuth) {
            await fetchDbApi(`/api/v2/products/stages/${productStage?.id}/webhook`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json', Authorization: userAuth },
               body: JSON.stringify({ orderId: id }),
            });
         }
      }

      return NextResponse.json(updatedOrder, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { updateOrder as PUT };
export { deleteOrder as DELETE };
export { getOrderById as GET };

const handleResults = (results: any) => results.map((result: any) => result.status === 'fulfilled' && result.value);
