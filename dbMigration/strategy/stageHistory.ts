import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';
import { Op } from 'sequelize';

export class StageHistoryStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         let leadSourcesMigrated = false;

         while (!leadSourcesMigrated) {
            const pendingData = await this.getOriginData('stage_history', 100);
            if (!!pendingData?.length) {
               // remove the ON UPDATE CURRENT_TIMESTAMP for the updated_at column in the legacy db...
               // will add it back after finished
               await this.queryDb(
                  `ALTER TABLE ${process.env.ORIGIN_DATABASE}.stage_history MODIFY date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
                  []
               );

               for (const currRow of pendingData) {
                  const foundOrder = await this.targetDb.orders
                     .findOne({ where: { oldId: currRow?.order_id } })
                     .then((res: any) => JSON.parse(JSON.stringify(res)));
                  if (!foundOrder) {
                     Logger.warn('No found order for old order id: ' + currRow?.order_id);
                     await this.setRowAsMigrated(currRow);
                     continue;
                  }

                  let prevProductStage = null;
                  if (!currRow.previous_stage) {
                     // grab beginning stage
                     prevProductStage = await this.targetDb.productStages
                        .findOne({
                           where: { name: 'Beginning Stage' },
                        })
                        .then((res: any) => JSON.parse(JSON.stringify(res)));
                     if (!prevProductStage) {
                        // create the beginning stage
                        const stageType = await this.targetDb.stageTypesLookup
                           .findOne({ where: { name: 'Success' } })
                           .then((res: any) => JSON.parse(JSON.stringify(res)));
                        if (!stageType) {
                           Logger.warn('no stage type found...');
                           await this.setRowAsMigrated(currRow);
                           continue;
                        }

                        prevProductStage = await this.targetDb.productStages
                           .create({
                              name: 'Beginning Stage',
                              stageTypeId: stageType?.id,
                           })
                           .then((res: any) => JSON.parse(JSON.stringify(res)));
                     }
                  }

                  const newProductStage = await this.targetDb.productStages
                     .findOne({
                        where: {
                           [Op.or]: [
                              { oldId: currRow.new_stage },
                              { otherOldIds: { [Op.contains]: [currRow.new_stage] } },
                              { name: currRow?.new_stage_name },
                           ],
                        },
                     })
                     .then((res: any) => JSON.parse(JSON.stringify(res)));

                  const assignedTo = await this.targetDb.users
                     .findOne({ where: { oldId: currRow?.user } })
                     .then((res: any) => JSON.parse(JSON.stringify(res)));
                  if (!assignedTo) {
                     Logger.warn(`Could not find a user with legacy db id of ${currRow?.user}`);
                     await this.setRowAsMigrated(currRow);
                     continue;
                  }

                  // shouldn't have to do previous stage... only if the prevous_stage is null.. meaning it's beginning stage
                  // create a product stage for prev stage
                  if (prevProductStage) {
                     const stageOnProduct = await this.targetDb.stagesOnProducts
                        .findOne({
                           where: { productStageId: prevProductStage?.id, productId: foundOrder?.productId },
                        })
                        .then((res: any) => JSON.parse(JSON.stringify(res)));
                     if (!stageOnProduct) {
                        Logger.warn(
                           `Could not find a stage on product with productStageId: ${prevProductStage?.id} and orderId: ${foundOrder?.id}`
                        );
                        await this.setRowAsMigrated(currRow);
                        continue;
                     }

                     // get completed at by finding the next row created in the legacy db using the order_id and previous_stage = new_stage
                     let foundNextStageRowCreated = await this.queryDb(
                        `SELECT * FROM ${process.env.ORIGIN_DATABASE}.stage_history WHERE order_id = ? AND previous_stage = ?`,
                        [currRow.order_id, currRow?.new_stage]
                     ).then((res) => JSON.parse(JSON.stringify(res)));
                     foundNextStageRowCreated = foundNextStageRowCreated[0];

                     const completedAt =
                        foundNextStageRowCreated && this.isProperDate(foundNextStageRowCreated?.date_updated)
                           ? foundNextStageRowCreated?.date_updated
                           : this.isProperDate(currRow?.date_updated)
                           ? currRow?.date_updated
                           : null;

                     // for createdAt, find all the stage_history rows where order_id === currRow?.order_id...
                     // order by date_updated ASC
                     // grab the first record in the array
                     // subtract 24 hours or 1 day from that date_updated
                     // use that new date for created_at
                     const allStageHistoryRowsByOrderId = await this.queryDb(
                        `SELECT * FROM ${process.env.ORIGIN_DATABASE}.stage_history WHERE order_id = ? ORDER BY date_updated ASC;`,
                        [currRow?.order_id]
                     ).then((res: any) => JSON.parse(JSON.stringify(res)));

                     const firstStageOnOrder = allStageHistoryRowsByOrderId[0];

                     let createdAt = null;
                     if (this.isProperDate(firstStageOnOrder?.date_updated)) {
                        const currUpdatedAt = new Date(firstStageOnOrder?.date_updated.replace(' ', 'T'));
                        // subtract 1 day
                        currUpdatedAt.setDate(currUpdatedAt.getDate() - 1);
                        // convert back to timestamp
                        const yyyy = currUpdatedAt.getFullYear();
                        const MM = String(currUpdatedAt.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
                        const dd = String(currUpdatedAt.getDate()).padStart(2, '0');
                        const hh = String(currUpdatedAt.getHours()).padStart(2, '0');
                        const mm = String(currUpdatedAt.getMinutes()).padStart(2, '0');
                        const ss = String(currUpdatedAt.getSeconds()).padStart(2, '0');

                        createdAt = new Date(`${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`);
                     } else createdAt = new Date();

                     await this.targetDb.stagesOnOrders.create({
                        stageOnProductId: stageOnProduct?.id,
                        orderId: foundOrder?.id,
                        assignedToId: assignedTo?.id,
                        assignedAt: this.isProperDate(currRow?.date_updated) ? currRow?.date_updated : new Date(),
                        completedAt: completedAt,
                        oldId: currRow?.history_id,
                        createdAt: createdAt,
                        updatedAt: createdAt,
                     });
                  }

                  // create a product stage for new stage && the new_stage is not null...
                  if (newProductStage && currRow?.new_stage) {
                     const stageOnProduct = await this.targetDb.stagesOnProducts.findOne({
                        where: { productStageId: newProductStage?.id, productId: foundOrder?.productId },
                     });
                     if (!stageOnProduct) {
                        Logger.warn(
                           `Could not find a stage on product with productStageId: ${newProductStage?.id} and orderId: ${foundOrder?.id}`
                        );
                        await this.setRowAsMigrated(currRow);
                        continue;
                     }

                     // get completed at by finding the next row created in the legacy db using the order_id and previous_stage = new_stage
                     let foundNextStageRowCreated = await this.queryDb(
                        `SELECT * FROM ${process.env.ORIGIN_DATABASE}.stage_history WHERE order_id = ? AND previous_stage = ?`,
                        [currRow.order_id, currRow?.new_stage]
                     );
                     foundNextStageRowCreated = foundNextStageRowCreated[0];

                     const completedAt =
                        foundNextStageRowCreated && this.isProperDate(foundNextStageRowCreated?.date_updated)
                           ? foundNextStageRowCreated?.date_updated
                           : this.isProperDate(currRow?.date_updated)
                           ? currRow?.date_updated
                           : null;

                     await this.targetDb.stagesOnOrders.create({
                        stageOnProductId: stageOnProduct?.id,
                        orderId: foundOrder?.id,
                        assignedToId: assignedTo?.id,
                        assignedAt: this.isProperDate(currRow?.date_updated) ? currRow?.date_updated : new Date(),
                        completedAt: completedAt,
                        oldId: currRow?.history_id,
                        createdAt: this.isProperDate(currRow?.date_updated) ? currRow?.date_updated : new Date(),
                        updatedAt: this.isProperDate(currRow?.date_updated) ? currRow?.date_updated : new Date(),
                     });
                  }

                  // migrate the date_updated as the same, so it doesn't override the real date_updated
                  Logger.info(`Stage on order row created!`);
                  await this.setRowAsMigrated(currRow);
               }
            }

            const allMigrated = await this.getMigratedStatus('stage_history');
            console.log('allMigrated:', allMigrated);
            if (allMigrated) {
               leadSourcesMigrated = true;
               // add back the ON UPDATE CURRENT_TIMESTAMP default to the mysql db
               await this.queryDb(
                  `ALTER TABLE ${process.env.ORIGIN_DATABASE}.stage_history MODIFY date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
                  []
               );
            }
         }
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating stage history');
      }
   }

   private async setRowAsMigrated(currRow: any) {
      // migrate the date_updated as the same, so it doesn't override the real date_updated
      await this.queryDb(
         `UPDATE ${process.env.ORIGIN_DATABASE}.stage_history
            SET migrated = 1, date_updated = ?
            WHERE history_id = ?`,
         [new Date(currRow.date_updated), currRow.history_id]
      );
   }
}
