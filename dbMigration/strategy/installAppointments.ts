import { LumError } from '../../utilities/models/LumError';
import Logger from '../logger';
import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import { Op } from 'sequelize';
import { UUID } from 'crypto';

type TargetInstallAppointment = {
   id: UUID;
   orderId: UUID;
   productId: UUID;
   teamId: UUID;
   createdById: UUID;
   appointmentTypeId: UUID;
   startTime: Date;
   endTime: Date;
   oldId: number;
};

type OriginTeamAppointment = {
   id: number;
   team: number;
   start_time: Date;
   end_time: Date;
   order: number;
   created_at: Date;
   scheduled_by: number;
   appointment_type: number;
};

export class InstallAppointments extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         const defaultAppointmentStatusesTypes = [{ name: 'Job' }, { name: 'FYI' }];
         await this.createInstallAppointmentTypes(defaultAppointmentStatusesTypes);

         let installApptsMigrated = false;
         while (!installApptsMigrated) {
            const result = await this.migrateTableData('team_appointments', 'id', async (currRow: any) => {
               const team = await this.targetDb.teams.findOne({ where: { oldId: currRow.team } });
               const order = await this.targetDb.orders.findOne({ where: { oldId: currRow.order } });
               const createdBy = await this.targetDb.users.findOne({ where: { oldId: currRow.scheduled_by } });

               const appointmentType = await this.targetDb.appointmentTypesLookup.findOne({
                  where: { name: currRow.appointment_type },
               });

               return await this.targetDb.installAppointments.create({
                  orderId: order?.id || null,
                  teamId: team?.id || null,
                  createdById: createdBy?.id || null,
                  appointmentTypeId: appointmentType?.id,
                  startTime: currRow.start_time,
                  endTime: currRow.end_time,
                  oldId: currRow.id,
               });
            });
            if (result) Logger.info(`Migrated install_appointments table`);
            const allMigrated = await this.getMigratedStatus('team_appointments');
            if (allMigrated) installApptsMigrated = true;
         }
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating install appointments');
      }
   }

   private async createInstallAppointmentTypes(defaultAppointmentTypes: any[]) {
      const inDb = await this.targetDb.appointmentTypesLookup.findOne({
         where: {
            name: {
               [Op.or]: ['Job', 'FYI'],
            },
         },
      });
      if (inDb) return Logger.info('Appointment statuses lookup types already in db...');

      const result = await this.targetDb.appointmentTypesLookup.bulkCreate(defaultAppointmentTypes);

      if (result) Logger.info(`Updated Appointment statuses lookup table with types`);
   }
}
