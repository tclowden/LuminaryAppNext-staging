import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class FinanciersLookupStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         let financiersMigrated = false;
         while (!financiersMigrated) {
            const result = await this.migrateTableData('proposals_loan_rates', 'id', async (pendingFinancier) => {
               return await this.targetDb.financiersLookup.create({
                  oldId: pendingFinancier.id,
                  name: pendingFinancier.option_name,
                  specialNotes: pendingFinancier.special_notes,
                  hidden: pendingFinancier.default_hidden || 0,
                  pinned: pendingFinancier.pinned,
                  loanTermInYears: pendingFinancier.term,
                  interestRate: pendingFinancier.rate,
                  dealerFee: pendingFinancier.dealer_fee,
                  paymentFactorOne: pendingFinancier.payment_factor_no_fee,
                  paymentFactorTwo: pendingFinancier.payment_factor_with_fee,
               });
            });
            if (result) Logger.info(`Migrated proposals loan rates tables`);
            const allMigrated = await this.getMigratedStatus('proposals_loan_rates');
            if (allMigrated) financiersMigrated = true;
         }
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating financiers lookup');
      }
   }
}
