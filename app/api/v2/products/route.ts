import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import {
   validateCoordinatorsOnProductArr,
   validateFieldsOnProductArr,
   validateStagesOnProductArr,
   validateTasksOnProductArr,
} from './validators';
import { LumError } from '@/utilities/models/LumError';
import { deepCopy } from '@/utilities/helpers';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, options: any) {
   try {
      const products = await db.productsLookup
         .findAll({
            // COMMENTED THIS ALL OUT TO CLEAN UP QUERY
            // IF NEEDING ALL THE INCLUDES, USE THE `/api/v2/products/query` ENDPOINT
            // include: [
            //    {
            //       model: db.fieldsOnProducts,
            //       required: false,
            //       as: 'fieldsOnProduct',
            //       include: [
            //          {
            //             model: db.productFields,
            //             required: false,
            //             include: [
            //                {
            //                   model: db.fieldTypesLookup,
            //                   as: 'fieldType',
            //                   required: false,
            //                },
            //                { model: db.productFieldOptions, required: false },
            //                { model: db.configuredListsLookup, required: false, as: 'configuredList' },
            //             ],
            //          },
            //       ],
            //    },
            //    // { model: db.tasksOnProducts, required: false, as: 'tasksOnProduct' },
            //    // { model: db.stagesOnProducts, required: false, as: 'stagesOnProduct' },
            //    // { model: db.coordinatorsOnProducts, required: false, as: 'coordinatorsOnProduct' },
            // ],
            order: [['createdAt', 'ASC']],
         })
         .then(deepCopy);

      // get the count for all the related fields,tasks,stages, and coordinators for each product
      // this is way faster than an include
      for (const product of products) {
         // get fieldsOnProductCount
         let fieldsOnProductCount = db.fieldsOnProducts.count({ where: { productId: product?.id } });
         // get fieldsOnProductCount
         let tasksOnProductCount = db.tasksOnProducts.count({ where: { productId: product?.id } });
         // get fieldsOnProductCount
         let stagesOnProductCount = db.stagesOnProducts.count({ where: { productId: product?.id } });
         // get fieldsOnProductCount
         let coordinatorsOnProductCount = db.coordinatorsOnProducts.count({ where: { productId: product?.id } });

         // fetch in parallel
         [fieldsOnProductCount, tasksOnProductCount, stagesOnProductCount, coordinatorsOnProductCount] =
            await Promise.allSettled([
               fieldsOnProductCount,
               tasksOnProductCount,
               stagesOnProductCount,
               coordinatorsOnProductCount,
            ]).then(handleResults);

         product['fieldsOnProductCount'] = fieldsOnProductCount.toString();
         product['tasksOnProductCount'] = tasksOnProductCount.toString();
         product['stagesOnProductCount'] = stagesOnProductCount.toString();
         product['coordinatorsOnProductCount'] = coordinatorsOnProductCount.toString();
      }

      // restructure the obj a tad
      // let tempProdDataArr = await reformatProductData(products);

      return NextResponse.json(products, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function POST(request: NextRequest, options: any) {
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

      // if there are fields to create for the product. will throw error if an error, else will continue
      if (reqBody.fieldsOnProduct?.length) await validateFieldsOnProductArr(reqBody);
      // if there are stages to create for the product. will throw error if an error, else will continue
      if (reqBody.stagesOnProduct?.length) await validateStagesOnProductArr(reqBody);
      // if there are tasks to create for the product. will throw error if an error, else will continue
      if (reqBody.tasksOnProduct?.length) await validateTasksOnProductArr(reqBody);
      // if there are coordinators to create for the product. will throw error if an error, else will continue
      if (reqBody.coordinatorsOnProduct?.length) await validateCoordinatorsOnProductArr(reqBody);

      // right now, when creating a product... if the user selects a field, coord, task, or stage then deletes it, it's archiving in the database still
      // that's perfectly fine because when updating, the code is seeing if that row already exists by the productId & the product[Field,Coodinator,Task,Stage]Id...
      // if so, will just set achived to false

      // when creating a task, we might have a task assigned to a product on stage as a constrint.. so we need the product stage id
      // well the client is sending the whole object to save at once, so we won't know what product on stage constraint id to add to the task row
      // make the client group them with tempororary ids... each stage will have a tempid, & use that tempid with the task to group them together

      // see if the product already exists by searching for same name & archived is false
      // IF found but archive... should i just change the current row to archived false?
      const productAlreadyExists = await db.productsLookup.findOne({ where: { name: reqBody.name } });
      if (productAlreadyExists) throw new LumError(400, `Product with name: '${reqBody.name}' already exists.`);

      // create array copy instances to use within each other while looping
      let stagesOnProductCopy: Array<any> = [];
      let fieldsOnProductCopy: Array<any> = [];
      let tasksOnProductCopy: Array<any> = [];
      let coordinatorsOnProductCopy: Array<any> = [];

      let requiredTasksOnProduct: Array<any> = [];
      let requiredFieldsOnProduct: Array<any> = [];

      // create the product
      const createdProduct = await db.productsLookup.create(reqBody);

      // add the default stage (beginning stage) to the stageOnProduct array
      const beginningStage = await db.productStages.findOne({ where: { name: 'Beginning Stage' } }).then(deepCopy);
      reqBody['stagesOnProduct'] = [
         ...reqBody?.stagesOnProduct,
         {
            displayOrder: 1,
            productStageId: beginningStage?.id,
            productStage: null,
            tempId: null,
            timeline: 0,
            scheduled: false,
            required: false,
            daysToComplete: 0,
            requiredTasksOnProduct: [],
            requiredFieldsOnProduct: [],
            excludedRoles: [],
         },
      ];

      if (!!reqBody.stagesOnProduct?.length) {
         // create rows in the stagesOnProducts table
         // return back the id of each row to add to the array
         stagesOnProductCopy = [...reqBody.stagesOnProduct].map((v: any) => ({
            ...v,
            productId: createdProduct.id,
         }));
         // extract the excludedRoles arrays out of each stage & make one array of arrays of excludedRoles
         let excludedRolesOnStages: Array<Array<any>> = [];
         for (const stageOnProd of stagesOnProductCopy) {
            const createdStageOnProd = await db.stagesOnProducts.create(stageOnProd);
            // add the id returned from the payload to the stage obj
            // will need it when creating tasks and fields
            stageOnProd['id'] = createdStageOnProd?.id;

            // create a new array for excluded roles to save to the database after this loop
            // if there is no length, that means there are no configured excluded roles for the stage... so skip it
            if (!!stageOnProd.excludedRoles.length) {
               const excludedRolesCopy = stageOnProd.excludedRoles.map((prodRoleConstraint: any) => ({
                  ...prodRoleConstraint,
                  stageOnProductConstraintId: createdStageOnProd.id,
               }));
               excludedRolesOnStages.push(excludedRolesCopy);
            }

            requiredFieldsOnProduct = stageOnProd?.requiredFieldsOnProduct;
            requiredTasksOnProduct = stageOnProd?.requiredTasksOnProduct;
         }

         // flatten the excludedRolesOnStages array of arrays to one array & save the data
         excludedRolesOnStages = excludedRolesOnStages
            .flat()
            .filter((excludedRole: any) => !excludedRole?.archived)
            .map((excludedRole) => ({ ...excludedRole }));
         if (!!excludedRolesOnStages.length) {
            await db.stageOnProductRoleConstraints.bulkCreate(excludedRolesOnStages);
         }
      }

      if (!!reqBody.fieldsOnProduct?.length) {
         // with the updated array, map the fieldsOnProduct array with new objects adding in stageOnProductConstraintId matching the tempId with the stageOnProductConstraintTempId in the field obj
         // create rows on the fieldsOnProducts table
         fieldsOnProductCopy = [...reqBody.fieldsOnProduct].map((fOP: any) => {
            // see if stage on product constraint needs to be removed from the field on product
            const removeStageConstraintOffField = requiredFieldsOnProduct.some(
               (reqFOP: any) => reqFOP.productFieldId === fOP.productFieldId && reqFOP.archived
            );

            const stageFound = stagesOnProductCopy?.find(
               (sOP: any) => sOP.tempId === fOP.stageOnProductConstraintTempId
            );
            return {
               ...fOP,
               productId: createdProduct.id,
               stageOnProductConstraintId: removeStageConstraintOffField ? null : stageFound?.id ?? null,
            };
         });
         await db.fieldsOnProducts.bulkCreate(fieldsOnProductCopy);
      }

      if (!!reqBody.tasksOnProduct?.length) {
         // with the updated array, map the tasksOnProduct array with new objects adding in stageOnProductConstraintId matching the tempId with the stageOnProductConstraintTempId in the tasks obj
         // create rows on the tasksOnProduct table
         tasksOnProductCopy = [...reqBody.tasksOnProduct].map((tOP: any) => {
            // see if stage on product constraint needs to be removed from the field on product
            const removeStageConstraintOffField = requiredFieldsOnProduct.some(
               (reqFOP: any) => reqFOP.productTaskId === tOP.productTaskId && reqFOP.archived
            );

            const stageFound = stagesOnProductCopy.find(
               (sOP: any) => sOP.tempId === tOP.stageOnProductConstraintTempId
            );
            return {
               ...tOP,
               productId: createdProduct.id,
               stageOnProductConstraintId: removeStageConstraintOffField ? null : stageFound?.id ?? null,
            };
         });
         await db.tasksOnProducts.bulkCreate(tasksOnProductCopy);
      }

      if (!!reqBody.coordinatorsOnProduct?.length) {
         // craete rows in the coordinatorsOnProducts table
         coordinatorsOnProductCopy = [...reqBody.coordinatorsOnProduct].map((cOP: any) => {
            return { ...cOP, productId: createdProduct.id };
         });
         await db.coordinatorsOnProducts.bulkCreate(coordinatorsOnProductCopy);
      }

      const productResults = await db.productsLookup.findByPk(createdProduct.id, {
         // include: [db.productFields, db.productTasks, db.productStages, db.productCoordinators],
      });

      return NextResponse.json(productResults, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

// const reformatProductData = async (products: Array<any>) => {
//    let tempProdDataArr = [...products];

//    // see if there is a configuredList to populate
//    for (const product of tempProdDataArr) {
//       let newFieldsOnProd = [];
//       for (const fieldOnProd of product.fieldsOnProduct) {
//          let tempFieldOnProd = { ...fieldOnProd };
//          if (tempFieldOnProd?.productField?.configuredList) {
//             const modelName = tempFieldOnProd.productField.configuredList?.tableName;
//             if (!modelName) return tempFieldOnProd;
//             // if we have a configured listId, then grab the rows from the configure list 'tableName;
//             // for proposals... we will need the options for the leadId, not all the options
//             // create another controller to get all the products while also accepting a leadId in the request to query the proposals from
//             // or could just filter them out on the client side... (LET'S DO THIS FOR NOW)
//             tempFieldOnProd['productField']['productFieldConfigurableListOptions'] = await db[modelName].findAll({});
//          }
//          newFieldsOnProd.push(tempFieldOnProd);
//       }
//       product['fieldsOnProduct'] = newFieldsOnProd;
//    }

//    return tempProdDataArr;
// };

const handleResults = (results: any) =>
   results.map((result: any) => result.status === 'fulfilled' && deepCopy(result.value));
