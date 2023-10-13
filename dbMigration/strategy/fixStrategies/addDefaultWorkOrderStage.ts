import { BaseMigration } from '../base';
import { MigrationStrategy } from '../contracts/migrationContract';
import Logger from '../../logger';
import db from '../../../sequelize/models';
import { LumError } from '../../../utilities/models/LumError';
import { deepCopy } from '../../../utilities/helpers';

export class AddDefaultWorkOrderStageStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         const beginningStageAlreadyInDb = await db.productStages.findOne({ where: { name: 'Beginning Stage' } });
         if (!beginningStageAlreadyInDb) {
            const stageType = await db.stageTypesLookup.findOne({ where: { name: 'Success' } });
            if (!stageType) {
               console.log('no stage type found...');
               return;
            }

            await db.productStages.create({
               name: 'Beginning Stage',
               stageTypeId: stageType?.id,
            });
         }

         // add beginningStage to every product
         const products = await db.productsLookup
            .findAll({
               include: [{ model: db.stagesOnProducts, required: false, as: 'stagesOnProduct' }],
            })
            .then(deepCopy);
         const beginningStage = await db.productStages.findOne({ where: { name: 'Beginning Stage' } }).then(deepCopy);
         if (!!products?.length && beginningStage) {
            const productsWithoutBeginningStage = products.filter((prod: any) => {
               const prodHasBeginningStage = prod?.stagesOnProduct?.find(
                  (stageOnProd: any) => stageOnProd?.productStageId === beginningStage?.id
               );
               if (!prodHasBeginningStage) return prod;
            });

            if (!!productsWithoutBeginningStage?.length) {
               // we want to rearrange all of the displayOrders for every stage on product to move up one...
               // beginning stage should always be 1
               for (const prod of productsWithoutBeginningStage) {
                  const currStagesOnProd = [...prod?.stagesOnProduct];
                  if (!!currStagesOnProd?.length) {
                     for (const stageOnProd of currStagesOnProd) {
                        await db.stagesOnProducts.update(
                           { displayOrder: stageOnProd?.displayOrder + 1 },
                           { where: { id: stageOnProd?.id } }
                        );
                     }
                  }
                  // add beginning stage to the product
                  await db.stagesOnProducts.create({
                     displayOrder: 1,
                     productStageId: beginningStage?.id,
                     productId: prod?.id,
                     timeline: 0,
                     scheduled: false,
                  });
               }
            }
         }

         Logger.info(`Successfully added a default stage for work orders.`);
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while migrating call logs');
      }
   }
}
