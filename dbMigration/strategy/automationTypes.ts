import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class AutomationTypesStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         const typesInDb = await this.targetDb.automationTypesLookup.findOne({});
         if (!typesInDb) {
            const result = await this.targetDb.automationTypesLookup.bulkCreate([
               { name: 'Marketing' },
               { name: 'Operations' },
            ]);
            if (result) Logger.info(`Migrated automation types table`);
         }

         const statusInDbAgain = await this.targetDb.automationStatusLookup.findOne({});
         if (!statusInDbAgain) {
            // active, paused, stopped, completed, waiting, error
            const result = await this.targetDb.automationStatusLookup.bulkCreate([
               { name: 'Active' },
               { name: 'Paused' },
               { name: 'Stopped' },
               { name: 'Completed' },
               { name: 'Waiting' },
               { name: 'Error' },
            ]);
            if (result) Logger.info(`Migrated automation stautses lookup table`);
         }

         const triggersInDb = await this.targetDb.automationTriggers.findOne({});
         if (!triggersInDb) {
            const types = await this.targetDb.automationTypesLookup
               .findAll({})
               .then((res: any) => JSON.parse(JSON.stringify(res)));
            const marketingType = types.find((type: any) => type?.name === 'Marketing');
            const operationsTypes = types.find((type: any) => type?.name === 'Operations');

            const marketingTriggers = ['Lead Created', 'Status Updated', 'New Text'];
            const operationTriggers = [
               'Stage Updated',
               'Task Is Completed',
               'Order Created',
               'Field Completed',
               'Team Scheduled',
            ];

            let triggersToWrite: Array<any> = [];
            marketingTriggers.forEach((trigger: string) =>
               triggersToWrite.push({ name: trigger, automationTypeId: marketingType?.id })
            );
            operationTriggers.forEach((trigger: string) =>
               triggersToWrite.push({ name: trigger, automationTypeId: operationsTypes?.id })
            );

            // active, paused, stopped, completed, waiting, error
            const result = await this.targetDb.automationTriggers.bulkCreate(triggersToWrite);
            if (result) Logger.info(`Migrated automation triggers table`);
         }

         Logger.info(`Migrated automation table & automation related tables`);
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating automation types');
      }
   }
}
