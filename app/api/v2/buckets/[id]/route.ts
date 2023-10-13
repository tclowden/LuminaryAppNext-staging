import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';

// Return a bucket
export async function GET(request: NextRequest, params: { params: { id: string } }) {
   let singleBucket = await db.buckets
      .findByPk(params.params.id, {
         include: [
            {
               model: db.bucketUsers,
               include: [{ model: db.users }],
            },
            {
               model: db.bucketLeadSources,
               include: [{ model: db.leadSources }],
            },
            {
               model: db.bucketStatuses,
               include: [{ model: db.statuses }],
            },
            {
               model: db.bucketTypes,
            },
            {
               model: db.leads,
               include: [
                  {
                     model: db.statuses,
                     as: 'status',
                  },
                  {
                     model: db.leadSources,
                  },
               ],
               limit: 10,
            },
         ],
      })
      .catch((err: any) => {
         console.log(err);
      });

   const leadsCount = await db.leads.count({
      where: {
         bucketId: params.params.id,
      },
   });

   let transformedBucket;
   if (singleBucket !== null) {
      transformedBucket = JSON.parse(JSON.stringify(singleBucket));

      // Set numLeads
      transformedBucket.numLeads = leadsCount;

      // Transform bucketUsers
      if (Array.isArray(transformedBucket.bucketUsers)) {
         transformedBucket.bucketUsers = transformedBucket.bucketUsers.map((bucketUser: any) => {
            return {
               ...bucketUser.user,
               selected: true,
            };
         });
      }

      // Transform Lead sources
      if (Array.isArray(transformedBucket.bucketLeadSources)) {
         transformedBucket.bucketLeadSources = transformedBucket.bucketLeadSources.map((bSource: any) => {
            return {
               ...bSource.leadSource,
               selected: true,
            };
         });
      }

      // Transform Lead sources
      if (Array.isArray(transformedBucket.bucketStatuses)) {
         transformedBucket.bucketStatuses = transformedBucket.bucketStatuses.map((bStatus: any) => {
            return {
               ...bStatus.status,
               selected: true,
            };
         });
      }

      transformedBucket.orderCriteria = JSON.parse(transformedBucket.orderCriteria);
   }

   return NextResponse.json(transformedBucket, { status: 200 });
}

export async function DELETE(request: NextRequest, params: { params: { id: string } }) {
   try {
      const bucketId = params.params.id;

      await db.bucketUsers.destroy({
         where: {
            bucketId: bucketId,
         },
      });

      await db.bucketLeadSources.destroy({
         where: {
            bucketId: bucketId,
         },
      });

      await db.bucketStatuses.destroy({
         where: {
            bucketId: bucketId,
         },
      });
      await db.buckets.destroy({
         where: {
            id: bucketId,
         },
      });
   } catch (err: any) {
      console.log(err);
   }
   return NextResponse.json({ status: 200 });
}

// Toggle active bucket
export async function POST(request: NextRequest, params: { params: { id: string } }) {
   const body = await request.json();

   await db.buckets
      .update(
         {
            isActive: body.isActive,
         },
         {
            where: {
               id: body.id,
            },
         }
      )
      .catch((err: any) => {
         console.log(err);
      });

   return NextResponse.json({ success: true }, { status: 200 });
}

// Update a bucket
export async function PUT(request: NextRequest, params: { params: { id: string } }) {
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

   // Validation
   if (
      !bucketUsers ||
      !bucketSources ||
      !bucketStatuses ||
      !bucketType ||
      !bucketName ||
      isDefaultBucket === undefined ||
      isActive === undefined
   ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
   }

   const t = await db.sequelize.transaction();

   try {
      const bucketId = params.params.id;

      await updateBucketInfo(bucketId, bucketName, bucketType[0].id, isDefaultBucket, isActive, orderCriteria, t);
      await handleBucketUsers(bucketId, bucketUsers, t);
      await handleBucketLeadSources(bucketId, bucketSources, t);
      await handleBucketStatuses(bucketId, bucketStatuses, t);

      await t.commit();
      return NextResponse.json({ status: 200 });
   } catch (err: any) {
      await t.rollback();
      console.error(err);
      return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
   }
}

async function updateBucketInfo(
   bucketId: string,
   bucketName: string,
   bucketTypeId: string,
   isDefaultBucket: boolean,
   isActive: boolean,
   orderCriteria: any,
   transaction: any
) {
   return await db.buckets.update(
      {
         name: bucketName,
         bucketTypeId,
         isDefaultBucket,
         orderCriteria: JSON.stringify(orderCriteria),
         isActive,
      },
      {
         where: { id: bucketId },
         transaction,
      }
   );
}

async function handleBucketUsers(bucketId: string, bucketUsers: string[], transaction: any) {
   await db.bucketUsers.destroy({ where: { bucketId }, transaction });
   return await Promise.all(bucketUsers.map((userId) => db.bucketUsers.create({ bucketId, userId }, { transaction })));
}

async function handleBucketLeadSources(bucketId: string, bucketSources: string[], transaction: any) {
   await db.bucketLeadSources.destroy({ where: { bucketId }, transaction });
   return await Promise.all(
      bucketSources.map((sourceId) =>
         db.bucketLeadSources.create({ bucketId, leadSourceId: sourceId }, { transaction })
      )
   );
}

async function handleBucketStatuses(bucketId: string, bucketStatuses: string[], transaction: any) {
   await db.bucketStatuses.destroy({ where: { bucketId }, transaction });
   return await Promise.all(
      bucketStatuses.map((statusId) => db.bucketStatuses.create({ bucketId, statusId }, { transaction }))
   );
}
