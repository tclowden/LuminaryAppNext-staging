import { BaseMigration } from '../base';
import { MigrationStrategy } from '../contracts/migrationContract';
import Logger from '../../logger';
import { LumError } from '../../../utilities/models/LumError';
import { deepCopy } from '../../../utilities/helpers';

export class AddAttachmentTypesToAttachmentsStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         await this.createAttachmentTypes();
         const attachmentTypes = await this.targetDb.attachmentTypesLookup.findAll({}).then(deepCopy);

         const attachments = await this.targetDb.attachments.findAll({ where: { attachmentTypeId: null } });
         Logger.info(`Found ${attachments?.length} attachments without attachment types!:`);

         if (!!attachments?.length) {
            let i = 1;
            let currRowsUpdated = 0;

            for (const attachment of attachments) {
               let attachmentType = null;
               if (attachment?.leadId) attachmentType = attachmentTypes?.find((at: any) => at.name === 'Lead Record');
               else if (attachment?.orderId)
                  attachmentType = attachmentTypes?.find((at: any) => at.name === 'Work Order');

               if (!attachmentType) {
                  Logger.warn(`Could not find attachment type for attachment: ${attachment?.id}`);
                  continue;
               }

               await this.targetDb.attachments.update(
                  { attachmentTypeId: attachmentType?.id },
                  { where: { id: attachment?.id } }
               );

               if (i === 300) {
                  Logger.info(`Updated ${currRowsUpdated} attachments!`);
                  currRowsUpdated += 1;
                  i = 0;
               } else i += 1;
            }
         }

         Logger.info(`Successfully updated attachments with attachment types!`);
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while adding attachment types to attachments...');
      }
   }

   async createAttachmentTypes() {
      const attachmentTypes = await this.targetDb.attachmentTypesLookup.findAll({}).then(deepCopy);
      if (!attachmentTypes?.length) {
         Logger.info(`No attachment types found... Create the default ones!`);
         await this.targetDb.attachmentTypesLookup.bulkCreate([
            { name: 'Lead Record' },
            { name: 'Work Order' },
            { name: 'Install Agreement' },
            { name: 'Proposal' },
            { name: 'MMS' },
         ]);
         Logger.info(`Created the default attachment types!`);
      }
   }
}
