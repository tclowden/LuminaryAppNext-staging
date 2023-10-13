import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import * as Yup from 'yup';

export async function validateFieldsOnProductArr(reqBody: any, productId: string | null = null) {
   for (const obj of reqBody.fieldsOnProduct) {
      // check to see if proper keys exist in the array
      const schema = Yup.object({
         id: Yup.string().nullable(),
         productFieldId: Yup.string().required(),
         displayOrder: Yup.number().required(),
         required: Yup.boolean().required(),
         hidden: Yup.boolean().required(),
         hideOnCreate: Yup.boolean().required(),
         stageOnProductConstraintTempId: Yup.string().required().nullable(),
      });
      await schema.validate(obj);

      let fieldOnProductExists;
      if (obj?.id) {
         // check to see if there is a valid fieldOnProduct row by id
         fieldOnProductExists = await db.fieldsOnProducts.findByPk(obj.id);
         if (!fieldOnProductExists) throw new LumError(400, `fieldOnProduct: ${obj.id} doesn't exist`);
      } else if (!obj?.id && productId) {
         // see if there is a productFieldId & productId in the same row that exists... if so, just needs to set the archived column to false
         fieldOnProductExists = await db.fieldsOnProducts
            .unscoped()
            .findOne({ where: { productFieldId: obj.productFieldId, productId: productId } });
         // if found & there is no id on the obj, add to it
         if (fieldOnProductExists) obj['id'] = fieldOnProductExists.id;
      }

      // check to see if the productFieldId is a valid foreign key to the productFields table
      const productFieldIdExists = await db.productFields.findByPk(obj.productFieldId);
      if (!productFieldIdExists) throw new LumError(400, `Product field with id: ${obj.productFieldId} doesn't exist.`);

      // if there is a stageOnProductConstraintTempId
      // make sure the stageOnProductConstraintTempId exists in the stagesOnProducts array in each object... (tempId)
      if (obj.stageOnProductConstraintTempId && !!reqBody.stagesOnProduct.length) {
         const tempIdExists = reqBody.stagesOnProduct.some(
            (sOP: any) => sOP.tempId === obj.stageOnProductConstraintTempId
         );
         if (!tempIdExists)
            throw new LumError(
               400,
               `stageOnProductConstraintTempId: '${obj.stageOnProductConstraintTempId}' doesn't exist in stagesOnProduct array.`
            );
      }
   }
   // validate the displayOrder value isn't a duplicate of another one...
   const fieldsOnProductCopy = new Set(reqBody.fieldsOnProduct.map((fOP: any) => fOP.displayOrder));
   if (fieldsOnProductCopy.size < reqBody.fieldsOnProduct.length)
      throw new LumError(400, `There is a duplicate display order value.`);

   return true;
}

export async function validateStagesOnProductArr(reqBody: any, productId: string | null = null) {
   for (const obj of reqBody.stagesOnProduct) {
      // check to see if proper keys exist in the array
      const schema = Yup.object({
         id: Yup.string().nullable(),
         tempId: Yup.string().required(),
         productStageId: Yup.string().required(),
         createdById: Yup.string().required(),
         required: Yup.boolean().required(),
         scheduled: Yup.boolean().required(),
         displayOrder: Yup.number().required(),
         requiredFieldsOnProduct: Yup.array().required(),
         requiredTasksOnProduct: Yup.array().required(),
         excludedRoles: Yup.array().required(),
      });
      await schema.validate(obj);

      let stageOnProductExists;
      // check to see if there is a validate stageOnProduct row based on id, if passed in
      if (obj.id) {
         stageOnProductExists = await db.stagesOnProducts.findByPk(obj.id);
         if (!stageOnProductExists) throw new LumError(400, `stageOnProduct: ${obj.id} doesn't exist`);
      } else if (!obj.id && productId) {
         // see if there is a productFieldId & productId in the same row that exists... if so, just needs to set the archived column to false
         stageOnProductExists = await db.stagesOnProducts
            .unscoped()
            .findOne({ where: { productStageId: obj.productStageId, productId: productId } });
         // if found & there is no id on the obj, add to it
         if (stageOnProductExists) obj['id'] = stageOnProductExists.id;
      }

      // check to see if the productStageId is a valid foreign key to the productStages table
      const productStageIdExists = await db.productStages.findByPk(obj.productStageId);
      if (!productStageIdExists) throw new LumError(400, `Product stage with id: ${obj.productStageId} doesn't exist.`);

      // check to see if the createdById is a valid foreign key to the users table
      const createdByIdExists = await db.users.findByPk(obj.createdById);
      if (!createdByIdExists) throw new LumError(400, `createdById: ${obj.createdById} passed in doesn't exist.`);

      // validate requiredFieldsOnProduct if there are any
      // if (!!obj.requiredFieldsOnProduct.length) {}

      // validate requiredTasksOnProduct if there are any
      // if (!!obj.requiredTasksOnProduct.length) {}

      // validate excludedRoles if there are any
      if (!!obj.excludedRoles.length && obj?.id) {
         for (const excludedRole of obj.excludedRoles) {
            if (!excludedRole?.id) {
               console.log('excludedRole to find other than id:', excludedRole);
               const foundExcludedRole = await db.stageOnProductRoleConstraints.unscoped().findOne({
                  where: {
                     roleId: excludedRole.roleId,
                     stageOnProductConstraintId: obj?.id,
                  },
               });
               if (foundExcludedRole) excludedRole['id'] = foundExcludedRole.id;
            }
         }
      }
   }
   // validate the displayOrder value isn't a duplicate of another one...
   const stagesOnProductDisplayOrderCopy = new Set(reqBody.stagesOnProduct.map((sOP: any) => sOP.displayOrder));
   if (stagesOnProductDisplayOrderCopy.size < reqBody.stagesOnProduct.length)
      throw new LumError(400, `There is a duplicate display order value.`);

   // valiidate that each 'tempId' is unique
   const stagesOnProductTempIdCopy = new Set(reqBody.stagesOnProduct.map((sOP: any) => sOP.tempId));
   if (stagesOnProductTempIdCopy.size < reqBody.stagesOnProduct.length)
      throw new LumError(400, `There is a duplicate temp id.`);

   return true;
}

export async function validateTasksOnProductArr(reqBody: any, productId: string | null = null) {
   for (const obj of reqBody.tasksOnProduct) {
      // check to see if proper keys exist in the array
      // check to see if proper keys exist in the array
      const schema = Yup.object({
         id: Yup.string().nullable(),
         productTaskId: Yup.string().required(),
         displayOrder: Yup.number().required(),
         daysToComplete: Yup.number().required(),
         taskDueDateTypesLookupId: Yup.string().required(),
         stageOnProductConstraintTempId: Yup.string().required().nullable(),
      });
      await schema.validate(obj);

      let taskOnProductExists;
      // check to see if there is a validate stageOnProduct row based on id, if passed in
      if (obj.id) {
         taskOnProductExists = await db.tasksOnProducts.findByPk(obj.id);
         if (!taskOnProductExists) throw new LumError(400, `taskOnProduct: ${obj.id} doesn't exist`);
      } else if (!obj?.id && productId) {
         // see if there is a productFieldId & productId in the same row that exists... if so, just needs to set the archived column to false
         taskOnProductExists = await db.tasksOnProducts
            .unscoped()
            .findOne({ where: { productTaskId: obj.productTaskId, productId: productId } });
         // if found & there is no id on the obj, add to it
         if (taskOnProductExists) obj['id'] = taskOnProductExists.id;
      }

      // check to see if the productStageId is a valid foreign key to the productStages table
      const productTaskIdExists = await db.productTasks.findByPk(obj.productTaskId);
      if (!productTaskIdExists) throw new LumError(400, `Product task with id: ${obj.productTaskId} doesn't exist.`);

      // if there is a stageOnProductConstraintTempId
      // make sure the stageOnProductConstraintTempId exists in the stagesOnProducts array in each object... (tempId)
      if (obj.stageOnProductConstraintTempId && !!reqBody.stagesOnProduct?.length) {
         const tempIdExists = reqBody.stagesOnProduct.some(
            (stage: any) => stage.tempId === obj.stageOnProductConstraintTempId
         );
         if (!tempIdExists)
            throw new LumError(
               400,
               `stageOnProductConstraintTempId: '${obj.stageOnProductConstraintTempId}' doesn't exist in stagesOnProduct array.`
            );
      }

      // check to see if the taskDueDateType exists
      const taskDueDateTypeIdExists = await db.taskDueDateTypesLookup.findByPk(obj.taskDueDateTypesLookupId);
      if (!taskDueDateTypeIdExists)
         throw new LumError(400, `Task due date type with id: ${obj.taskDueDateTypesLookupId} doesn't exist.`);
   }
   // validate the displayOrder value isn't a duplicate of another one...
   const tasksOnProductCopy = new Set(reqBody.tasksOnProduct.map((tOP: any) => tOP.displayOrder));
   if (tasksOnProductCopy.size < reqBody.tasksOnProduct.length)
      throw new LumError(400, `There is a duplicate display order value.`);

   return true;
}

export async function validateCoordinatorsOnProductArr(reqBody: any, productId: string | null = null) {
   for (const obj of reqBody.coordinatorsOnProduct) {
      // check to see if proper keys exist in the array
      const schema = Yup.object({
         id: Yup.string().nullable(),
         productCoordinatorId: Yup.string().required(),
      });
      await schema.validate(obj);

      let coordinatorOnProductExists;
      // check to see if there is a validate stageOnProduct row based on id, if passed in
      if (obj?.id) {
         coordinatorOnProductExists = await db.coordinatorsOnProducts.findByPk(obj.id);
         if (!coordinatorOnProductExists) throw new LumError(400, `coordinatorOnProduct: ${obj.id} doesn't exist`);
      } else if (!obj?.id && productId) {
         // see if there is a productFieldId & productId in the same row that exists... if so, just needs to set the archived column to false
         coordinatorOnProductExists = await db.coordinatorsOnProducts
            .unscoped()
            .findOne({ where: { productCoordinatorId: obj.productCoordinatorId, productId: productId } });
         // if found & there is no id on the obj, add to it
         if (coordinatorOnProductExists) obj['id'] = coordinatorOnProductExists.id;
      }

      // check to see if the productStageId is a valid foreign key to the productStages table
      const productCoordinatorIdExists = await db.productCoordinators.findByPk(obj.productCoordinatorId);
      if (!productCoordinatorIdExists)
         throw new LumError(400, `Product coordinator with id: ${obj.productCoordinatorId} doesn't exist.`);
   }

   return true;
}
