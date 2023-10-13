import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import {
   validateCoordinatorsOnProductArr,
   validateFieldsOnProductArr,
   validateStagesOnProductArr,
   validateTasksOnProductArr,
} from '../validators';
import { upsert } from '@/utilities/api/helpers';
import { deepCopy } from '@/utilities/helpers';
import { Op } from 'sequelize';
export const dynamic = 'force-dynamic';

async function getProductById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      let product = await db.productsLookup.findByPk(id, {}).then(deepCopy);

      let fieldsOnProductCount = 0,
         tasksOnProductCount = 0,
         stagesOnProductCount = 0,
         coordinatorsOnProductCount = 0,
         stagesOnProductRequiredCount = 0,
         stagesOnProductOtherCount = 0;

      fieldsOnProductCount = db.fieldsOnProducts.count({ where: { productId: product?.id } });
      tasksOnProductCount = db.tasksOnProducts.count({ where: { productId: product?.id } });

      stagesOnProductCount = db.stagesOnProducts.count({
         where: { productId: product?.id },
         include: [
            { model: db.productStages, required: false },
            {
               model: db.productStages,
               required: true,
               as: 'productStage',
               where: { name: { [Op.ne]: 'Beginning Stage' } },
            },
         ],
      });
      stagesOnProductRequiredCount = db.stagesOnProducts.count({
         where: { productId: product?.id, required: true },
         include: [
            {
               model: db.productStages,
               required: true,
               as: 'productStage',
               where: { name: { [Op.ne]: 'Beginning Stage' } },
            },
         ],
      });
      stagesOnProductOtherCount = db.stagesOnProducts.count({
         where: {
            productId: product?.id,
            required: false,
         },
         include: [
            {
               model: db.productStages,
               required: true,
               as: 'productStage',
               where: { name: { [Op.ne]: 'Beginning Stage' } },
            },
         ],
      });
      coordinatorsOnProductCount = db.coordinatorsOnProducts.count({ where: { productId: product?.id } });

      [
         fieldsOnProductCount,
         tasksOnProductCount,
         stagesOnProductCount,
         stagesOnProductRequiredCount,
         stagesOnProductOtherCount,
         coordinatorsOnProductCount,
      ] = await Promise.allSettled([
         fieldsOnProductCount,
         tasksOnProductCount,
         stagesOnProductCount,
         stagesOnProductRequiredCount,
         stagesOnProductOtherCount,
         coordinatorsOnProductCount,
      ])
         .then(handleResults)
         .catch((err) => {
            console.log('err', err);
         });

      product['fieldsOnProductCount'] = fieldsOnProductCount;
      product['tasksOnProductCount'] = tasksOnProductCount;
      product['stagesOnProductCount'] = stagesOnProductCount;
      product['stagesOnProductRequiredCount'] = stagesOnProductRequiredCount;
      product['stagesOnProductOtherCount'] = stagesOnProductOtherCount;
      product['coordinatorsOnProductCount'] = coordinatorsOnProductCount;

      // // let stagesOnProduct = db.stagesOnProducts.findAll({
      // //    where: { productId: product?.id },
      // //    include: [
      // //       { model: db.productStages, required: false, as: 'productStage' },
      // //       {
      // //          model: db.stageOnProductRoleConstraints,
      // //          as: 'excludedRoles',
      // //          required: false,
      // //          include: [{ model: db.roles, required: false }],
      // //       },
      // //    ],
      // // });
      // // let fieldsOnProduct = db.fieldsOnProducts.findAll({
      // //    where: { productId: product?.id },
      // //    include: [
      // //       {
      // //          model: db.productFields,
      // //          required: false,
      // //          include: [{ model: db.fieldTypesLookup, as: 'fieldType', required: false }],
      // //          as: 'productField',
      // //       },
      // //    ],
      // // });
      // // let tasksOnProduct = db.tasksOnProducts.findAll({
      // //    where: { productId: product?.id },
      // //    include: [
      // //       { model: db.productTasks, required: false, as: 'productTask' },
      // //       { model: db.taskDueDateTypesLookup, as: 'taskDueDateType', required: false },
      // //    ],
      // // });
      // // let coordinatorsOnProduct = db.coordinatorsOnProducts.findAll({
      // //    where: { productId: product?.id },
      // //    include: [
      // //       {
      // //          model: db.productCoordinators,
      // //          as: 'productCoordinator',
      // //          required: false,
      // //          include: [{ model: db.roles, required: false, as: 'roles' }],
      // //       },
      // //    ],
      // // });

      // // // fetch in parallel
      // // [stagesOnProduct, fieldsOnProduct, tasksOnProduct, coordinatorsOnProduct] = await Promise.allSettled([
      // //    stagesOnProduct,
      // //    fieldsOnProduct,
      // //    tasksOnProduct,
      // //    coordinatorsOnProduct,
      // // ]).then(handleResults);

      // // add to the stagesOnProduct
      // stagesOnProduct = stagesOnProduct?.map((stageOnProduct: any) => {
      //    const requiredFieldsOnProduct = fieldsOnProduct.filter(
      //       (fieldOnProduct: any) => fieldOnProduct?.stageOnProductConstraintId === stageOnProduct?.id
      //    );
      //    const requiredTasksOnProduct = tasksOnProduct.filter(
      //       (taskOnProduct: any) => taskOnProduct?.stageOnProductConstraintId === taskOnProduct?.id
      //    );
      //    return {
      //       ...stageOnProduct,
      //       requiredFieldsOnProduct,
      //       requiredTasksOnProduct,
      //    };
      // });

      // product = {
      //    ...product,
      //    stagesOnProduct,
      //    fieldsOnProduct,
      //    tasksOnProduct,
      //    coordinatorsOnProduct,
      // };

      return NextResponse.json(product, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function deleteProduct(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const productIdExists = await db.productsLookup.findByPk(id);
      if (!productIdExists) throw new LumError(400, `Product with id: ${id} doesn't exist...`);

      await db.productsLookup.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json({ success: true, message: `Product successfully deleted.` }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateProduct(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
         description: Yup.string().required(),
         iconName: Yup.string().required(),
         iconColor: Yup.string().required(),
         primary: Yup.boolean().nullable(),
         fieldsOnProduct: Yup.array().required(),
         stagesOnProduct: Yup.array().required(),
         tasksOnProduct: Yup.array().required(),
         coordinatorsOnProduct: Yup.array().required(),
      });
      await schema.validate(reqBody);

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const productIdExists = await db.productsLookup.findByPk(id);
      if (!productIdExists) throw new LumError(400, `Product with id: ${id} doesn't exist...`);

      // if there are fields to create for the product. will throw error if an error, else will continue
      if (reqBody.fieldsOnProduct?.length) await validateFieldsOnProductArr(reqBody, id);
      // if there are stages to create for the product. will throw error if an error, else will continue
      if (reqBody.stagesOnProduct?.length) await validateStagesOnProductArr(reqBody, id);
      // if there are tasks to create for the product. will throw error if an error, else will continue
      if (reqBody.tasksOnProduct?.length) await validateTasksOnProductArr(reqBody, id);
      // if there are coordinators to create for the product. will throw error if an error, else will continue
      if (reqBody.coordinatorsOnProduct?.length) await validateCoordinatorsOnProductArr(reqBody, id);

      // NEED TO CHECK: if there is an id, gotta be an update... if there is no id, gotta be a new row.
      // when creating a task, we might have a task assigned to a product on stage as a constrint.. so we need the product stage id
      // well the client is sending the whole object to save at once, so we won't know what product on stage constraint id to add to the task row
      // make the client group them with tempororary ids... each stage will have a tempid, & use that tempid with the task to group them together
      // appending the productId from the params into each update/write to make sure it's the same

      // must delete the id if there so it will update the row & not the id
      if (reqBody?.id) delete reqBody['id'];

      // make array copies scoped ere
      let stagesOnProductCopy: Array<any> = [];
      let fieldsOnProductCopy: Array<any> = [];

      let requiredTasksOnProduct: Array<any> = [];
      let requiredFieldsOnProduct: Array<any> = [];

      // update the product
      await db.productsLookup.update(reqBody, { where: { id: id }, individualHooks: true });

      if (!!reqBody.stagesOnProduct?.length) {
         // update or create - stagesOnProducts
         stagesOnProductCopy = [...reqBody.stagesOnProduct].map((sOP: any) => ({
            ...sOP,
            productId: id,
         }));
         // extract the excludedRoles, requiredTasksOnProduct, requiredFieldsOnProduct arrays out of each stage
         // & make one array of arrays to update
         let excludedRolesOnStages = [];

         for (const stageOnProd of stagesOnProductCopy) {
            const { id: stageOnProdId } = await upsert(stageOnProd, 'stagesOnProducts', db);

            // create a new array for excluded roles to save to the database after this loop
            // if there is no length, that means there are no configured excluded roles for the stage... so skip it
            if (!stageOnProd?.archived && !!stageOnProd.excludedRoles.length) {
               const excludedRolesCopy = stageOnProd.excludedRoles.map((prodRoleConstraint: any) => {
                  return {
                     ...prodRoleConstraint,
                     // roleId: prodRoleConstraint.roleId,
                     ...(!prodRoleConstraint.stageOnProductConstraintId && {
                        stageOnProductConstraintId: stageOnProdId,
                     }),
                  };
               });
               excludedRolesOnStages.push(excludedRolesCopy);
            }

            // extract out of the stage
            requiredTasksOnProduct = stageOnProd.requiredTasksOnProduct;
            requiredFieldsOnProduct = stageOnProd.requiredFieldsOnProduct;
         }

         // flatten the excludedRolesOnStages array of arrays to one array & save/update the data
         excludedRolesOnStages = excludedRolesOnStages.flat();
         if (!!excludedRolesOnStages.length) {
            for (let excludedRole of excludedRolesOnStages) {
               await upsert(excludedRole, 'stageOnProductRoleConstraints', db);
            }
         }
      }

      if (!!reqBody?.fieldsOnProduct?.length) {
         // update or create - fieldsOnProducts
         fieldsOnProductCopy = [...reqBody.fieldsOnProduct].map((fOP: any) => {
            // see if stage on product constraint needs to be removed from the field on product
            const removeStageConstraintOffField = requiredFieldsOnProduct.some(
               (reqFOP: any) => reqFOP.id === fOP.id && reqFOP.archived
            );
            const stageFound = stagesOnProductCopy.find(
               (sOP: any) => sOP.tempId === fOP.stageOnProductConstraintTempId
            );
            return {
               ...fOP,
               productId: id,
               // if stage constraint needs to be removed, set stageOnProductConstraintId to null
               // else if the stage is found, set stageOnProductConstraintId to the stage id
               // else just set it to null
               stageOnProductConstraintId: removeStageConstraintOffField ? null : stageFound?.id ?? null,
            };
         });

         for (let fieldOnProd of fieldsOnProductCopy) {
            await upsert(fieldOnProd, 'fieldsOnProducts', db);
         }
      }

      if (!!reqBody?.tasksOnProduct?.length) {
         // update or create - tasksOnProducts
         // with the updated array, map the tasksOnProduct array with new objects adding in
         // stageOnProductConstraintId matching the tempId with the stageOnProductConstraintTempId in the tasks obj
         const tasksOnProductCopy = [...reqBody.tasksOnProduct].map((tOP: any) => {
            // see if stage on product constraint needs to be removed from the task on product
            const removeStageConstraintOffTask = requiredTasksOnProduct.some(
               (reqTOP: any) => reqTOP.id === tOP.id && reqTOP.archived
            );
            const stageFound = stagesOnProductCopy.find(
               (sOP: any) => sOP.tempId === tOP.stageOnProductConstraintTempId
            );
            return {
               ...tOP,
               productId: id,
               // if stage constraint needs to be removed, set stageOnProductConstraintId to null
               // else if the stage is found, set stageOnProductConstraintId to the stage id
               // else just set it to null
               stageOnProductConstraintId: removeStageConstraintOffTask ? null : stageFound?.id ?? null,
            };
         });
         for (const taskOnProd of tasksOnProductCopy) {
            await upsert(taskOnProd, 'tasksOnProducts', db);
         }
      }

      if (!!reqBody.coordinatorsOnProduct?.length) {
         // update or create - coordinatorsOnProducts
         const coordinatorsOnProductCopy = [...reqBody.coordinatorsOnProduct].map((cOP: any) => ({
            ...cOP,
            productId: id,
         }));
         for (const coordOnProd of coordinatorsOnProductCopy) {
            await upsert(coordOnProd, 'coordinatorsOnProducts', db);
         }
      }

      const productResults = await db.productsLookup.findByPk(id, {
         // include: [db.productFields, db.productTasks, db.productStages, db.productCoordinators],
      });

      return NextResponse.json(productResults, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { updateProduct as PUT };
export { deleteProduct as DELETE };
export { getProductById as GET };

const handleResults = (results: any) =>
   results.map((result: any) => result.status === 'fulfilled' && deepCopy(result.value));

// const product = await db.productsLookup.findByPk(id, {
//    include: [
//       {
//          model: db.coordinatorsOnProducts,
//          as: 'coordinatorsOnProduct',
//          required: false,
//          include: [
//             {
//                model: db.productCoordinators,
//                required: false,
//                include: [{ model: db.roles, required: false }],
//             },
//          ],
//       },
//       {
//          model: db.fieldsOnProducts,
//          as: 'fieldsOnProduct',
//          required: false,
//          include: [
//             {
//                model: db.productFields,
//                required: false,
//                include: [{ model: db.fieldTypesLookup, as: 'fieldType', required: false }],
//             },
//          ],
//       },
//       {
//          model: db.tasksOnProducts,
//          as: 'tasksOnProduct',
//          required: false,
//          include: [
//             { model: db.productTasks, required: false },
//             { model: db.taskDueDateTypesLookup, as: 'taskDueDateType', required: false },
//          ],
//       },
//       {
//          model: db.stagesOnProducts,
//          as: 'stagesOnProduct',
//          required: false,
//          include: [
//             { model: db.productStages, required: false },
//             {
//                model: db.fieldsOnProducts,
//                as: 'requiredFieldsOnProduct',
//                separate: true,
//                required: false,
//                include: [{ model: db.productFields, required: false }],
//             },
//             {
//                model: db.tasksOnProducts,
//                as: 'requiredTasksOnProduct',
//                // adding separate: true made the column names not cut off
//                separate: true,
//                required: false,
//                include: [{ model: db.productTasks, required: false }],
//             },
//             {
//                model: db.stageOnProductRoleConstraints,
//                as: 'excludedRoles',
//                required: false,
//                include: [
//                   {
//                      model: db.roles,
//                      required: false,
//                      // where: {
//                      //    name: {
//                      //       [Op.notIn]: ['Super Secret Dev', 'Default Role'],
//                      //    },
//                      // },
//                   },
//                ],
//             },
//          ],
//       },
//    ],
// });
