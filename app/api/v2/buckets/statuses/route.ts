import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { literal, Op } from 'sequelize';
import { LEADS_COUNT_BY_STATUS_ID_QUERY } from '../utils';

export async function GET(request: NextRequest) {
   const nameToSearch = request.nextUrl.searchParams.get('name');

   let whereClause = {};

   // Build a sub-query to select all status IDs from the bucketStatuses table
   const bucketStatusIds = await db.bucketStatuses.findAll({
      attributes: ['statusId'],
      raw: true, // Return only plain objects
   });

   // Extract just the status IDs from the query result
   const statusIdArray = bucketStatusIds.map((item: any) => item.statusId);

   // Common where clause for both scenarios
   const notInBucketStatuses = {
      id: {
         [Op.notIn]: statusIdArray,
      },
   };

   if (!!nameToSearch) {
      whereClause = {
         [Op.and]: [
            {
               name: {
                  [Op.iLike]: `%${nameToSearch}%`,
               },
            },
            notInBucketStatuses,
         ],
      };
   } else {
      whereClause = notInBucketStatuses;
   }

   const statuses = await db.statuses.findAll({
      attributes: ['id', 'name', [literal(LEADS_COUNT_BY_STATUS_ID_QUERY), 'leadCount']],
      include: [{ model: db.statusTypes, attributes: ['id', 'name'], required: false }],
      where: whereClause,
      required: false,
      order: [['name', 'ASC']],
   });

   // Send the response with pagination metadata
   return NextResponse.json(
      {
         data: statuses,
      },
      { status: 200 }
   );
}
