import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class AppointmentStatusesLookupStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         const alreadyInDb = await this.targetDb.appointmentStatusesLookup.findOne({});
         if (alreadyInDb) throw new LumError(400, `Appointment statuses already exists in db...`);

         const result = await this.targetDb.appointmentStatusesLookup.bulkCreate([
            { name: 'Self Scheduled' },
            { name: 'User Created' },
         ]);

         if (result) Logger.info(`Migrated appointment statuses lookup table`);
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating appointment statuses lookup');
      }
   }
}
