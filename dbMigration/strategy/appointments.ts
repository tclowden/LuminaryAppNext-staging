import { LumError } from '../../utilities/models/LumError';
import Logger from '../logger';
import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import { Op } from 'sequelize';

export class AppointmentsStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         await this.migrateAppointmentStatusesLookup();
         const appointmentTypes = await this.targetDb.appointmentTypesLookup
            .findAll({})
            .then((res: any) => JSON.parse(JSON.stringify(res)));

         let appointmentsMigrated = false;
         while (!appointmentsMigrated) {
            const result = await this.migrateTableData('appointments', 'appointment_id', async (currRow: any) => {
               const assignedRep = await this.targetDb.users.findOne({ where: { oldId: currRow?.creator } });
               const lead = await this.targetDb.leads.findOne({
                  where: {
                     [Op.or]: [{ oldId: currRow.lead }, { otherOldIds: { [Op.contains]: [currRow.lead] } }],
                  },
               });
               const apptTime = this.isProperDate(currRow?.appointment_time)
                  ? currRow?.appointment_time
                  : currRow?.appointment_created_at;
               // const assignedRep = await this.targetDb.users.findOne({ where: { oldId: currRow?.qa_owner } });

               let appointmentType = null;
               switch (currRow?.status) {
                  case 3:
                     appointmentType = appointmentTypes.find((at: any) => at?.name === 'User Scheduled');
                     break;
                  case 80:
                     appointmentType = appointmentTypes.find((at: any) => at?.name === 'Lead Scheduled');
                     break;
                  default:
                     appointmentType = appointmentTypes.find((at: any) => at?.name === 'User Scheduled');
                     break;
               }
               return await this.targetDb.appointments.create({
                  oldId: currRow.appointment_id,
                  appointmentTime: apptTime,
                  kept: currRow?.kept === 1 ? true : false,
                  leadId: lead?.id,
                  appointmentTypeId: appointmentType?.id,
                  createdById: assignedRep?.id,
                  assignedRepId: assignedRep?.id,
                  createdAt: currRow?.appointment_created_at,
               });
            });
            if (result) Logger.info(`Migrated appointments table`);
            const allMigrated = await this.getMigratedStatus('appointments');
            if (allMigrated) appointmentsMigrated = true;
         }
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating appointments');
      }
   }

   private async migrateAppointmentStatusesLookup() {
      const inDb = await this.targetDb.appointmentTypesLookup.findOne({});
      if (inDb) return Logger.info('Appointment statuses lookup types already in db...');

      const defaultAppointmentStatusesTypes = [{ name: 'User Scheduled' }, { name: 'Lead Scheduled' }];
      const result = await this.targetDb.appointmentTypesLookup.bulkCreate(defaultAppointmentStatusesTypes);

      if (result) Logger.info(`Migrated Appointment statuses lookup table`);
   }
}
