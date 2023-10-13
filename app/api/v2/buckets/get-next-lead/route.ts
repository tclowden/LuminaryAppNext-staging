import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const bucketId: string = body.bucketId;
      const userId: string = body.userId;

      if (!bucketId || !userId) {
         throw new LumError(400, 'BucketId and UserId are required');
      }

      // Check if the user is assigned to the bucket
      await isUserAssignedToBucket(bucketId, userId);

      // check orgSettings for grab attempts and pipe limit
      await runGetNextLeadChecks(userId, bucketId);

      // Get the bucket we're working with
      const bucket = await getBucketById(bucketId);

      // orderCriteria is a stringified array of objects
      const orderCriteria = await getOrderCriteria(bucket.orderCriteria);

      // builds the where condition for the query
      const whereCondition = await getWhereCondition(bucket);

      // Returns the lead
      const lead: any = await getNextLead(whereCondition, orderCriteria);

      // log the attempt
      await logGetNextLeadAttempt(userId, bucketId, lead);

      return NextResponse.json(lead, { status: 200 });
   } catch (err) {
      console.log('err: ', err);
      return NextResponse.json(err, { status: 500 });
   }
}

const logGetNextLeadAttempt = async (userId: string, bucketId: string, lead: any) => {
   await db.getNextLeadHistory.create({
      userId: userId,
      bucketId: bucketId,
      leadId: lead.id,
      leadJson: JSON.stringify(lead),
   });
};

const runGetNextLeadChecks = async (userId: string, bucketId: string) => {
   const pipeAndGrabLimit = await db.orgSettings.findOne({
      raw: true,
      attributes: ['dailyBucketGrabsLimit', 'leadsAllowedInPipe'],
   });

   // search for leads in pipe
   const leadsInPipe = await db.leads.count({
      where: { ownerId: userId },
   });

   // search getNextLeadAttempts for grabs today
   const grabsToday = await db.getNextLeadHistory.count({
      where: {
         userId: userId,
         bucketId: bucketId,
         createdAt: {
            [db.Sequelize.Op.gte]: new Date().setHours(0, 0, 0, 0),
         },
      },
   });

   if (leadsInPipe >= pipeAndGrabLimit.leadsAllowedInPipe) {
      throw new LumError(403, 'You have reached your pipe limit');
   }

   if (grabsToday >= pipeAndGrabLimit.dailyBucketGrabsLimit) {
      throw new LumError(403, 'You have reached your daily grab limit');
   }
   return true;
};

const isUserAssignedToBucket = async (bucketId: string, userId: string) => {
   const bucketUser = await db.bucketUsers.findOne({
      where: {
         bucketId: bucketId,
         userId: userId,
      },
   });

   if (!bucketUser) {
      throw new LumError(403, 'User is not assigned to bucket');
   }

   return bucketUser;
};

const getBucketById = async (bucketId: string) => {
   const bucket = await db.buckets.findByPk(bucketId, {
      include: [
         {
            model: db.bucketUsers,
         },
         {
            model: db.bucketLeadSources,
         },
         {
            model: db.bucketStatuses,
         },
      ],
   });

   if (!bucket || !bucket.isActive) {
      throw new LumError(404, 'Bucket is not active or does not exist');
   }

   return bucket;
};

const getNextLead = async (whereCondition: any, orderCriteria: any) => {
   const transaction = await db.sequelize.transaction();

   try {
      const lead = await db.leads.findOne({
         where: whereCondition,
         attributes: ['id', 'firstName', 'lastName', 'phoneNumber'],
         include: [
            {
               model: db.statuses,
               as: 'status',
               required: true,
            },
            {
               model: db.leadSources,
               as: 'leadSource',
               required: true,
            },
         ],
         order: orderCriteria,
         lock: true,
         transaction: transaction,
      });

      if (lead) {
         // Set the isAvailableInQueue to false and perhaps set the ownerId
         lead.isAvailableInQueue = false;
         await lead.save({ transaction: transaction });
      } else {
         throw new LumError(404, 'No leads found');
      }

      await transaction.commit();
      return lead;
   } catch (err) {
      await transaction.rollback();
      throw err;
   }
};

// getWhereCondition will get the associated leadSources and statuses from the bucket and add the ids to the where condition
const getWhereCondition = (bucket: any) => {
   const leadSourceIds = bucket.bucketLeadSources.map((source: any) => source.leadSourceId);
   const statusIds = bucket.bucketStatuses.map((status: any) => status.statusId);

   // a lead is available in the queue if it has no owner and isAvailableInQueue is true
   const whereCondition: any = {
      [db.Sequelize.Op.and]: {
         ownerId: null,
         isAvailableInQueue: true,
      },
   };

   // push the leadSourceIds to an or condition
   if (bucket.bucketLeadSources) {
      whereCondition[db.Sequelize.Op.or] = {
         leadSourceId: leadSourceIds,
      };
   }

   // push teh statusIds to an or condition and keep leadSourceIds
   if (bucket.bucketStatuses) {
      whereCondition[db.Sequelize.Op.or] = {
         ...whereCondition[db.Sequelize.Op.or],
         statusId: statusIds,
      };
   }

   return whereCondition;
};

const getOrderCriteria = async (orderCriteria: any) => {
   if (typeof orderCriteria === 'string') {
      orderCriteria = JSON.parse(orderCriteria);
   }
   const parsedOrderCriteria = orderCriteria.sort((a: any, b: any) => a.displayOrder - b.displayOrder);

   // Initialize order array with ordering by createdAt DESC.
   const order: any = [];

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
