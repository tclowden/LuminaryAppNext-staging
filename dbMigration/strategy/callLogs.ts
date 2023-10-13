import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';
import { UUID } from 'crypto';

type TargetCallLogs = {
   leadId: UUID;
   userId: UUID;
   sid: string;
   from: string;
   to: string;
   callStatus: string;
   direction: string;
   duration: number;
   recordingUrl: string;
   createdAt: Date;
   updatedAt: Date;
   oldId: string;
   callCompleted: Date;
};

type OriginCallLogs = {
   call_id: string;
   call_sid: string;
   type: string;
   from_number: string;
   to_number: string;
   twilio_status: string;
   user: string;
   call_started: Date;
   call_completed: Date;
   recording_url: string;
   lead: string;
   conference_sid: string;
};
export class CallLogsStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         Logger.info('Migrating call logs...');
         const alreadyInDb = await this.targetDb.callLogs.findOne({});
         Logger.info('alreadyInDb: ', alreadyInDb);
         if (alreadyInDb) {
            Logger.info('Call logs already exists in db...');
            return;
         }

         let callLogsMigrated = false;

         while (!callLogsMigrated) {
            const result = await this.migrateTableData('call_logs', 'call_id', async (currRow: OriginCallLogs) => {
               const lead = await this.targetDb.leads.findOne({
                  where: {
                     oldId: currRow.lead,
                  },
               });
               const user = await this.targetDb.users.findOne({
                  where: {
                     oldId: currRow.user,
                  },
               });
               const callLog: TargetCallLogs = {
                  leadId: lead?.id,
                  userId: user?.id,
                  sid: currRow.call_sid,
                  from: currRow.from_number,
                  to: currRow.to_number,
                  callStatus: currRow.twilio_status,
                  direction: currRow.type == '1' ? 'outbound' : 'inbound',
                  duration: 0,
                  recordingUrl: currRow.recording_url,
                  callCompleted: currRow.call_completed,
                  createdAt: currRow.call_started,
                  updatedAt: currRow.call_completed,
                  oldId: currRow.call_id,
               };
               return await this.targetDb.callLogs.create(callLog);
            });
            if (result) Logger.info(`Migrated call logs table`);
            const allMigrated = await this.getMigratedStatus('call_logs');
            if (allMigrated) callLogsMigrated = true;
         }
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while migrating call logs');
      }
   }
}
