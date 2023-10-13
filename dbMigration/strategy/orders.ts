import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';
import { Op } from 'sequelize';
import originDb from '../originDbConnect';

export class OrdersStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         await this.addIdColToOriginTable();

         // MIGRATE LEAD PRODUCTS (ORDERS)
         let ordersMigrated = false;
         while (!ordersMigrated) {
            const result = await this.migrateTableData(
               'lead_products',
               'id',
               async (currRow: any) => {
                  const owner = await this.targetDb.users.findOne({ where: { oldId: currRow?.rep_id } });
                  // const lead = await this.targetDb.leads.findOne({ where: { oldId: currRow?.lead } });
                  const lead = await this.targetDb.leads.findOne({
                     where: {
                        [Op.or]: [{ oldId: currRow.lead }, { otherOldIds: { [Op.contains]: [currRow.lead] } }],
                     },
                  });
                  if (!lead) return Logger.error('Could not find lead for oldId:' + currRow?.lead);
                  const product = await this.targetDb.productsLookup.findOne({ where: { oldId: currRow?.product } });
                  if (!product) return Logger.error('Could not find product for oldId:' + currRow?.product);
                  const utilityCompany = await this.targetDb.utilityCompaniesLookup.findOne({
                     where: { oldId: currRow?.electric_company },
                  });
                  const financier = await this.targetDb.financiersLookup.findOne({
                     where: { oldId: currRow?.financier },
                  });
                  const productStage = await this.targetDb.productStages.findOne({
                     where: {
                        [Op.or]: [
                           { oldId: currRow?.stage },
                           {
                              otherOldIds: {
                                 [Op.contains]: [currRow?.stage],
                              },
                           },
                        ],
                     },
                  });
                  const createdBy = await this.targetDb.users
                     .findOne({ where: { oldId: currRow?.created_by } })
                     .then((res: any) => JSON.parse(JSON.stringify(res)));
                  const createdAt = currRow?.created_at ?? null;
                  if (!createdAt) return Logger.error('The column "created_at" cannot be null...');

                  const createdOrder = await this.targetDb.orders.create({
                     oldId: currRow?.id,
                     ownerId: owner?.id,
                     leadId: lead?.id,
                     productId: product?.id,
                     total: currRow?.total,
                     installAddress: currRow?.install_address,
                     installSignedDate: this.isProperDate(currRow?.install_signed_date)
                        ? currRow?.install_signed_date
                        : createdAt,
                     productStageId: productStage?.id,
                     // lastUpdatedBy: '',
                     firstFundedAmount: currRow?.f_f_amount,
                     secondFundedAmount: currRow?.s_f_amount,
                     thirdFundedAmount: currRow?.t_f_amount,
                     firstFundedAt: currRow?.f_d_funded,
                     secondFundedAt: currRow?.s_d_funded,
                     thirdFundedAt: currRow?.t_d_funded,
                     createdAt: createdAt,
                     createdById: createdBy?.id,
                     utilityCompanyId: utilityCompany?.id,
                     financierId: financier?.id,
                     stateTax: currRow?.state_tax,
                     countyTax: currRow?.county_tax,
                     cityTax: currRow?.city_tax,
                     dealerFee: currRow?.dealer_fee,
                  });

                  // create fields on orders
                  const allFieldsOnOrderToMigrate = await this.queryDb(
                     `SELECT * FROM ${process.env.ORIGIN_DATABASE}.lead_product_input_value WHERE lead_product = ?`,
                     [currRow?.id]
                  ).then((res: any) => JSON.parse(JSON.stringify(res)));

                  if (!!allFieldsOnOrderToMigrate?.length) {
                     for (const fOO of allFieldsOnOrderToMigrate) {
                        // WHY is fieldsOnOrders referencing the fieldsOnProduct table? ... shouldn't it jsut be an order id & a product field id?
                        // The reason why we have fieldsOnProducts is just to display the propoer fields for each product when creating // updating an order

                        // const fieldOnProd = await this.targetDb.fieldsOnProducts.findOne({
                        //    where: {
                        //       oldId: fOO?.input_field,
                        //       // [Op.or]: [
                        //       //    { oldId: fOO?.input_field },
                        //       //    { otherOldIds: { [Op.contains]: [fOO?.input_field] } },
                        //       // ],
                        //    },
                        // });

                        // find the product field by input_field
                        const prodField = await this.targetDb.productFields.findOne({
                           where: {
                              // oldId: fOO?.input_field,
                              [Op.or]: [
                                 { oldId: fOO?.input_field },
                                 { otherOldIds: { [Op.contains]: [fOO?.input_field] } },
                              ],
                           },
                           // include: [{ model: this.targetDb.fieldsOnProducts, as: 'fieldsOnProduct', required: false }],
                        });

                        // based on the prodField id, find the fieldsOnProduct
                        // const productField = await this.targetDb.fieldsOnProducts.findOne({
                        //    where: {
                        //       productFieldId: prodField?.id,
                        //       // productId:
                        //    },
                        // });

                        // console.log('FOUND fieldOnProd:', fieldOnProd);
                        // console.log('fOO:', fOO);
                        if (!prodField) {
                           Logger.error(`No product field found...`);
                           console.log(`currRow: `, fOO);
                           return;
                        }

                        const answer = fOO?.input_value?.length > 0 ? fOO?.input_value : null;

                        await this.targetDb.fieldsOnOrders.create({
                           oldId: fOO?.id,
                           productFieldId: prodField?.id,
                           orderId: createdOrder?.id,
                           answer: answer,
                        });
                     }

                     // set migrated status to 1 on the lead_product_input_value table
                     const allIdsToMigrate = allFieldsOnOrderToMigrate
                        .map((inputVal: any) => inputVal?.id)
                        .filter((inputVal: any) => inputVal);
                     await this.setMigratedStatus('lead_product_input_value', 'id', allIdsToMigrate);
                  }

                  // NOT GOING TO DO THIS AUDIT LOG...
                  // NO WAY TO KNOW WHAT THE PREVIOUS VALUES WERE AND WHEN IT WAS UPDATED
                  // const updatedBy = await this.targetDb.users.findOne({ where: { oldId: currRow?.last_updated_by }});
                  // console.log('updatedBy:', updatedBy)
                  //    // create audit log row
                  //    await this.targetDb.auditLogs.create({
                  //       table: 'orders',
                  //       rowId: createdOrder?.id,
                  //       originalValue: JSON.stringify({ isMigration: true }),
                  //       newValue: JSON.stringify(createdOrder),
                  //       modifiedById: updatedBy?.id,
                  //       modifiedAt: new Date(),
                  //    });
               },
               false
            );
            if (result) Logger.info(`Migrated orders table`);
            const allMigrated = await this.getMigratedStatus('lead_products');
            if (allMigrated) ordersMigrated = true;
         }
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating lead products');
      }
   }

   private async addIdColToOriginTable() {
      // add primary key auto incrementing to lead_product_input_value... just to keep track of oldId
      const colExists: Array<any> = await new Promise((resolve, reject) => {
         originDb.query(
            `SELECT NULL FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = "${process.env.ORIGIN_DATABASE}" AND TABLE_NAME = "lead_product_input_value" AND COLUMN_NAME = "id"`,
            [],
            function (error: any, results: any, fields: any) {
               if (error) reject(error);
               resolve(results);
            }
         );
      });

      if (!colExists?.length) {
         await new Promise((resolve, reject) => {
            originDb.query(
               `ALTER TABLE ${process.env.ORIGIN_DATABASE}.lead_product_input_value ADD COLUMN id INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (id)`,
               [],
               function (error: any, results: any, fields: any) {
                  if (error) reject(error);
                  resolve(results);
               }
            );
         });
         Logger.info(`Adding 'id' column to table: ${process.env.ORIGIN_DATABASE}.lead_product_input_value`);
      } else {
         Logger.info(
            `The 'id' column already exists for table: ${process.env.ORIGIN_DATABASE}.lead_product_input_value`
         );
      }
   }
}
