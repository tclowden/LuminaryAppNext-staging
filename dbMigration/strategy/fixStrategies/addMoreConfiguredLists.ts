import { BaseMigration } from '../base';
import { MigrationStrategy } from '../contracts/migrationContract';
import Logger from '../../logger';
import db from '../../../sequelize/models';
import { LumError } from '../../../utilities/models/LumError';
import { deepCopy } from '../../../utilities/helpers';

export class AddMoreConfiguredListsStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         // there are a bunch of roleOnProductCoordinators rows... destory any duplicates

         // loop through all the rolesOnProductCoordintors and see if there are any duplicates roleIds with productCoordinatorIds...
         const proposalOptionConfiguredList = await db.configuredListsLookup
            .findOne({ where: { tableName: 'proposalOptions' } })
            .then(deepCopy);
         if (!proposalOptionConfiguredList) {
            await db.configuredListsLookup.create({
               name: 'Proposals',
               tableName: 'proposalOptions',
               keyPath: 'name',
            });
         }

         Logger.info(`Successfully added more configured lists...`);
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while migrating call logs');
      }
   }
}
