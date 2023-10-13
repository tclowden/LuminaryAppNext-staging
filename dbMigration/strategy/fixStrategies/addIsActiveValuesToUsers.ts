import { BaseMigration } from '../base';
import { MigrationStrategy } from '../contracts/migrationContract';
import Logger from '../../logger';
import db from '../../../sequelize/models';
import { LumError } from '../../../utilities/models/LumError';
import { deepCopy } from '../../../utilities/helpers';
import { Op } from 'sequelize';

export class AddIsActiveValuesToUsers extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
        const allUsers = await this.getOriginData('users');

        const disabledUsers = [];

        for(const user of allUsers) {
            if(user.roleId === '2') {
                disabledUsers.push(user)
            }
        }

        console.log('disabledUsers: ', disabledUsers)

        const foundUsers = await this.targetDb.users.findAll({
            where: {
                id: {
                    [Op.in]: disabledUsers.map((user: any) => user.user_id)
                }
            }
        })

        await this.targetDb.users.destroy({
            where: {
                id: {
                    [Op.in]: foundUsers.map((user: any) => user.id)
                }
            }
        })

         Logger.info(`Successfully updated isActive.`);
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error at active users');
      }
   }
}
