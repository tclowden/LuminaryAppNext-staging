import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class LeadSourcesStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         await this.migrateLeadSourceTypes();

         const leadSourceTypes = await this.targetDb.leadSourceTypes.findAll({});

         let leadSourcesMigrated = false;
         while (!leadSourcesMigrated) {
            const result = await this.migrateTableData('lead_sources', 'source_id', async (currRow: any) => {
               const sourceType = leadSourceTypes.find((st: any) => st.oldId === currRow.source_type);
               if (!sourceType) return;
               return await this.targetDb.leadSources.create({
                  name: currRow?.source_name?.trim(),
                  typeId: sourceType?.id,
                  endpoint: 'migrated... need to update',
                  oldId: currRow?.source_id,
               });
            });
            if (result) Logger.info(`Migrated lead sources table.`);

            const allMigrated = await this.getMigratedStatus('lead_sources');
            if (allMigrated) leadSourcesMigrated = true;
         }
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating lead sources');
      }
   }

   private async migrateLeadSourceTypes() {
      const inDb = await this.targetDb.leadSourceTypes.findOne({});
      if (inDb) return Logger.info('Lead source types already in db...');

      const result = await this.migrateTableData(
         'lead_source_type',
         'lead_source_type_id',
         async (currRow: any) =>
            await this.targetDb.leadSourceTypes.create({
               typeName: currRow.type_name,
               oldId: currRow.lead_source_type_id,
            })
      );
      if (result) Logger.info(`Migrated lead source types table.`);
   }
}
