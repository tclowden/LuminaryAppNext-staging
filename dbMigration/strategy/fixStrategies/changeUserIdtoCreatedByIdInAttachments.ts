import { BaseMigration } from '../base';
import { MigrationStrategy } from '../contracts/migrationContract';
import Logger from '../../logger';
import db from '../../../sequelize/models';
import { LumError } from '../../../utilities/models/LumError';
import { deepCopy } from '../../../utilities/helpers';
import { Op } from 'sequelize';

export class ChangeUserIdToCreatedByIdInAttachmentsStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         const attachments = await db.attachments
            .findAll({
               where: {
                  createdById: null,
                  userId: { [Op.ne]: null },
               },
            })
            .then(deepCopy);
         const attachmentsLength = attachments?.length;

         if (!!attachmentsLength) {
            let i = 1;
            let currRowsUpdated = 0;
            for (const attachment of attachments) {
               await this.targetDb.attachments.update(
                  { createdById: attachment?.userId },
                  { where: { id: attachment?.id } }
               );

               currRowsUpdated += 1;
               if (i === 250) {
                  Logger.info(`Updated ${currRowsUpdated} rows out of ${attachmentsLength} rows in attachments table!`);
                  i = 0;
               } else i++;
            }
         }

         await db.sequelize.query(`UPDATE "public"."attachments" SET "userId" = null WHERE "userId" IS NOT NULL;`);

         Logger.info(`Successfully updated the attachments table with createdById's.`);
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while migrating call logs');
      }
   }
}
