import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class StatusesStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         await this.migrateStatusRulesTypes();

         await this.migrateStatusTypes();

         const statusTypes = await this.targetDb.statusTypes
            .findAll({})
            .then((res: any) => JSON.parse(JSON.stringify(res)));

         const statusRulesTypes = await this.targetDb.statusRulesTypes
            .findAll({})
            .then((res: any) => JSON.parse(JSON.stringify(res)));

         let statusesMigrated = false;
         while (!statusesMigrated) {
            await this.migrateTableData('status', 'status_id', async (currRow: any) => {
               const statusType = await statusTypes.find((st: any) => st.oldId === currRow?.type);
               if (!statusType) return;

               const createdStatus = await this.targetDb.statuses.create({
                  name: currRow.status_name,
                  typeId: statusType?.id,
                  oldId: currRow.status_id,
               });

               // utility
               const createRows = async (statusRuleTypeId: string) => {
                  console.log('statusRuleTypeId: ', statusRuleTypeId);

                  // create a new rulesOnStatuses row
                  await this.targetDb.rulesOnStatuses.create({
                     statusId: createdStatus?.id,
                     statusRulesTypesId: statusRuleTypeId,
                  });

                  if (currRow?.require_number_calls > 0) {
                     await this.targetDb.statusMetaData.create({
                        statusId: createdStatus?.id,
                        requiredNumberOfCalls: currRow?.require_number_calls,
                     });
                  }
               };

               if (currRow['dnc_status'] === 1) {
                  // create a new statusRules row
                  const ruleType = statusRulesTypes.find((srt: any) => srt.name === 'Do Not Contact');
                  if (!ruleType) return console.log('could not find rule type for...', currRow);
                  await createRows(ruleType?.id);
               }
               if (currRow['human_answered_status'] === 1) {
                  // create a new statusRules row
                  const ruleType = statusRulesTypes.find((srt: any) => srt.name === 'Human Answered Status');
                  if (!ruleType) return console.log('could not find rule type for...', currRow);
                  await createRows(ruleType?.id);
               }
               if (currRow['scheduled_status'] === 1) {
                  // create a new statusRules row
                  const ruleType = statusRulesTypes.find((srt: any) => srt.name === 'Scheduled Status');
                  if (!ruleType) return console.log('could not find rule type for...', currRow);
                  await createRows(ruleType?.id);
               }
               if (currRow['bucket_status'] === 1) {
                  // create a new statusRules row
                  const ruleType = statusRulesTypes.find((srt: any) => srt.name === 'Bucket Status');
                  if (!ruleType) return console.log('could not find rule type for...', currRow);
                  await createRows(ruleType?.id);
               }
               if (currRow['pipe_status'] === 1) {
                  // create a new statusRules row
                  const ruleType = statusRulesTypes.find((srt: any) => srt.name === 'Pipe Status');
                  if (!ruleType) return console.log('could not find rule type for...', currRow);
                  await createRows(ruleType?.id);
               }
               if (currRow['hidden_status'] === 1) {
                  // create a new statusRules row
                  const ruleType = statusRulesTypes.find((srt: any) => srt.name === 'Hidden Status');
                  if (!ruleType) return console.log('could not find rule type for...', currRow);
                  await createRows(ruleType?.id);
               }
               if (currRow['ask_appointment_outcome'] === 1) {
                  // create a new statusRules row
                  const ruleType = statusRulesTypes.find((srt: any) => srt.name === 'Ask Appointment Outcome');
                  if (!ruleType) return console.log('could not find rule type for...', currRow);
                  await createRows(ruleType?.id);
               }
               if (currRow['dpl_status'] === 1) {
                  // create a new statusRules row
                  const ruleType = statusRulesTypes.find((srt: any) => srt.name === 'Dollar Per Lead Status');
                  if (!ruleType) return console.log('could not find rule type for...', currRow);
                  await createRows(ruleType?.id);
               }
               if (currRow['hide_if_contacted'] === 1) {
                  // create a new statusRules row
                  const ruleType = statusRulesTypes.find((srt: any) => srt.name === 'Hide If Contacted');
                  if (!ruleType) return console.log('could not find rule type for...', currRow);
                  await createRows(ruleType?.id);
               }
               if (currRow['require_number_calls'] > 0) {
                  // create a new statusRules row
                  const ruleType = statusRulesTypes.find((srt: any) => srt.name === 'Required Number of Calls');
                  if (!ruleType) return console.log('could not find rule type for...', currRow);
                  await createRows(ruleType?.id);
               }
               if (currRow['require_note'] === 1) {
                  // create a new statusRules row
                  const ruleType = statusRulesTypes.find((srt: any) => srt.name === 'Require Note');
                  if (!ruleType) return console.log('could not find rule type for...', currRow);
                  await createRows(ruleType?.id);
               }
            });

            const allMigrated = await this.getMigratedStatus('status');
            if (allMigrated) statusesMigrated = true;
         }
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating statuses');
      }
   }

   private async migrateStatusRulesTypes() {
      const inDb = await this.targetDb.statusRulesTypes.findOne({});
      if (inDb) return Logger.info('Status rules types already in db...');

      const defaultStatusRulesTypes = [
         { name: 'Do Not Contact', description: 'Disables outbound communication to this lead.' },
         { name: 'Human Answered Status', description: 'Voice to voice contact has been made with lead.' },
         { name: 'Scheduled Status', description: 'Prompts a date-time input with status.' },
         { name: 'Bucket Status', description: 'Leads will be placed in a Get Next Lead Bucket.' },
         { name: 'Pipe Status', description: 'Places lead in the pipe of the User.' },
         { name: 'Hidden Status', description: 'Will never be shown in the Status Modal,' },
         { name: 'Ask Appointment Outcome', description: 'Prompts the user if the most recent appointment was kept.' },
         { name: 'Dollar Per Lead Status', description: 'Included status for dpl reports.' },
         {
            name: 'Hide If Contacted',
            description: 'If a rep makes contact with a lead, these statuses will be hidden from the status modal.',
         },
         { name: 'Require Note', description: 'A text input will accompany status.' },
         {
            name: 'Required Number of Calls',
            description: 'Only show these statuses after required number of calls has been met.',
         },
         {
            name: 'Trigger Webhook',
            description: 'Post request with lead and status data sent to user provided webhook.',
         },
      ];

      const result = await this.targetDb.statusRulesTypes.bulkCreate(defaultStatusRulesTypes);
      if (result) Logger.info(`Migrated status rules types table`);
   }

   private async migrateStatusTypes() {
      const inDb = await this.targetDb.statusTypes.findOne({});
      if (inDb) return Logger.info('Status types already in db...');

      // const defaultStatusTypes = ['New', 'Trash', 'Recycle', 'Success'];
      const currDbStatusTypes = await this.getOriginData('status_type');

      if (currDbStatusTypes?.length > 0) {
         let result = [];
         const ids = [];
         for (const currType of currDbStatusTypes) {
            const newSt = currType?.type_name?.trim().includes('new');
            const recycleSt = currType?.type_name?.trim().includes('recycle');
            const successSt = currType?.type_name?.trim().includes('success');
            const trashSt = currType?.type_name?.trim().includes('trash');
            const name = newSt ? 'New' : recycleSt ? 'Recycle' : successSt ? 'Success' : trashSt ? 'Trash' : null;
            if (!name) return;
            const res = await this.targetDb.statusTypes.create({
               oldId: currType?.type_id,
               name: name,
            });
            ids.push(currType?.type_id);
            result.push(res);
         }
         this.setMigratedStatus('status_type', 'type_id', ids, false);
         if (!!result?.length) Logger.info(`Migrated status types table...`);
      }
   }
}
