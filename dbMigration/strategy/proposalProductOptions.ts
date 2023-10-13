import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class ProposalProductOptionsStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         const inDb = await this.targetDb.proposalProductOptions.findOne({});
         if (inDb) throw new LumError(400, `Proposal Product Options already in db...`);

         let results = [];

         const hvacProduct = await this.targetDb.productsLookup.findOne({ where: { name: 'HVAC' } });
         if (hvacProduct) {
            const defaultHvacProds = [
               { name: 'Platinum 1.5-2 Ton', price: 16161.0, productId: hvacProduct?.id },
               { name: 'Platinum 2.5-3 Ton', price: 17572.0, productId: hvacProduct?.id },
               { name: 'Platinum 3.5-4 Ton', price: 18982.0, productId: hvacProduct?.id },
               { name: 'Platinum 5 Ton', price: 20393.0, productId: hvacProduct?.id },
               { name: 'Platinum Mini Split', price: 6413.0, productId: hvacProduct?.id },
               { name: 'Platinum Mini Package', price: 28217.0, productId: hvacProduct?.id },
               { name: 'Gold 1.5-2 Ton', price: 14237.0, productId: hvacProduct?.id },
               { name: 'Gold 2.5-3 Ton', price: 15263.0, productId: hvacProduct?.id },
               { name: 'Gold 3.5-4 Ton', price: 16033.0, productId: hvacProduct?.id },
               { name: 'Gold 5 Ton', price: 18598.0, productId: hvacProduct?.id },
               { name: 'Silver 1.5-2 Ton', price: 12056.0, productId: hvacProduct?.id },
               { name: 'Silver 2.5-3 Ton', price: 12698.0, productId: hvacProduct?.id },
               { name: 'Silver 3.5-4 Ton', price: 13467.0, productId: hvacProduct?.id },
               { name: 'Silver 5 Ton', price: 14750.0, productId: hvacProduct?.id },
               { name: 'Custom Duct Work', price: 0.0, productId: hvacProduct?.id },
            ];
            const res = await this.targetDb.proposalProductOptions.bulkCreate(defaultHvacProds);
            results.push(res);
         } else {
            console.log('couldnt find hvac product....');
         }

         const batteryProduct = await this.targetDb.productsLookup.findOne({ where: { name: 'Battery' } });
         if (batteryProduct) {
            const defaultBatteryProds = [
               { name: 'Storz 10kw ', price: 22800.0, productId: batteryProduct?.id },
               { name: 'Storz 15kw', price: 28550.0, productId: batteryProduct?.id },
               { name: 'Enphase 10.1kw', price: 22500.0, productId: batteryProduct?.id },
               { name: 'Enphase Storage 6.7kw', price: 9985.0, productId: batteryProduct?.id },
               { name: 'Tesla Powerwall 2', price: 22800.0, productId: batteryProduct?.id },
               { name: 'Storz 5kw', price: 5750.0, productId: batteryProduct?.id },
               { name: 'Generator 24kw', price: 12540.0, productId: batteryProduct?.id },
               { name: 'Enphase 20kw', price: 35125.0, productId: batteryProduct?.id },
               { name: 'Enphase 30kw', price: 47750.0, productId: batteryProduct?.id },
               { name: 'Enphase 40kw', price: 60375.0, productId: batteryProduct?.id },
            ];
            const res = await this.targetDb.proposalProductOptions.bulkCreate(defaultBatteryProds);
            results.push(res);
         } else {
            console.log('couldnt find hvac product....');
         }

         if (results?.length > 1) Logger.info(`Migrated proposal product options table`);
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating field types lookup');
      }
   }
}
