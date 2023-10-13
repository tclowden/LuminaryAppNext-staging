import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class OfficesStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         const inDb = await this.targetDb.offices.findOne({});
         if (inDb) {
            Logger.info(`Offices already migrated`);
            return;
         }

         let officesMigrated = false;
         while (!officesMigrated) {
            const results = await this.migrateTableData('rep_offices', 'office_id', async (currRow: any) => {
               const currOfficeName = currRow?.office_name?.toLowerCase();
               let officeName;
               if (currOfficeName === 'ar') officeName = 'Arkansas';
               else if (currOfficeName === 'ut') officeName = 'Utah';
               else officeName = currRow?.office_name;
               return await this.targetDb.offices.create({ name: officeName, oldId: currRow?.office_id });
            });

            if (results) Logger.info(`Migrated offices table`);
            const allMigrated = await this.getMigratedStatus('rep_offices');
            if (allMigrated) officesMigrated = true;
         }

         const newOfficesToWrite = [
            { name: 'Idaho', oldId: null },
            { name: 'Peru', oldId: null },
            { name: 'Development', oldId: null },
         ];
         const results = await this.targetDb.offices.bulkCreate(newOfficesToWrite);
         if (results) Logger.info(`Migrated offices table`);
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating rep offices');
      }
   }
}
