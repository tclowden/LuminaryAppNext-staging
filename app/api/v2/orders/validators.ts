import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import * as Yup from 'yup';

// will throw an error if doesn't exist... else just return true;
export const foreignKeysExists = async (reqBody: any) => {
   // check to see if owner exists by searching the users table... will return null if not there
   const ownerIdExists = await db.users.findByPk(reqBody.ownerId);
   if (!ownerIdExists) throw new LumError(400, `User with id: ${reqBody.ownerId} doesn't exist.`);

   // check to see if created by exists by searching the users table... will return null if not there
   const createdByIdExists = await db.users.findByPk(reqBody.createdById);
   if (!createdByIdExists) throw new LumError(400, `User with id: ${reqBody.createdById} doesn't exist.`);

   // check to see if product exists by searching the products table... will return null if not there
   const productIdExists = await db.productsLookup.findByPk(reqBody.productId);
   if (!productIdExists) throw new LumError(400, `Product with id: ${reqBody.productId} doesn't exist.`);

   // check to see if lead exists by searching the leads table... will return null if not there
   const leadIdExists = await db.leads.findByPk(reqBody.leadId);
   if (!leadIdExists) throw new LumError(400, `Lead with id: ${reqBody.leadId} doesn't exist.`);

   if (reqBody?.utilityCompanyId) {
      const utilityCompanyIdExists = await db.utilityCompaniesLookup.findByPk(reqBody.utilityCompanyId);
      if (!utilityCompanyIdExists)
         throw new LumError(400, `Utility Company with id: ${reqBody.utilityCompanyId} doesn't exist.`);
   }

   if (reqBody?.financierId) {
      const financierIdExists = await db.financiersLookup.findByPk(reqBody.financierId);
      if (!financierIdExists) throw new LumError(400, `Financier with id: ${reqBody.financierId} doesn't exist.`);
   }

   if (reqBody?.productStageId) {
      const productStageIdExists = await db.productStages.findByPk(reqBody.productStageId);
      if (!productStageIdExists)
         throw new LumError(400, `Product stage with id: ${reqBody.productStageId} doesn't exist.`);
   }

   return true;
};

export const validateFieldsOnOrderArr = async (reqBody: any, orderId: string | null = null) => {
   for (const fieldOnOrder of reqBody.fieldsOnOrder) {
      const schema = Yup.object({
         id: Yup.string().required().nullable(),
         // productFieldId: Yup.string().required(),
         // can be null... if the user deletes an answer on the order form
         answer: Yup.string().required().nullable(),
         fieldOnProductId: Yup.string().required(),
      });
      await schema.validate(fieldOnOrder);

      if (fieldOnOrder?.id) {
         const fieldOnOrderIdExists = await db.fieldsOnOrders.findByPk(fieldOnOrder.id);
         if (!fieldOnOrderIdExists) throw new LumError(400, `fieldOnOrder: '${fieldOnOrder.id}' doesn't exist.`);
      } else if (!fieldOnOrder?.id && orderId) {
         // see if fieldOnOrder exists by orderId & productFieldId, if so... append the id to the object
         const fieldOnOrderExistsAlready = await db.fieldsOnOrders
            .unscoped()
            .findOne({ where: { orderId: orderId, fieldOnProductId: fieldOnOrder.fieldOnProductId } });
         // .findOne({ where: { orderId: orderId, productFieldId: fieldOnOrder.productFieldId } });
         if (fieldOnOrderExistsAlready) fieldOnOrder['id'] = fieldOnOrderExistsAlready.id;
      }

      // validate the productFieldId exists
      // const fieldOnProductIdExists = await db.productFields.findByPk(fieldOnOrder.productFieldId);
      const fieldOnProductIdExists = await db.fieldsOnProducts.findByPk(fieldOnOrder.fieldOnProductId);
      if (!fieldOnProductIdExists)
         throw new LumError(400, `fieldOnProductId: '${fieldOnOrder.fieldOnProductId} doesn't exist.`);
      // throw new LumError(400, `productFieldId: '${fieldOnOrder.productFieldId} doesn't exist.`);
   }

   return true;
};

export const validateTasksOnOrderArr = async (reqBody: any, orderId: string | null = null) => {
   for (const taskOnOrder of reqBody.tasksOnOrder) {
      const schema = Yup.object({
         id: Yup.string().required().nullable(),
         completed: Yup.boolean().required(),
         name: Yup.string().nullable(),
         description: Yup.string().nullable(),
         dueAt: Yup.date().nullable(),
         // can be nullable now because of the one off tasks...
         taskOnProductId: Yup.string().nullable(),
         productTaskId: Yup.string().nullable(),
         assignedToId: Yup.string().nullable(),
         completedById: Yup.string().nullable(),
         createdById: Yup.string().nullable(),
         updatedById: Yup.string().nullable(),
      });
      await schema.validate(taskOnOrder);

      if (taskOnOrder?.id) {
         const taskOnOrderIdExists = await db.tasksOnOrders.findByPk(taskOnOrder.id);
         if (!taskOnOrderIdExists) throw new LumError(400, `taskOnOrder: '${taskOnOrder.id}' doesn't exist.`);
      } else if (!taskOnOrder?.id && orderId && taskOnOrder?.taskOnProductId) {
         // see if taskOnOrder exists by orderId & productFieldId, if so... append the id to the object
         const taskOnOrderExistsAlready = await db.tasksOnOrders
            .unscoped()
            .findOne({ where: { orderId: orderId, taskOnProductId: taskOnOrder.taskOnProductId } });
         if (taskOnOrderExistsAlready) taskOnOrder['id'] = taskOnOrderExistsAlready.id;
      }

      if (taskOnOrder?.taskOnProductId) {
         // validate the productTaskId exists
         const taskOnProductIdExists = await db.tasksOnProducts.findByPk(taskOnOrder.taskOnProductId);
         if (!taskOnProductIdExists)
            throw new LumError(400, `taskOnProductId: '${taskOnOrder.taskOnProductId} doesn't exist.`);
      }

      if (taskOnOrder?.assignedToId) {
         const userExists = await db.users.findByPk(taskOnOrder.assignedToId);
         if (!userExists) throw new LumError(400, `assignedToId: ${taskOnOrder.assignedToId} doesn't exist.`);
      }

      if (taskOnOrder?.completedById && taskOnOrder?.completedById !== taskOnOrder?.assignedToId) {
         const userExists = await db.users.findByPk(taskOnOrder.completedById);
         if (!userExists) throw new LumError(400, `completedById: ${taskOnOrder.completedById} doesn't exist.`);
      }

      if (
         taskOnOrder?.createdById &&
         taskOnOrder?.createdById !== taskOnOrder?.completedById &&
         taskOnOrder?.createdById !== taskOnOrder?.assignedToId
      ) {
         const userExists = await db.users.findByPk(taskOnOrder.createdById);
         if (!userExists) throw new LumError(400, `createdById: ${taskOnOrder.createdById} doesn't exist.`);
      }

      if (
         taskOnOrder?.updatedById &&
         taskOnOrder?.updatedById !== taskOnOrder?.createdById &&
         taskOnOrder?.updatedById !== taskOnOrder?.completedById &&
         taskOnOrder?.updatedById !== taskOnOrder?.assignedToId
      ) {
         const userExists = await db.users.findByPk(taskOnOrder.updatedById);
         if (!userExists) throw new LumError(400, `updatedById: ${taskOnOrder.updatedById} doesn't exist.`);
      }
   }

   return true;
};

export const validateStagesOnOrderArr = async (reqBody: any, orderId: string | null = null) => {
   for (const stageOnOrder of reqBody.stagesOnOrder) {
      const schema = Yup.object({
         id: Yup.string().required().nullable(),
         completedAt: Yup.date().nullable(),
         stageOnProductId: Yup.string().required(),
         // assignedToId: Yup.string().required(),
      });
      await schema.validate(stageOnOrder);

      if (stageOnOrder?.id) {
         const stageOnOrderIdExists = await db.stagesOnOrders.findByPk(stageOnOrder.id);
         if (!stageOnOrderIdExists) throw new LumError(400, `stageOnOrder: '${stageOnOrder.id}' doesn't exist.`);
      } else if (!stageOnOrder?.id && orderId) {
         // see if stageOnOrder exists by orderId & productFieldId, if so... append the id to the object
         const stageOnOrderExistsAlready = await db.stagesOnOrders
            .unscoped()
            .findOne({ where: { orderId: orderId, stageOnProductId: stageOnOrder.stageOnProductId } });
         if (stageOnOrderExistsAlready) stageOnOrder['id'] = stageOnOrderExistsAlready.id;
      }

      // validate the productTaskId exists
      const stageOnProductIdExists = await db.stagesOnProducts.findByPk(stageOnOrder.stageOnProductId);
      if (!stageOnProductIdExists)
         throw new LumError(400, `stageOnProductId: '${stageOnOrder.stageOnProductId} doesn't exist.`);
   }

   return true;
};
