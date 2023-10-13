import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class RolesStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         const inDb = await this.targetDb.roles.findAll({}).then((res: any) => JSON.parse(JSON.stringify(res)));
         // 4 roles are created in the sequelize migrations...
         // therefore, we want to create the rest of the roles
         if (inDb && inDb?.length > 4) {
            Logger.info(`Roles already migrated`);
            return;
         }

         let rolesMigrated = false;
         while (!rolesMigrated) {
            const result = await this.migrateTableData('roles', 'role_id', async (currRow: any) => {
               // Super Admin & Admin role need the assigned ids...
               let roleId = null;
               if (currRow?.role_name?.toLowerCase() === 'super admin') {
                  roleId = 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6';
               } else if (currRow?.role_name?.toLowerCase() === 'default user') {
                  // instead of default user... let's just use the default role...
                  // update the old_id & description
                  roleId = '1df5344f-99f0-4450-a1ad-7a752e61aab8';
               }

               if (roleId) {
                  // check to see if already exists by name
                  const inDb = await this.targetDb.roles.findOne({
                     where: { name: currRow?.role_name },
                  });

                  if (inDb && inDb?.oldId) {
                     const oldIds = inDb?.otherOldIds;
                     oldIds.push(currRow?.role_id);
                     return await this.targetDb.roles.update({ otherOldIds: oldIds }, { where: { id: inDb?.id } });
                  } else {
                     return await this.targetDb.roles.update(
                        { oldId: currRow?.role_id, description: currRow?.description },
                        { where: { id: roleId } }
                     );
                  }
               } else {
                  return await this.targetDb.roles.create({
                     oldId: currRow.role_id,
                     name: currRow.role_name,
                     description: currRow.description,
                  });
               }
            });

            if (result) Logger.info(`Migrated roles table`);
            const allMigrated = await this.getMigratedStatus('roles');
            if (allMigrated) rolesMigrated = true;
         }
         rolesMigrated = true;

         // doing this in migration file
         // const extraRolesToWrite = [
         //    {
         //       oldId: null,
         //       id: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
         //       name: 'Super Secret Dev',
         //       description: "The most powerful role there is... but it's secret!",
         //    },
         //    {
         //       oldId: null,
         //       id: '02d28634-d018-47c5-a4f6-ee528b44f92d',
         //       name: 'Admin',
         //       description: 'Admin, but not very super...',
         //    },
         // ];
         // await this.targetDb.roles.bulkCreate(extraRolesToWrite);

         // if (result) Logger.info(`Migrated appointments table`);
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating appointments');
      }
   }
}
