import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class TeamsStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         await this.migrateTeamTypes();
         const teamTypes = await this.targetDb.teamTypesLookup
            .findAll({})
            .then((res: any) => JSON.parse(JSON.stringify(res)));
         const officeTeamType = teamTypes.find((tt: any) => tt.name === 'Office');
         const hvacTeamType = teamTypes.find((tt: any) => tt.name === 'HVAC');
         const salesTeamType = teamTypes.find((tt: any) => tt.name === 'Sales');
         const operationsTeamType = teamTypes.find((tt: any) => tt.name === 'Operations');

         let teamsMigrated = false;
         while (!teamsMigrated) {
            const result = await this.migrateTableData('teams', 'id', async (team) => {
               let currTeamType = null;
               switch (team?.team_type?.trim()) {
                  case 'Office':
                     currTeamType = officeTeamType;
                     break;
                  case 'HVAC':
                     currTeamType = hvacTeamType;
                     break;
                  case 'Sales':
                     currTeamType = salesTeamType;
                     break;
                  case 'Operations':
                     currTeamType = operationsTeamType;
                     break;
                  default:
                     break;
               }

               if (!currTeamType || !teamTypes?.length) throw new LumError(400, `Can't find team type by name...`);
               return await this.targetDb.teams.create({
                  oldId: team.id,
                  name: team?.name,
                  teamTypeId: currTeamType?.id,
               });
            });
            if (result) Logger.info(`Migrated teams table`);

            const allMigrated = await this.getMigratedStatus('teams');
            if (allMigrated) teamsMigrated = true;
         }
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating teams');
      }
   }

   private async migrateTeamTypes() {
      const inDb = await this.targetDb.teamTypesLookup.findOne();
      if (inDb) return Logger.info('Team types already in db...');

      const defaultTeamTypes = [{ name: 'HVAC' }, { name: 'Sales' }, { name: 'Operations' }, { name: 'Office' }];
      const result = await this.targetDb.teamTypesLookup.bulkCreate(defaultTeamTypes);

      if (result) Logger.info(`Migrated team types table`);
   }
}
