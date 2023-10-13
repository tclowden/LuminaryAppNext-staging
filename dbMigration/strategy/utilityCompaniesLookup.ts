import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class UtilityCompaniesStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         await this.migrateNetMeteringTypes();

         const netMeteringTypesLookup = await this.targetDb.netMeteringTypesLookup.findAll({});
         const netMeteringTypesMap: Record<string, string> = {
            full_benefit: 'Full Benefit',
            lose_it: 'Lose It',
            none: 'None',
         };
         const statesLookup = await this.targetDb.statesLookup.findAll({});

         let utilCompaniesMigrated = false;
         while (!utilCompaniesMigrated) {
            const result = await this.migrateTableData('proposals_electric_companies', 'id', async (currRow: any) => {
               const state = statesLookup.find((state: Record<string, any>) => state.name === currRow?.state);
               // No state, no service
               if (!state) return;
               const netMeteringType = netMeteringTypesLookup.find(
                  (type: Record<string, any>) => type.name === netMeteringTypesMap[currRow?.net_metering_type]
               );

               await this.targetDb.utilityCompaniesLookup.create({
                  oldId: currRow?.id,
                  name: currRow?.name,
                  specialNotes: currRow?.special_notes,
                  netMeter: currRow?.net_meter,
                  connectionFee: currRow?.connection_fee,
                  additionalCost: currRow?.additional_cost,
                  stateId: state.id,
                  netMeteringTypeId: netMeteringType?.id,
               });
            });
            if (result) Logger.info(`Migrated proposals_electric_companies table`);

            const allMigrated = await this.getMigratedStatus('proposals_electric_companies');
            if (allMigrated) utilCompaniesMigrated = true;
         }
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating utility companies');
      }
   }

   private async migrateNetMeteringTypes() {
      const inDb = await this.targetDb.netMeteringTypesLookup.findOne();
      if (inDb) return Logger.info('Net metering types already in db...');

      const result = await this.targetDb.netMeteringTypesLookup.bulkCreate([
         { name: 'None' },
         { name: 'Full Benefit' },
         { name: 'Lose It' },
      ]);
      if (result) Logger.info(`Migrated field types lookup table`);
   }
}
