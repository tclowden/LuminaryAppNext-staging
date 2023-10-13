import { BaseMigration } from '../base';
import { MigrationStrategy } from '../contracts/migrationContract';
import Logger from '../../logger';
import db from '../../../sequelize/models';
import { LumError } from '../../../utilities/models/LumError';
import { deepCopy } from '../../../utilities/helpers';

export class RemoveRolesOnProductCoordinatorsDuplicatesStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         // there are a bunch of roleOnProductCoordinators rows... destory any duplicates

         // loop through all the rolesOnProductCoordintors and see if there are any duplicates roleIds with productCoordinatorIds...
         const rolesOnProductCoordintors = await db.rolesOnProductCoordinators.findAll({}).then(deepCopy);
         const duplicates: Array<any> = [];
         const helperMap: any = {};

         rolesOnProductCoordintors?.forEach((roleOnProd: any) => {
            const key = roleOnProd?.roleId + ' | ' + roleOnProd?.productCoordinatorId;
            if (helperMap[key]) {
               helperMap[key]++;
               duplicates.push(roleOnProd);
            } else {
               helperMap[key] = 1;
            }
         });

         if (!!duplicates?.length) {
            // destory rows
            for (const roleOnProd of duplicates) {
               await db.rolesOnProductCoordinators.destroy({ where: { id: roleOnProd?.id } });
            }
         }

         Logger.info(`Successfully removed rolesOnProductCoordinators duplicates.`);
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while migrating call logs');
      }
   }
}
