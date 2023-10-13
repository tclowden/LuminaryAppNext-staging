import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { Op } from 'sequelize';

export async function GET(request: NextRequest) {
   const allBuckets = await db.buckets
      .findAll({
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
      })
      .catch((err: any) => {
         console.log('err: ', err);
      });

   // query each bucket for numLeads, use the leadSources and statuses from the bucket
   const bucketsWithNumLeads = await Promise.all(
      allBuckets.map(async (bucket: any) => {
         const leadsCount = await db.leads.count({
            where: {
               [Op.and]: {
                  ownerId: null,
               },
               [Op.or]: {
                  leadSourceId: bucket.bucketLeadSources.map((source: any) => source.leadSourceId),
                  statusId: bucket.bucketStatuses.map((status: any) => status.statusId),
               },
            },
         });

         return {
            ...bucket.toJSON(),
            leadCount: leadsCount,
         };
      })
   );

   return NextResponse.json(bucketsWithNumLeads, { status: 200 });
}

// Creates a new bucket
export async function POST(request: NextRequest, params: { params: { id: string } }) {
   const body = await request.json();
   const {
      bucketUsers,
      bucketSources,
      bucketStatuses,
      bucketType,
      bucketName,
      isDefaultBucket,
      isActive,
      orderCriteria,
   } = body;

   // start transaction to update tables
   const t = await db.sequelize.transaction();

   // buckets info
   const createdBucket = await db.buckets.create(
      {
         name: bucketName,
         bucketTypeId: bucketType[0].id,
         isDefaultBucket: isDefaultBucket,
         isActive: isActive,
         orderCriteria: JSON.stringify(orderCriteria),
      },
      { transaction: t }
   );

   // Add bucket-users associations
   await Promise.all(
      bucketUsers.map(async (userId: string) => {
         await db.bucketUsers.create(
            {
               bucketId: createdBucket.id,
               userId,
            },
            { transaction: t }
         );
      })
   );

   // Add bucket-leadSources associations
   await Promise.all(
      bucketSources.map(async (sourceId: string) => {
         await db.bucketLeadSources.create(
            {
               bucketId: createdBucket.id,
               leadSourceId: sourceId,
            },
            { transaction: t }
         );
      })
   );

   // Add bucket-statuses associations
   await Promise.all(
      bucketStatuses.map(async (statusId: string) => {
         await db.bucketStatuses.create(
            {
               bucketId: createdBucket.id,
               statusId: statusId,
            },
            { transaction: t }
         );
      })
   );

   await t.commit();

   return NextResponse.json({ status: 200 });
}
