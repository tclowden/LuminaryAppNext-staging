import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import { AppointmentsStrategy } from './appointments';
import { BucketTypesStrategy } from './bucketTypes';
import { ConfiguredListsLookupStrategy } from './configuredListsLookup';
import { FinanciersLookupStrategy } from './financiersLookup';
import { LeadsStrategy } from './leads';
import { LeadSourcesStrategy } from './leadSources';
import { OfficesStrategy } from './offices';
import { OrdersStrategy } from './orders';
import { ProductsStrategy } from './products';
import { ProposalOptionsStrategy } from './proposalOptions';
import { ProposalQueueStrategy } from './proposalQueue';
import { RolesStrategy } from './roles';
import { StatesLookupStrategy } from './statesLookup';
import { StatusesStrategy } from './statuses';
import { TeamsStrategy } from './teams';
import { UsersStrategy } from './users';
import { UtilityCompaniesStrategy } from './utilityCompaniesLookup';
import { AttachmentsStrategy } from './attachments';
import { NotesStrategy } from './notes';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';
import { RemoveRolesOnProductCoordinatorsDuplicatesStrategy } from './fixStrategies/removeRolesOnProductCoordinatorsDuplicates';
import { AddFieldOnProductIdToFieldOnOrderRowsStrategy } from './fixStrategies/addFieldOnProductIdToFieldOnOrderRows';
import { AutomationTypesStrategy } from './automationTypes';
import { AddDefaultWorkOrderStageStrategy } from './fixStrategies/addDefaultWorkOrderStage';
import { SetDefaultStagesOnProductsRequiredToFalse } from './fixStrategies/setDefaultProductStageRequiredToFalse';
import { AddMoreConfiguredListsStrategy } from './fixStrategies/addMoreConfiguredLists';
import { ChangeUserIdToCreatedByIdInAttachmentsStrategy } from './fixStrategies/changeUserIdtoCreatedByIdInAttachments';
import { StageHistoryStrategy } from './stageHistory';
import { CallLogsStrategy } from './callLogs';
import { SmsLogsStrategy } from './smsLogs';
import { InstallAppointments } from './installAppointments';

export class AllStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         // pull in all strategies
         // const automationTypes = new AutomationTypesStrategy();
         const appointmentsStrategy = new AppointmentsStrategy();
         const attachmentsStrategy = new AttachmentsStrategy();
         const bucketTypesStrategy = new BucketTypesStrategy();
         const callLogsStrategy = new CallLogsStrategy();
         const configuredListsStrategy = new ConfiguredListsLookupStrategy();
         const financiersLookupStrategy = new FinanciersLookupStrategy();
         const installAppointmentsStrategy = new InstallAppointments();
         const leadsStrategy = new LeadsStrategy();
         const leadSourcesStrategy = new LeadSourcesStrategy();
         const notesStrategy = new NotesStrategy();
         const officesStrategy = new OfficesStrategy();
         const ordersStrategy = new OrdersStrategy();
         const productsStrategy = new ProductsStrategy();
         const proposalOptionsStrategy = new ProposalOptionsStrategy();
         const proposalQueueStrategy = new ProposalQueueStrategy();
         const rolesStrategy = new RolesStrategy();
         const smsLogsStrategy = new SmsLogsStrategy();
         const stageHistoryStrategy = new StageHistoryStrategy();
         const statesLookupStrategy = new StatesLookupStrategy();
         const statusStrategy = new StatusesStrategy();
         const teamsStrategy = new TeamsStrategy();
         const usersStrategy = new UsersStrategy();
         const utilityCompaniesLookupStrategy = new UtilityCompaniesStrategy();

         // pull in all fix strategies
         const removeRolesOnProductCoordinatorsDuplicatesStrategy =
            new RemoveRolesOnProductCoordinatorsDuplicatesStrategy();
         const addFieldOnProductIdToFieldOnOrderRowsStrategy = new AddFieldOnProductIdToFieldOnOrderRowsStrategy();
         const addDefaultWorkOrderStage = new AddDefaultWorkOrderStageStrategy();
         const setDefaultStagesOnProductsRequiredToFalse = new SetDefaultStagesOnProductsRequiredToFalse();
         const addMoreConfiguredListsStrategy = new AddMoreConfiguredListsStrategy();
         // const addStagesOnOrdersStrategy = new AddDefaultWorkOrderStageStrategy();
         const changeUserIdToCreatedByIdInAttachmentsStrategy = new ChangeUserIdToCreatedByIdInAttachmentsStrategy();

         // run migrations in order

         // Logger.info('automationTypesStrategy');
         // await automationTypes.run();
         Logger.info('bucketTypesStrategy');
         await bucketTypesStrategy.run();
         Logger.info('configuredListsStrategy');
         await configuredListsStrategy.run();
         Logger.info('financiersLookupStrategy');
         await financiersLookupStrategy.run();
         Logger.info('statesLookupStrategy');
         await statesLookupStrategy.run();
         Logger.info('utilityCompaniesLookupStrategy');
         await utilityCompaniesLookupStrategy.run();

         Logger.info('statusStrategy');
         await statusStrategy.run();
         Logger.info('leadSourcesStrategy');
         await leadSourcesStrategy.run();
         Logger.info('officesStrategy');
         await officesStrategy.run();
         Logger.info('rolesStrategy');
         await rolesStrategy.run();
         Logger.info('teamsStrategy');
         await teamsStrategy.run();
         Logger.info('usersStrategy');
         await usersStrategy.run();
         Logger.info('leadsStrategy');
         await leadsStrategy.run();

         Logger.info('productsStrategy');
         await productsStrategy.run();
         Logger.info('proposalOptionsStrategy');
         await proposalOptionsStrategy.run();
         // Logger.info('proposalQueueStrategy');
         // await proposalQueueStrategy.run();
         Logger.info('ordersStrategy');
         await ordersStrategy.run();

         Logger.info('appointmentStrategy');
         await appointmentsStrategy.run();
         Logger.info('attachmentsStrategy');
         await attachmentsStrategy.run();
         Logger.info('notesStrategy');
         await notesStrategy.run();
         Logger.info('stageHistoryStrategy');
         await stageHistoryStrategy.run();
         Logger.info('installAppointmentsStrategy');
         await installAppointmentsStrategy.run();

         Logger.info('callLogsStrategy');
         await callLogsStrategy.run();
         Logger.info('smsLogsStrategy');
         await smsLogsStrategy.run();

         Logger.info('---------------------');
         Logger.info('---------------------');
         Logger.info('---------------------');
         Logger.info('---------------------');
         Logger.info('Now moving to migration fixing...');

         Logger.info('fix strategy: productCoordinators');
         await removeRolesOnProductCoordinatorsDuplicatesStrategy.run();
         Logger.info('fix strategy: addFieldOnProductIdToFieldOnOrderRowsStrategy');
         await addFieldOnProductIdToFieldOnOrderRowsStrategy.run();
         Logger.info('fix strategy: addDefaultWorkOrderStage');
         await addDefaultWorkOrderStage.run();
         Logger.info('fix strategy: setDefaultStagesOnProductsRequiredToFalse');
         await setDefaultStagesOnProductsRequiredToFalse.run();
         Logger.info('fix strategy: addMoreConfiguredListsStrategy');
         await addMoreConfiguredListsStrategy.run();
         // Logger.info('fix strategy: addStagesOnOrdersStrategy');
         // await addStagesOnOrdersStrategy.run();
         Logger.info('fix strategy: changeUserIdToCreatedByIdInAttachmentsStrategy');
         await changeUserIdToCreatedByIdInAttachmentsStrategy.run();
      } catch (error) {
         console.log('error', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating appointments');
      }
   }
}
