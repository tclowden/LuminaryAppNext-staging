import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class AttachmentsStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         // Operations, Marketing, Sales
         // combine attachments and survey_attachments to this table
         await this.migrateAttachmentTypesLookup();

         let attachmentsMigrated = false;
         while (!attachmentsMigrated) {
            const results = await this.migrateTableData('attachments', 'attachment_id', async (currRow: any) => {
               const user = await this.targetDb.users.findOne({ where: { oldId: currRow?.creator } });
               const lead = await this.targetDb.leads.findOne({ where: { oldId: currRow?.lead } });
               await this.targetDb.attachments.create({
                  fileName: currRow?.attachment_name,
                  publicUrl: currRow?.attachment_url,
                  leadId: lead?.id,
                  userId: user?.id,
                  oldId: currRow?.attachment_id,
                  createdAt: currRow?.created_at,
               });
            });
            if (results) Logger.info(`Migrated attachments table`);

            const allMigrated = await this.getMigratedStatus('attachments');
            if (allMigrated) attachmentsMigrated = true;
         }

         let surveyAttachmentsMigrated = false;
         while (!surveyAttachmentsMigrated) {
            const results = await this.migrateTableData('survey_attachments', 'id', async (currRow: any) => {
               const user = await this.targetDb.users.findOne({ where: { oldId: currRow?.owner } });
               const order = await this.targetDb.orders.findOne({ where: { oldId: currRow?.order } });
               await this.targetDb.attachments.create({
                  fileName: currRow?.attachment_name,
                  publicUrl: currRow?.attachment_url,
                  orderId: order?.id,
                  userId: user?.id,
                  oldId: currRow?.id,
                  createdAt: currRow?.created_at,
                  updatedAt: currRow?.updated_at,
               });
            });
            if (results) Logger.info(`Migrated survey attachments table`);

            const allMigrated = await this.getMigratedStatus('survey_attachments');
            if (allMigrated) surveyAttachmentsMigrated = true;
         }
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while migrating call logs');
      }
   }

   private async migrateAttachmentTypesLookup() {
      const inDb = await this.targetDb.attachmentTypesLookup.findOne({});
      if (inDb) return Logger.info('Attachment types lookup types already in db...');

      const defaultAttachmentTypes = [{ name: 'Operations' }, { name: 'Marketing' }, { name: 'Sales' }];
      const result = await this.targetDb.attachmentTypesLookup.bulkCreate(defaultAttachmentTypes);

      if (result) Logger.info(`Migrated Attachment types lookup table`);
   }
}
