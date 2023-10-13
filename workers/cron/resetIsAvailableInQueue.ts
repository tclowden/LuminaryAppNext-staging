import { QueryTypes, Sequelize } from 'sequelize';
import 'dotenv/config';

export async function resetIsAvailableInQueue(): Promise<void> {
   try {
      const sequelize: any = new Sequelize({
         dialect: 'postgres',
         host: 'localhost',
         port: 5432,
         username: process.env.DATABASE_USER || 'postgres',
         password: process.env.DATABASE_PASSWORD || 'password',
         database: process.env.DATABASE || 'luminary',
      });

      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');

      const [results] = await sequelize.query(
         'SELECT g."createdAt", l.id as "leadId" FROM "getNextLeadHistory" g JOIN "leads" l ON l.id = g."leadId" WHERE l."isAvailableInQueue" = false LIMIT 200;',
         { raw: true, logging: false }
      );
      if (results && results.length > 0) {
         const leadIds: string[] = results.map((r: any) => r.leadId);

         // Query callLogs where leadId is in leadIds
         const [callLogs] = await sequelize.query(
            'SELECT "leadId", MAX("createdAt") as "lastCall", COUNT(id) as "numCalls", CURRENT_TIMESTAMP - MAX("createdAt") as "timeSinceLastCall" FROM "callLogs" WHERE "direction" = \'outbound\' AND "leadId" IN (:leadIds) GROUP BY "leadId"',
            {
               replacements: { leadIds },
               raw: true,
               logging: false,
            }
         );

         //  {
         //     leadId: '4f4ee621-8ff3-4abd-9cb0-2be366537e6f',
         //     lastCall: 2023-09-21T16:00:23.000Z,
         //     numCalls: '6',
         //     timeSinceLastCall: PostgresInterval {
         //       days: 14,
         //       hours: 13,
         //       minutes: 46,
         //       seconds: 11,
         //       milliseconds: 508.048
         //     }
         //   },

         // push all the leads that have been called in 15 minutes to an array
         const leadsToUpdate: string[] = [];
         for (const callLog of callLogs) {
            if (
               callLog.timeSinceLastCall.days === 0 &&
               callLog.timeSinceLastCall.hours === 0 &&
               callLog.timeSinceLastCall.minutes <= 15 &&
               callLog.numCalls === 1
            ) {
               leadsToUpdate.push(callLog.leadId);
            }

            if (
               callLog.numCalls === 2 &&
               callLog.timeSinceLastCall.days === 0 &&
               callLog.timeSinceLastCall.hours === 0 &&
               callLog.timeSinceLastCall.minutes <= 45
            ) {
               leadsToUpdate.push(callLog.leadId);
            }

            if (
               callLog.numCalls > 3 &&
               callLog.timeSinceLastCall.days === 0 &&
               callLog.timeSinceLastCall.hours === 1 &&
               callLog.timeSinceLastCall.minutes <= 15
            ) {
               leadsToUpdate.push(callLog.leadId);
            }

            if (callLog.numCalls > 4 && callLog.timeSinceLastCall.days > 1) {
               leadsToUpdate.push(callLog.leadId);
            }
         }

         console.log(leadsToUpdate);

         if (leadsToUpdate.length > 0) {
            await sequelize.query('UPDATE "leads" SET "isAvailableInQueue" = true WHERE id IN (:leadsToUpdate)', {
               replacements: { leadsToUpdate },
               raw: true,
               logging: false,
            });
         } else {
            console.log('No leads to update');
         }
      } else {
         console.log('No data found in the first query results');
      }
   } catch (err) {
      console.error('An error occurred:', err);
      process.exit(1);
   }
}
