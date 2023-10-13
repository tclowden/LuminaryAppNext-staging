import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class ConfiguredListsLookupStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         const inDb = await this.targetDb.configuredListsLookup.findOne();
         if (inDb) {
            Logger.info(`Configured lists already in db...`);
            return;
         }

         const defaultConfiguredLists = [
            {
               name: 'Financiers',
               tableName: 'financiersLookup',
               keyPath: 'name',
            },
            { name: 'Teams', tableName: 'teams', keyPath: 'name' },
            { name: 'Users', tableName: 'users', keyPath: 'fullName' },
            { name: 'States', tableName: 'statesLookup', keyPath: 'name' },
            {
               name: 'Utility Companies',
               tableName: 'utilityCompaniesLookup',
               keyPath: 'name',
            },
            { name: 'Products', tableName: 'productsLookup', keyPath: 'name' },
            { name: 'Proposals', tableName: 'proposalOptions', keyPath: 'name' },
         ];
         const result = await this.targetDb.configuredListsLookup.bulkCreate(defaultConfiguredLists);
         if (result) Logger.info(`Migrated configured lists lookup table`);
      } catch (error) {
         console.log('error', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating configured lists lookup');
      }
   }
}
