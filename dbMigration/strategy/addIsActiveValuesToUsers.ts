import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class AddIsActiveValuesToUsers extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {

         let usersMigrated = false;
         while (!usersMigrated) {
            const results = await this.migrateTableData('users', 'user_id', async (currRow: any) => {
               const user = await this.targetDb.users.findOne({ where: { oldId: currRow?.manual_user_id } });
                
               if(currRow.roleId === '2' ) {

                   await this.targetDb.users.update({
                      isActive: false,
                      deletedAt: new Date()
                   });
               }
            });
            if (results) Logger.info(`Migrated users table`);

            const allMigrated = await this.getMigratedStatus('users');
            if (allMigrated) usersMigrated = true;
         }
        }catch(err) {
            console.log(err)
         }
        }
}
