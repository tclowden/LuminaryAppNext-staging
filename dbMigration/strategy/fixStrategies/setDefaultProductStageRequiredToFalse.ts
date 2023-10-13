import { BaseMigration } from '../base';
import { MigrationStrategy } from '../contracts/migrationContract';
import Logger from '../../logger';
import db from '../../../sequelize/models';
import { LumError } from '../../../utilities/models/LumError';
import { deepCopy } from '../../../utilities/helpers';

export class SetDefaultStagesOnProductsRequiredToFalse extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         const stagesOnProductsToAlter = await db.stagesOnProducts
            .findAll({ where: { required: null } })
            .then(deepCopy);

         const stagesOnProductsToAlterLength = stagesOnProductsToAlter?.length;
         if (stagesOnProductsToAlterLength) {
            let i = 1;
            let currRowsUpdated = 0;

            // loop through all product stages and set the null values to false for 'required' column
            for (const stageOnProd of stagesOnProductsToAlter) {
               await db.stagesOnProducts.update({ required: false }, { where: { id: stageOnProd?.id } });
               currRowsUpdated += 1;

               if (i === 250) {
                  Logger.info(
                     `Updated ${currRowsUpdated} rows out of ${stagesOnProductsToAlterLength} rows in stagesOnProducts table!`
                  );
                  i = 0;
               } else i++;
            }
         }

         Logger.info(`Successfully changed required: null values to required: false for stages on products.`);
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while migrating call logs');
      }
   }
}
