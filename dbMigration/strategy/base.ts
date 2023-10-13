import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';
import originDb from '../originDbConnect';
import db from '../../sequelize/models';

export abstract class BaseMigration {
   private BATCH_SIZE = 500;
   // protected targetDb = require('../../sequelize/models');
   protected targetDb = db;

   protected async getOriginData(table: string, batchSize = 500) {
      try {
         return new Promise<any[]>((resolve, reject) => {
            originDb.query(
               `SELECT * 
                  FROM ${process.env.ORIGIN_DATABASE}.${table} 
                  WHERE migrated = 0
                  LIMIT ?`,
               [batchSize],
               function (error: any, results: any, fields: any) {
                  if (error) reject(error);
                  resolve(results);
               }
            );
         }).then((res: any) => JSON.parse(JSON.stringify(res)));
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, `Error getting origin data from table: ${table}`);
      }
   }

   protected async queryDb(inputQuery: string, params: Array<any>) {
      return new Promise<any>((resolve, reject) => {
         originDb.query(inputQuery, params, function (error: any, results: any, fields: any) {
            if (error) reject(error);
            else resolve(results);
         });
      });
   }

   protected async getMigratedStatus(tableName: string) {
      const totalCount = await this.getRowCount(tableName).then((res) => JSON.parse(JSON.stringify(res))[0].count);
      const migratedTotalCount = await this.getRowCount(tableName, true).then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      Logger.info(`Migrated ${migratedTotalCount} from table: ${tableName}`);
      if (totalCount > migratedTotalCount) return false;
      return true;
   }

   protected isProperDate(d: any) {
      return isNaN(Date.parse(d)) ? false : true;
   }

   protected async getMigrationProgress(table: string) {
      try {
         return new Promise<any[]>((resolve, reject) => {
            originDb.query(
               `SELECT
                  SUM(CASE WHEN migrated = 1 THEN 1 ELSE 0 END) AS migrated,
                  SUM(CASE WHEN migrated = 0 THEN 1 ELSE 0 END) AS pending,
                  COUNT(*) AS total
               FROM ${process.env.ORIGIN_DATABASE}.${table}
               LIMIT ? `,
               [this.BATCH_SIZE],
               function (error: any, results: any, fields: any) {
                  if (error) reject(error);
                  resolve(results);
               }
            );
         });
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, `Error getting migration progress from table: ${table}`);
      }
   }

   protected async getRowCount(table: string, countMigratedRowsOnly = false) {
      try {
         return new Promise<any>((resolve, reject) => {
            originDb.query(
               ` SELECT COUNT(*) as count FROM ${process.env.ORIGIN_DATABASE}.${table} ${
                  countMigratedRowsOnly ? 'WHERE migrated = ?' : ''
               }`,
               [countMigratedRowsOnly ? countMigratedRowsOnly : null],
               function (error: any, results: any, fields: any) {
                  if (error) reject(error);
                  resolve(results);
               }
            );
         });
      } catch (err) {
         Logger.error(`Code: 500: ${err}`);
         throw new LumError(400, `Error getting row count from table: ${table}`);
      }
   }

   protected async migrateTableData(
      originTableName: string,
      originTableId: string,
      createAndInsertData: (dataRow: any) => Promise<any>,
      migrateStatusLogging = true
   ) {
      try {
         const migratedIds = [];
         const pendingData = await this.getOriginData(originTableName);
         if (!!pendingData.length) {
            for (const dataRow of pendingData) {
               await createAndInsertData(dataRow);
               migratedIds.push(dataRow[originTableId]);
            }

            await this.setMigratedStatus(originTableName, originTableId, migratedIds, migrateStatusLogging);

            return true;
         } else {
            Logger.info(`No more data to migrate on table: ${originTableName}.`);
         }
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, `Error while migrating table ${originTableName}`);
      }
   }

   protected async setMigratedStatus(table: string, column: string, ids: string[], logging = true) {
      try {
         const placeholders = ids.map(() => '?').join(',');
         return new Promise<any[]>((resolve, reject) => {
            originDb.query(
               `UPDATE ${process.env.ORIGIN_DATABASE}.${table}
                  SET migrated = 1
                  WHERE ${column} IN (${placeholders})`,
               ids,
               function (error: any, results: any, fields: any) {
                  if (error) reject(error);
                  resolve(results);
                  if (logging) Logger.info(`Migrated! Rows affected: ${results?.affectedRows}`);
               }
            );
         });
      } catch (error) {
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, `Error updating row status, table: ${table}`);
      }
   }
}
