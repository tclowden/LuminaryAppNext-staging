import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class NotesStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         // Operations, Marketing, Sales
         // combine attachments and survey_attachments to this table

         let leadNotesMigrated = false;
         while (!leadNotesMigrated) {
            const results = await this.migrateTableData('lead_notes', 'note_id', async (currRow: any) => {
               const createdBy = await this.targetDb.users.findOne({ where: { oldId: currRow?.creator } });
               const lead = await this.targetDb.leads.findOne({ where: { oldId: currRow?.lead } });

               const createdAt = this.isProperDate(currRow?.created_at) ? currRow?.created_at : new Date();

               await this.targetDb.notes.create({
                  content: currRow?.note,
                  createdById: createdBy?.id,
                  leadId: lead?.id,
                  oldId: currRow?.note_id,
                  createdAt: createdAt,
                  pinned: currRow?.pinned === 0 ? false : true,
               });
            });
            if (results) Logger.info(`Migrated lead notes table`);

            const allMigrated = await this.getMigratedStatus('lead_notes');
            if (allMigrated) leadNotesMigrated = true;
         }

         let surveyNotesMigrated = false;
         while (!surveyNotesMigrated) {
            const results = await this.migrateTableData('survey_notes', 'id', async (currRow: any) => {
               const createdBy = await this.targetDb.users.findOne({ where: { oldId: currRow?.owner } });
               const order = await this.targetDb.orders.findOne({ where: { oldId: currRow?.order } });

               await this.targetDb.notes.create({
                  content: currRow?.content,
                  createdById: createdBy?.id,
                  orderId: order?.id,
                  oldId: currRow?.id,
               });
            });
            if (results) Logger.info(`Migrated survey notes table`);

            const allMigrated = await this.getMigratedStatus('survey_notes');
            if (allMigrated) surveyNotesMigrated = true;
         }
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating notes');
      }
   }
}
