import 'dotenv/config';
import originDb from './originDbConnect';
import Logger from './logger';
import { LumError } from '../utilities/models/LumError';

async function setMigratedStatus(value: 0 | 1): Promise<void> {
   try {
      const allTables = await new Promise((resolve, reject) => {
         originDb.query(
            `SELECT table_name FROM information_schema.columns WHERE column_name = 'migrated'`,
            [],
            function (error: any, results: any, fields: any) {
               console.log('ERR: ', error);
               if (error) reject(error);
               resolve(results);
            }
         );
      }).then((res) => JSON.parse(JSON.stringify(res)));

      if (typeof value === undefined) {
         Logger.error(`Code 500: must set a migrated value (0 or 1)`);
         return;
      }
      for (const table of allTables) {
         console.log('table....', table);
         await new Promise((resolve, reject) => {
            originDb.query(
               `UPDATE ${table?.table_name} SET migrated = ?`,
               [value],
               function (error: any, results: any, fields: any) {
                  console.log('ERR: ', error);
                  if (error) reject(error);
                  resolve(results);
               }
            );
         });
      }

      console.log('\n');
      Logger.info(`Updated 'migrated' column to every table complete.`);
      process.exit();
   } catch (err) {
      Logger.error(`Code 500: ${err}`);
      throw new LumError(500, `Error...`);
   }
}

// value must be 0 or 1
if (process.argv.includes('--value')) {
   const flagIndex = process.argv.findIndex((arg: string) => arg === '--value');
   const value = process.argv[flagIndex + 1];
   if (typeof value !== undefined || value === '0' || value === '1') {
      setMigratedStatus(parseInt(value) as 0 | 1);
   }
}
