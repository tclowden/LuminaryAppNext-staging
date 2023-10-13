import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';
import { UUID } from 'crypto';

type TargetSmsLog = {
   messageSid: string;
   to: string;
   from: string;
   body: string | null;
   direction: string;
   mmsUrls?: any;
   leadId: UUID;
   sentFromUserId: UUID | null;
   sentToUserId: UUID | null;
   createdAt: Date;
   deliveryStatus?: string;
};

type OriginSmsLog = {
   message_sid: string;
   body: string;
   to_id: string;
   from_id: string;
   sent_from_number: string;
   sent_to_number: string;
   acknowledged: boolean;
   sent_at: Date;
   lead: UUID;
   user: UUID;
   status: string;
};

// We are combining the sms logs and mms media tables into one table
export class SmsLogsStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         Logger.info('Migrating sms && mms logs...');
         const alreadyInDb = await this.targetDb.smsLogs.findOne({});
         if (alreadyInDb) {
            Logger.info('Sms logs already exists in db...');
            return;
         }

         let isSmsLogMigrated = false;

         while (!isSmsLogMigrated) {
            const result = await this.migrateTableData('text_messages', 'message_id', async (currRow: any) => {
               let direction: string = '';

               // if the to_id returns a lead, then it was an outbound sms
               const leadFoundInToId = await this.targetDb.leads.findOne({
                  where: {
                     oldId: currRow.to_id,
                  },
               });

               Logger.info('leadFoundInToId: ', leadFoundInToId);

               const user = await this.targetDb.users.findOne({
                  where: {
                     oldId: currRow.user,
                  },
               });

               let messageBody = Buffer.from(currRow.body, 'base64').toString('utf-8');

               if (leadFoundInToId) {
                  Logger.info('outbound sms');
                  // This was an outbound sms
                  direction = 'outbound';

                  let mmsUrl;
                  if (!messageBody) {
                     console.log('Start of mms search');
                     const mmsMedia = await this.queryDb(
                        `SELECT * FROM ${process.env.ORIGIN_DATABASE}.mms_media WHERE message = ?`,
                        [currRow.message_id]
                     );
                     console.log('mmsMedia:', mmsMedia);
                     mmsUrl = mmsMedia[0].media_url;
                  }

                  const smsLog: TargetSmsLog = {
                     leadId: leadFoundInToId?.id,
                     sentFromUserId: user?.id,
                     sentToUserId: user?.id,
                     messageSid: currRow.message_sid,
                     to: currRow.sent_to_number,
                     from: currRow.sent_from_number,
                     body: messageBody || null,
                     direction: direction,
                     createdAt: currRow.sent_at,
                     mmsUrls: mmsUrl ? [mmsUrl] : [],
                     deliveryStatus: currRow.status,
                  };
                  return await this.targetDb.smsLogs.create(smsLog);
               } else {
                  Logger.info('inbound sms');

                  const lead = await this.targetDb.leads.findOne({
                     where: {
                        oldId: currRow.lead,
                     },
                  });

                  if (!lead) return;
                  // This was an inbound sms
                  direction = 'inbound';
                  const user = await this.targetDb.users.findOne({
                     where: {
                        oldId: currRow.user,
                     },
                  });

                  let mmsUrl;
                  if (!messageBody) {
                     const mmsMedia = await this.queryDb(
                        `SELECT * FROM ${process.env.ORIGIN_DATABASE}.mms_media WHERE message = ?`,
                        [currRow.message_sid]
                     );

                     console.log('mmsMedia:', mmsMedia);
                     mmsUrl = mmsMedia.media_url;
                  }

                  const smsLog: TargetSmsLog = {
                     leadId: lead?.id,
                     sentFromUserId: user?.id,
                     sentToUserId: user?.id,
                     messageSid: currRow.message_sid,
                     to: currRow.sent_to_number,
                     from: currRow.sent_from_number,
                     body: messageBody || null,
                     direction: direction,
                     createdAt: currRow.sent_at,
                     mmsUrls: mmsUrl ? [mmsUrl] : [],
                  };
                  return await this.targetDb.smsLogs.create(smsLog);
               }
            });
            if (result) Logger.info(`Migrated sms logs table`);
            const allMigrated = await this.getMigratedStatus('text_messages');
            if (allMigrated) isSmsLogMigrated = true;
         }
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while migrating call logs');
      }
   }
}
