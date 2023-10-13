import 'dotenv/config';

import { MigrationStrategy } from './strategy/contracts/migrationContract';
import { AppointmentsStrategy } from './strategy/appointments';
import { LeadsStrategy } from './strategy/leads';
import { LeadSourcesStrategy } from './strategy/leadSources';
import { ProductsStrategy } from './strategy/products';
import { StatusesStrategy } from './strategy/statuses';
import { UsersStrategy } from './strategy/users';
import { OfficesStrategy } from './strategy/offices';
import { RolesStrategy } from './strategy/roles';
import { TeamsStrategy } from './strategy/teams';
import { KeyTypesLookupStrategy } from './strategy/keyTypesLookup';
import { ConfiguredListsLookupStrategy } from './strategy/configuredListsLookup';
import { FinanciersLookupStrategy } from './strategy/financiersLookup';
import { ProposalOptionsStrategy } from './strategy/proposalOptions';
import { UtilityCompaniesStrategy } from './strategy/utilityCompaniesLookup';
import { ProposalQueueStrategy } from './strategy/proposalQueue';
import { OrdersStrategy } from './strategy/orders';
import { AllStrategy } from './strategy/all';
import { AttachmentsStrategy } from './strategy/attachments';
import Logger from './logger';
import { FixStrategy } from './strategy/fix';
import { StageHistoryStrategy } from './strategy/stageHistory';
import { AutomationTypesStrategy } from './strategy/automationTypes';
import { BucketTypesStrategy } from './strategy/bucketTypes';
import { StatesLookupStrategy } from './strategy/statesLookup';
import { CallLogsStrategy } from './strategy/callLogs';
import { SmsLogsStrategy } from './strategy/smsLogs';
import { NotesStrategy } from './strategy/notes';
import { InstallAppointments } from './strategy/installAppointments';
import { AddFieldOnProductIdToFieldOnOrderRowsStrategy } from './strategy/fixStrategies/addFieldOnProductIdToFieldOnOrderRows';

const migrationStrategies: Record<string, MigrationStrategy> = {
   all: new AllStrategy(),
   automationTypes: new AutomationTypesStrategy(),
   bucketTypes: new BucketTypesStrategy(),
   configuredListsLookup: new ConfiguredListsLookupStrategy(),
   financiersLookup: new FinanciersLookupStrategy(),
   leads: new LeadsStrategy(),
   notes: new NotesStrategy(),
   leadSources: new LeadSourcesStrategy(),
   roles: new RolesStrategy(),
   stageHistory: new StageHistoryStrategy(),
   statesLookup: new StatesLookupStrategy(),
   utilityCompaniesLookup: new UtilityCompaniesStrategy(),
   statuses: new StatusesStrategy(),
   offices: new OfficesStrategy(),
   teams: new TeamsStrategy(),
   users: new UsersStrategy(),
   products: new ProductsStrategy(),
   proposalOptions: new ProposalOptionsStrategy(),
   orders: new OrdersStrategy(),
   appointments: new AppointmentsStrategy(),
   attachments: new AttachmentsStrategy(),
   keyTypesLookup: new KeyTypesLookupStrategy(),
   proposalQueue: new ProposalQueueStrategy(),
   fix: new FixStrategy(),
   callLogs: new CallLogsStrategy(),
   smsLogs: new SmsLogsStrategy(),
   installAppointments: new InstallAppointments(),

   // this is for matt pickett to run!
   addFieldOnProductIdToFieldOnOrderRowsStrategy: new AddFieldOnProductIdToFieldOnOrderRowsStrategy(),
};

async function runMigration(migrationName: string): Promise<void> {
   try {
      await runStrategy(migrationName);
   } catch (err: any) {
      Logger.error(`Code 500: ${err?.errorMessage}`);
   }
}

async function runStrategy(migrationName: string) {
   const migration = migrationStrategies[migrationName];

   if (!migration) {
      Logger.error(`Invalid migration name: ${migrationName}`);
      process.exit(1);
   }

   await migration.run();
   Logger.info(`Migration completed successfully: ${migrationName}`);
   process.exit(0);
}

async function getMigrationStatus(): Promise<void> {}
if (process.argv.includes('--status') || process.argv.includes('-s')) {
   getMigrationStatus();
}

runMigration(process.argv[2]);
