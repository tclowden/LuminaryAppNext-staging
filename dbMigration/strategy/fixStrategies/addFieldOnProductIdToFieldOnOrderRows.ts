import { BaseMigration } from '../base';
import { MigrationStrategy } from '../contracts/migrationContract';
import Logger from '../../logger';
import db from '../../../sequelize/models';
import { LumError } from '../../../utilities/models/LumError';
import { camelCaseToTitleCase, deepCopy } from '../../../utilities/helpers';

export class AddFieldOnProductIdToFieldOnOrderRowsStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         const orders = await this.targetDb.orders.findAll({ where: { migratedColsToFields: false } }).then(deepCopy);
         const configuredLists = await this.targetDb.configuredListsLookup.findAll({}).then(deepCopy);

         const ordersLength = orders?.length;
         if (!!ordersLength) {
            let i = 1;
            let currRowsUpdated = 0;

            for (const order of orders) {
               const product = await this.targetDb.productsLookup.findByPk(order?.productId);
               if (!product) {
                  Logger.info(`Couldn't find product for id: ${order?.productId}`);
                  continue;
               }

               // need to create a field on product...
               // then create a field on order...

               if (order?.utilityCompanyId)
                  await this.handleConfiguredListColumn(
                     order,
                     product,
                     configuredLists,
                     'utilityCompanyId',
                     'utilityCompaniesLookup',
                     'Utility Companies'
                  );
               if (order?.financierId)
                  await this.handleConfiguredListColumn(
                     order,
                     product,
                     configuredLists,
                     'financierId',
                     'financiersLookup',
                     'Financiers'
                  );
               // if (order?.utilityCompanyId) await this.handleUtilityCompanyId(order, product, configuredLists);
               // if (order?.financierId) await this.handleFinancierId(order, product, configuredLists);

               if (order?.firstFundedAmount)
                  await this.handleFieldColumns(order, product, 'firstFundedAmount', 'Currency');
               if (order?.firstFundedAt) await this.handleFieldColumns(order, product, 'firstFundedAt', 'Date');
               if (order?.secondFundedAmount)
                  await this.handleFieldColumns(order, product, 'secondFundedAmount', 'Currency');
               if (order?.secondFundedAt) await this.handleFieldColumns(order, product, 'secondFundedAt', 'Date');
               if (order?.thirdFundedAmount)
                  await this.handleFieldColumns(order, product, 'thirdFundedAmount', 'Currency');
               if (order?.thirdFundedAt) await this.handleFieldColumns(order, product, 'thirdFundedAt', 'Date');

               if (order?.cityTax) await this.handleFieldColumns(order, product, 'cityTax', 'Number');
               if (order?.stateTax) await this.handleFieldColumns(order, product, 'stateTax', 'Number');
               if (order?.countyTax) await this.handleFieldColumns(order, product, 'countyTax', 'Number');
               if (order?.dealerFee) await this.handleFieldColumns(order, product, 'dealerFee', 'Number');

               if (order?.installAddress) await this.handleFieldColumns(order, product, 'installAddress', 'Text');
               if (order?.installSignedDate) await this.handleFieldColumns(order, product, 'installSignedDate', 'Date');

               // handle the displayOrder for all the fieldsOnProduct by the order?.productId
               const fieldsOnProduct = await this.targetDb.fieldsOnProducts
                  .findAll({ where: { productId: product?.id }, order: [['displayOrder', 'ASC']] })
                  .then((res: any) => JSON.parse(JSON.stringify(res)));

               // see if there are any duplicates... if not, don't reset the display order
               const fieldsOnProdHasDisplayOrderDuplicates = [...fieldsOnProduct]?.some(
                  (fieldOnProd: any, i: number, selfArr: Array<any>) =>
                     selfArr.filter((fOP: any) => fOP?.displayOrder === fieldOnProd?.displayOrder)?.length > 1
               );

               if (!!fieldsOnProduct?.length && fieldsOnProdHasDisplayOrderDuplicates) {
                  const result = fieldsOnProduct.reduce(
                     (acc: any, curr: any) => {
                        // If it's already in the accumulator's unique list, it's a duplicate
                        if (acc.unique.some((item: any) => item?.displayOrder === curr?.displayOrder)) {
                           acc.duplicates.push(curr);
                        } else {
                           acc.unique.push(curr);
                        }
                        return acc;
                     },
                     { unique: [], duplicates: [] }
                  );
                  const newFieldsOnProduct = [...result.unique, ...result.duplicates].map((item: any, i: number) => ({
                     ...item,
                     displayOrder: i + 1,
                  }));

                  for (const newFieldOnProd of newFieldsOnProduct) {
                     await this.targetDb.fieldsOnProducts.update(newFieldOnProd, { where: { id: newFieldOnProd?.id } });
                  }
               }

               // DO NOT SET install signed date null anymore... we want it in both places
               // orders table and field on orders
               await db.sequelize.query(
                  `UPDATE "public"."orders" 
                     SET 
                        "utilityCompanyId" = null, 
                        "financierId" = null, 
                        "firstFundedAmount" = null, 
                        "firstFundedAt" = null, 
                        "secondFundedAmount" = null, 
                        "secondFundedAt" = null, 
                        "thirdFundedAmount" = null, 
                        "thirdFundedAt" = null, 
                        "cityTax" = null, 
                        "stateTax" = null, 
                        "countyTax" = null, 
                        "dealerFee" = null, 
                        "installAddress" = null, 
                        "migratedColsToFields" = true
                        WHERE "id" = :orderId;`,
                  { replacements: { orderId: order?.id } }
               );
               // "installSignedDate" = null,

               currRowsUpdated += 1;
               if (i === 300) {
                  Logger.info(`Updated ${currRowsUpdated} rows out of ${ordersLength} rows in orders table!`);
                  i = 0;
               } else i++;

               // return
            }
         }

         //set all productFieldIds to null
         // await db.sequelize.query(`UPDATE "fieldsOnOrders" SET productFieldId = NULL`);
         await db.sequelize.query(`UPDATE "public"."fieldsOnOrders" SET "productFieldId" = null;`);

         Logger.info(`Successfully updated the fieldsOnOrders table with fieldOnProductId's.`);
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while migrating order columns to fields on orders...');
      }
   }

   private async handleConfiguredListColumn(
      order: any,
      product: any,
      configuredLists: Array<any>,
      columnName: string,
      tableName: string,
      label: string
   ) {
      const foundConfiguredList = configuredLists.find((cl: any) => cl.tableName === tableName);
      if (!foundConfiguredList) {
         Logger.info(`Couldn't find a configured list for utility companies...`);
         return;
      }

      let tempAnswer = await this.targetDb.utilityCompaniesLookup.findByPk(order[columnName]).then(deepCopy);
      if (!tempAnswer) {
         Logger.info(`Couldn't find a utility company with id: ${order[columnName]} for order: ${order?.id}`);
         return;
      }
      tempAnswer = tempAnswer?.name;

      let prodField = await this.targetDb.productFields
         .findOne({ where: { configuredListId: foundConfiguredList?.id } })
         .then(deepCopy);
      if (!prodField) {
         Logger.info(
            `There is no product field with configuredListId: ${foundConfiguredList?.id}... let's create one!`
         );
         prodField = await this.targetDb.productFields.create({
            label: label,
            configuredListId: foundConfiguredList?.id,
         });
      }

      let fieldOnProduct = await this.targetDb.fieldsOnProducts
         .findOne({ where: { productFieldId: prodField?.id, productId: product?.id } })
         .then(deepCopy);

      if (!fieldOnProduct) {
         Logger.info(
            `There was no field on product with productFieldId: ${prodField?.id} and productId: ${product?.id}... let's create one!`
         );
         const allFieldsOnProd = await this.targetDb.fieldsOnProducts
            .findAll({
               attributes: ['id', 'displayOrder'],
               where: { productId: product?.id },
               order: [['displayOrder', 'DESC']],
            })
            .then(deepCopy);

         let displayOrder = 1;
         if (!!allFieldsOnProd?.length) {
            displayOrder = allFieldsOnProd[allFieldsOnProd?.length - 1]?.displayOrder + 1;
         }

         fieldOnProduct = await this.targetDb.fieldsOnProducts.create({
            productFieldId: prodField?.id,
            productId: product?.id,
            required: false,
            hidden: false,
            hideOnCreate: false,
            displayOrder: displayOrder,
         });
      }

      // create the fieldOnOrder
      await this.targetDb.fieldsOnOrders.create({
         fieldOnProductId: fieldOnProduct?.id,
         orderId: order?.id,
         answer: tempAnswer,
      });
   }

   private async handleUtilityCompanyId(order: any, product: any, configuredLists: Array<any>) {
      const utilCompanyConfiguredList = configuredLists
         .find((cl: any) => cl.tableName === 'utilityCompaniesLookup')
         .then(deepCopy);
      if (!utilCompanyConfiguredList) {
         Logger.info(`Couldn't find a configured list for utility companies...`);
         return;
      }

      let tempAnswer = await this.targetDb.utilityCompaniesLookup.findByPk(order?.utilityCompanyId).then(deepCopy);
      if (!tempAnswer) {
         Logger.info(`Couldn't find a utility company with id: ${order?.utilityCompanyId} for order: ${order?.id}`);
         return;
      }
      tempAnswer = tempAnswer?.name;

      let prodField = await this.targetDb.productFields
         .findOne({ where: { configuredListId: utilCompanyConfiguredList?.id } })
         .then(deepCopy);
      if (!prodField) {
         Logger.info(
            `There is no product field with configuredListId: ${utilCompanyConfiguredList?.id}... let's create one!`
         );
         prodField = await this.targetDb.productFields.create({
            label: 'Utility Companies',
            configuredListId: utilCompanyConfiguredList?.id,
         });
      }

      let fieldOnProduct = await this.targetDb.fieldsOnProducts
         .findOne({ where: { productFieldId: prodField?.id, productId: product?.id } })
         .then(deepCopy);

      if (!fieldOnProduct) {
         Logger.info(
            `There was no field on product with productFieldId: ${prodField?.id} and productId: ${product?.id}... let's create one!`
         );
         const allFieldsOnProd = await this.targetDb.fieldsOnProducts
            .findAll({
               attributes: ['id', 'displayOrder'],
               where: { productId: product?.id },
               order: [['displayOrder', 'DESC']],
            })
            .then(deepCopy);

         let displayOrder = 1;
         if (!!allFieldsOnProd?.length) {
            displayOrder = allFieldsOnProd[allFieldsOnProd?.length - 1]?.displayOrder + 1;
         }

         fieldOnProduct = await this.targetDb.fieldsOnProducts.create({
            productFieldId: prodField?.id,
            productId: product?.id,
            required: false,
            hidden: false,
            hideOnCreate: false,
            displayOrder: displayOrder,
         });
      }

      // create the fieldOnOrder
      await this.targetDb.fieldsOnOrders.create({
         fieldOnProductId: fieldOnProduct?.id,
         orderId: order?.id,
         answer: tempAnswer,
      });
   }

   private async handleFinancierId(order: any, product: any, configuredLists: Array<any>) {
      const financierConfiguredList = configuredLists
         .find((cl: any) => cl.tableName === 'financiersLookup')
         .then(deepCopy);
      if (!financierConfiguredList) {
         Logger.info(`Couldn't find a configured list for financiers...`);
         return;
      }

      let tempAnswer = await this.targetDb.financiersLookup.findByPk(order?.financierId).then(deepCopy);
      if (!tempAnswer) {
         Logger.info(`Couldn't find a financiers with id: ${order?.financierId} for order: ${order?.id}`);
         return;
      }
      tempAnswer = tempAnswer?.name;

      let prodField = await this.targetDb.productFields
         .findOne({ where: { configuredListId: financierConfiguredList?.id } })
         .then(deepCopy);
      if (!prodField) {
         Logger.info(
            `There is no product field with configuredListId: ${financierConfiguredList?.id}... let's create one!`
         );
         prodField = await this.targetDb.productFields.create({
            label: 'Financiers',
            configuredListId: financierConfiguredList?.id,
         });
      }

      let fieldOnProduct = await this.targetDb.fieldsOnProducts
         .findOne({ where: { productFieldId: prodField?.id, productId: product?.id } })
         .then(deepCopy);

      if (!fieldOnProduct) {
         Logger.info(
            `There was no field on product with productFieldId: ${prodField?.id} and productId: ${product?.id}... let's create one!`
         );
         const allFieldsOnProd = await this.targetDb.fieldsOnProducts
            .findAll({
               attributes: ['id', 'displayOrder'],
               where: { productId: product?.id },
               order: [['displayOrder', 'DESC']],
            })
            .then(deepCopy);

         let displayOrder = 1;
         if (!!allFieldsOnProd?.length) {
            displayOrder = allFieldsOnProd[allFieldsOnProd?.length - 1]?.displayOrder + 1;
         }

         fieldOnProduct = await this.targetDb.fieldsOnProducts.create({
            productFieldId: prodField?.id,
            productId: product?.id,
            required: false,
            hidden: false,
            hideOnCreate: false,
            displayOrder: displayOrder,
         });
      }

      // create the fieldOnOrder
      await this.targetDb.fieldsOnOrders.create({
         fieldOnProductId: fieldOnProduct?.id,
         orderId: order?.id,
         answer: tempAnswer,
      });
   }

   private async handleFieldColumns(
      order: any,
      product: any,
      columnName: string,
      fieldType: 'Currency' | 'Date' | 'Number' | 'Text'
   ) {
      let tempAnswer = order[columnName];
      const prodFieldLabel = camelCaseToTitleCase(columnName);

      // see if there is a productField for this
      let prodField = await this.targetDb.productFields.findOne({ where: { label: prodFieldLabel } });
      if (!prodField) {
         Logger.info(`There is no product field with label: ${prodFieldLabel}... let's create one!`);
         const currencyFieldType = await this.targetDb.fieldTypesLookup.findOne({ where: { name: fieldType } });
         if (!currencyFieldType) {
            Logger.info(`There is no field type with name: '${fieldType}'...`);
            return;
         }
         prodField = await this.targetDb.productFields.create({
            label: prodFieldLabel,
            fieldTypeId: currencyFieldType?.id,
         });
      }

      // see if there is a fieldOnProduct for this
      let fieldOnProduct = await this.targetDb.fieldsOnProducts
         .findOne({ where: { productFieldId: prodField?.id, productId: product?.id } })
         .then(deepCopy);
      if (!fieldOnProduct) {
         Logger.info(
            `There was no field on product with productFieldId: ${prodField?.id} and productId: ${product?.id}... let's create one!`
         );
         const allFieldsOnProd = await this.targetDb.fieldsOnProducts
            .findAll({
               attributes: ['id', 'displayOrder'],
               where: { productId: product?.id },
               order: [['displayOrder', 'ASC']],
            })
            .then(deepCopy);

         let displayOrder = 1;
         if (!!allFieldsOnProd?.length) {
            displayOrder = allFieldsOnProd[allFieldsOnProd?.length - 1]?.displayOrder + 1;
         }

         fieldOnProduct = await this.targetDb.fieldsOnProducts.create({
            productFieldId: prodField?.id,
            productId: product?.id,
            required: false,
            hidden: false,
            hideOnCreate: false,
            displayOrder: displayOrder,
         });
      }

      // create a field on order, only if there isn't a match for fieldOnProductId & order.id
      const fieldOnOrderExists = await this.targetDb.fieldsOnOrders
         .findOne({ where: { fieldOnProductId: fieldOnProduct?.id, orderId: order?.id } })
         .then(deepCopy);
      if (!fieldOnOrderExists) {
         // create the fieldOnOrder
         await this.targetDb.fieldsOnOrders.create({
            fieldOnProductId: fieldOnProduct?.id,
            orderId: order?.id,
            answer: tempAnswer,
         });
      }
   }
}
