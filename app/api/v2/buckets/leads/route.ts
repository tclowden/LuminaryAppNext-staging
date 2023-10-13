import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';

export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
   try {
      const body = await request.json();

      if (!body.bucketId) {
         throw new Error('BucketId is required');
      }

      const orderCriteria = await getOrderCriteria(body.bucketOrderCriteria);

      const whereCondition = await getWhereCondition(body);

      const leadsInBucket = await db.leads.findAndCountAll({
         where: whereCondition,
         raw: true,
         include: [
            {
               model: db.statuses,
               as: 'status',
               required: false,
            },
            {
               model: db.leadSources,
               required: false,
            },
         ],
         limit: 200,
         order: orderCriteria,
      });

      return NextResponse.json(leadsInBucket, { status: 200 });
   } catch (err) {
      console.error(err);
      return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
   }
}

const getOrderCriteria = async (orderCriteria: any) => {
   if (typeof orderCriteria === 'string') {
      orderCriteria = JSON.parse(orderCriteria);
   }

   const parsedOrderCriteria = orderCriteria.sort((a: any, b: any) => a.displayOrder - b.displayOrder);

   // Initialize order array with ordering by createdAt DESC.
   let order: any = [];

   parsedOrderCriteria.forEach((criteria: any, index: number) => {
      if (criteria.leadSourceType) {
         // Using a CASE statement to set the order for the specific ID
         order.push([
            db.Sequelize.literal(`(
                   CASE
                       WHEN "leadSource"."id" = '${criteria.id}' THEN ${index}
                       ELSE ${index + 1}
                   END
               )`),
            'ASC',
         ]);
      } else if (criteria.statusType) {
         // Same logic for the other type of ID
         order.push([
            db.Sequelize.literal(`(
                   CASE
                       WHEN "status"."id" = '${criteria.id}' THEN ${index}
                       ELSE  ${index + 1}
                   END
               )`),
            'ASC',
         ]);
      }
   });

   return order;
};
// getWhereCondition will get the associated leadSources and statuses from the bucket and add the ids to the where condition
const getWhereCondition = async (body: any) => {
   // a lead is available in the queue if it has no owner
   const whereCondition: any = {
      [db.Sequelize.Op.and]: {
         ownerId: null,
      },
   };

   // push the leadSourceIds to an or condition
   if (body.leadSourceIds) {
      whereCondition[db.Sequelize.Op.or] = {
         leadSourceId: body.leadSourceIds,
      };
   }

   // push teh statusIds to an or condition and keep leadSourceIds
   if (body.statusIds) {
      whereCondition[db.Sequelize.Op.or] = {
         ...whereCondition[db.Sequelize.Op.or],
         statusId: body.statusIds,
      };
   }

   return whereCondition;
};
