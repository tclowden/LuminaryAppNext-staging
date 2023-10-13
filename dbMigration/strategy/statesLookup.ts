import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class StatesLookupStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         // const result
         const alreadyInDb = await this.targetDb.statesLookup.findOne({});
         if (alreadyInDb) {
            Logger.info(`states already exists in db...`);
            return;
         }

         const defaultStates = [
            { name: 'Alabama', abbreviation: 'AL', supported: false },
            { name: 'Alaska', abbreviation: 'AK', supported: false },
            { name: 'Arizona', abbreviation: 'AZ', supported: false },
            { name: 'Arkansas', abbreviation: 'AR', supported: true },
            { name: 'California', abbreviation: 'CA', supported: false },
            { name: 'Colorado', abbreviation: 'CO', supported: false },
            { name: 'Connecticut', abbreviation: 'CT', supported: false },
            { name: 'Delaware', abbreviation: 'DE', supported: false },
            { name: 'Florida', abbreviation: 'FL', supported: true },
            { name: 'Georgia', abbreviation: 'GA', supported: false },
            { name: 'Hawaii', abbreviation: 'HI', supported: false },
            { name: 'Idaho', abbreviation: 'ID', supported: false },
            { name: 'Illinois', abbreviation: 'IL', supported: false },
            { name: 'Indiana', abbreviation: 'IN', supported: false },
            { name: 'Iowa', abbreviation: 'IA', supported: false },
            { name: 'Kansas', abbreviation: 'KS', supported: true },
            { name: 'Kentucky', abbreviation: 'KY', supported: false },
            { name: 'Louisiana', abbreviation: 'LA', supported: false },
            { name: 'Maine', abbreviation: 'ME', supported: false },
            { name: 'Maryland', abbreviation: 'MD', supported: false },
            { name: 'Massachusetts', abbreviation: 'MA', supported: false },
            { name: 'Michigan', abbreviation: 'MI', supported: false },
            { name: 'Minnesota', abbreviation: 'MN', supported: false },
            { name: 'Mississippi', abbreviation: 'MS', supported: true },
            { name: 'Missouri', abbreviation: 'MO', supported: true },
            { name: 'Montana', abbreviation: 'MT', supported: false },
            { name: 'Nebraska', abbreviation: 'NE', supported: false },
            { name: 'Nevada', abbreviation: 'NV', supported: false },
            { name: 'New Hampshire', abbreviation: 'NH', supported: false },
            { name: 'New Jersey', abbreviation: 'NJ', supported: false },
            { name: 'New Mexico', abbreviation: 'NM', supported: false },
            { name: 'New York', abbreviation: 'NY', supported: false },
            { name: 'North Carolina', abbreviation: 'NC', supported: false },
            { name: 'North Dakota', abbreviation: 'ND', supported: false },
            { name: 'Ohio', abbreviation: 'OH', supported: false },
            { name: 'Oklahoma', abbreviation: 'OK', supported: true },
            { name: 'Oregon', abbreviation: 'OR', supported: false },
            { name: 'Pennsylvania', abbreviation: 'PA', supported: false },
            { name: 'Rhode Island', abbreviation: 'RI', supported: false },
            { name: 'South Carolina', abbreviation: 'SC', supported: false },
            { name: 'South Dakota', abbreviation: 'SD', supported: false },
            { name: 'Tennessee', abbreviation: 'TN', supported: true },
            { name: 'Texas', abbreviation: 'TX', supported: true },
            { name: 'Utah', abbreviation: 'UT', supported: false },
            { name: 'Vermont', abbreviation: 'VT', supported: false },
            { name: 'Virginia', abbreviation: 'VA', supported: false },
            { name: 'Washington', abbreviation: 'WA', supported: false },
            { name: 'West Virginia', abbreviation: 'WV', supported: false },
            { name: 'Wisconsin', abbreviation: 'WI', supported: false },
            { name: 'Wyoming', abbreviation: 'WY', supported: false },
         ];
         const result = await this.targetDb.statesLookup.bulkCreate(defaultStates);

         if (result) Logger.info(`Migrated states table`);
      } catch (error: any) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, error?.errorMessage || 'Error while migrating states');
      }
   }
}
