import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class BucketTypesStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         // const result
         const alreadyInDb = await this.targetDb.bucketTypes.findOne({});
         if (alreadyInDb) {
            Logger.info('Bucket types already exists in db...');
            return;
         }

         const defaultstageTypesLookup = [
            { typeName: 'Static' },
            { typeName: 'Auto Dialer' },
            { typeName: 'Power Dialer' },
            { typeName: 'Default' },
         ];
         const result = await this.targetDb.bucketTypes.bulkCreate(defaultstageTypesLookup);
         if (result) Logger.info(`Task Due bucketTypes table`);
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while migrating bucketTypes');
      }
   }
}
