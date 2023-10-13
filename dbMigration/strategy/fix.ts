import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';
import { RemoveRolesOnProductCoordinatorsDuplicatesStrategy } from './fixStrategies/removeRolesOnProductCoordinatorsDuplicates';
import { SetDefaultStagesOnProductsRequiredToFalse } from './fixStrategies/setDefaultProductStageRequiredToFalse';
import { AddMoreConfiguredListsStrategy } from './fixStrategies/addMoreConfiguredLists';
import { ChangeUserIdToCreatedByIdInAttachmentsStrategy } from './fixStrategies/changeUserIdtoCreatedByIdInAttachments';
import { AddFieldOnProductIdToFieldOnOrderRowsStrategy } from './fixStrategies/addFieldOnProductIdToFieldOnOrderRows';
import { AddDefaultWorkOrderStageStrategy } from './fixStrategies/addDefaultWorkOrderStage';
import { AddAttachmentTypesToAttachmentsStrategy } from './fixStrategies/addAttachmentTypeToAttachments';

export class FixStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         // pull in all fix strategies
         const removeRolesOnProductCoordinatorsDuplicatesStrategy =
            new RemoveRolesOnProductCoordinatorsDuplicatesStrategy();
         const addFieldOnProductIdToFieldOnOrderRowsStrategy = new AddFieldOnProductIdToFieldOnOrderRowsStrategy();
         const setDefaultStagesOnProductsRequiredToFalse = new SetDefaultStagesOnProductsRequiredToFalse();
         const addMoreConfiguredListsStrategy = new AddMoreConfiguredListsStrategy();
         const changeUserIdToCreatedByIdInAttachmentsStrategy = new ChangeUserIdToCreatedByIdInAttachmentsStrategy();
         const addDefaultWorkOrderStageStrategy = new AddDefaultWorkOrderStageStrategy();
         const addAttachmentTypesToAttachmentsStrategy = new AddAttachmentTypesToAttachmentsStrategy();

         // run migrations in order
         Logger.info('fix strategy: productCoordinators');
         await removeRolesOnProductCoordinatorsDuplicatesStrategy.run();
         Logger.info('fix strategy: addFieldOnProductIdToFieldOnOrderRowsStrategy');
         await addFieldOnProductIdToFieldOnOrderRowsStrategy.run();
         Logger.info('fix strategy: addDefaultWorkOrderStageStrategy');
         await addDefaultWorkOrderStageStrategy.run();
         Logger.info('fix strategy: setDefaultStagesOnProductsRequiredToFalse');
         await setDefaultStagesOnProductsRequiredToFalse.run();
         Logger.info('fix strategy: addMoreConfiguredListsStrategy');
         await addMoreConfiguredListsStrategy.run();
         Logger.info('fix strategy: changeUserIdToCreatedByIdInAttachmentsStrategy');
         await changeUserIdToCreatedByIdInAttachmentsStrategy.run();
         Logger.info('fix strategy: addAttachmentTypesToAttachmentsStrategy');
         await addAttachmentTypesToAttachmentsStrategy.run();
         
      } catch (error) {
         console.log('error', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating appointments');
      }
   }
}
