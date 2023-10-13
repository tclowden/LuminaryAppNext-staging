import 'dotenv/config';
import originDb from './originDbConnect';
import Logger from './logger';
import { LumError } from '../utilities/models/LumError';

async function createMigratedCols(): Promise<void> {
   try {
      // fix errors
      // table: call_logs... 'acknowledged_at' default value is incorrect.. change that to CURRENT_TIMESTAMP
      await new Promise((resolve, reject) => {
         originDb.query(
            `ALTER TABLE luminary.call_logs MODIFY COLUMN acknowledged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
            [],
            function (error: any, results: any, fields: any) {
               if (error) reject(error);
               resolve(results);
            }
         );
      });
      // table: proposals_price_settings... 'date_created' default value is incorrect.. change that to CURRENT_TIMESTAMP
      await new Promise((resolve, reject) => {
         originDb.query(
            `ALTER TABLE luminary.proposals_price_settings MODIFY COLUMN date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
            [],
            function (error: any, results: any, fields: any) {
               if (error) reject(error);
               resolve(results);
            }
         );
      });

      const tables = await new Promise((resolve, reject) => {
         originDb.query(
            `SELECT table_name FROM information_schema.tables WHERE table_schema = 'luminary'`,
            [],
            function (error: any, results: any, fields: any) {
               if (error) reject(error);
               resolve(results);
            }
         );
      }).then((res) => JSON.parse(JSON.stringify(res)));

      for (const table of tables) {
         const colExists: Array<any> = await new Promise((resolve, reject) => {
            originDb.query(
               `SELECT NULL FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "${table?.table_name}" AND COLUMN_NAME = "migrated"`,
               [],
               function (error: any, results: any, fields: any) {
                  if (error) reject(error);
                  resolve(results);
               }
            );
         });

         if (!colExists?.length) {
            await new Promise((resolve, reject) => {
               originDb.query(
                  `ALTER TABLE ${table?.table_name} ADD COLUMN migrated TINYINT DEFAULT 0`,
                  [],
                  function (error: any, results: any, fields: any) {
                     if (error) reject(error);
                     resolve(results);
                  }
               );
            });
            Logger.info(`Adding 'migrated' column to table: ${table?.table_name}`);
         } else {
            Logger.info(`The 'migrated' column already exists for table: ${table?.table_name}`);
         }
      }

      console.log('\n');
      Logger.info(`Adding 'migrated' column to every table complete.`);
      process.exit();
   } catch (err) {
      Logger.error(`Code 500: ${err}`);
      throw new LumError(500, `Error getting tables...`);
   }
}
createMigratedCols();
