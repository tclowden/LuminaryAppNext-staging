import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class AttachmentTypesStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         const alreadyInDb = await this.targetDb.attachmentTypes.findOne({});
         if (alreadyInDb) throw new LumError(400, `Attachment types already exists in db...`);

         const result = await this.targetDb.attachmentTypes.bulkCreate([
            { name: 'Operations' },
            { name: 'Marketing' },
            { name: 'Sales' },
         ]);

         if (result) Logger.info(`Migrated attachment types table`);
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating attachment types');
      }
   }
}
