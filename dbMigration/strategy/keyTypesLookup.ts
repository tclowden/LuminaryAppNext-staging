import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class KeyTypesLookupStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         // const result
         const alreadyInDb = await this.targetDb.keyTypesLookup.findOne({});
         if (alreadyInDb) {
            Logger.info(`Key types already exists in db...`);
            return;
         }

         const defaultTeamTypes = [{ name: 'register' }, { name: 'forgot_password' }];
         const result = await this.targetDb.keyTypesLookup.bulkCreate(defaultTeamTypes);

         if (result) Logger.info(`Migrated key types table`);
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while migrating appointments');
      }
   }
}
