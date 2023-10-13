import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { literal, Op } from 'sequelize';
import { LEADS_COUNT_BY_STATUS_ID_QUERY } from '../../utils';

export async function GET(request: NextRequest) {
   const leadSourceTypes = await db.statusTypes.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
   });
   return NextResponse.json(leadSourceTypes, { status: 200 });
}

export async function POST(request: NextRequest) {
   const body = await request.json();

   const bucketStatusIds = await db.bucketStatuses.findAll({
      attributes: ['statusId'],
      raw: true, // Return only plain objects
   });

   const bucketStatusArr = bucketStatusIds.map((item: any) => item.statusId);

   const notInBucketSources = {
      id: {
         [Op.notIn]: bucketStatusArr,
      },
      typeId: body.typeId, // As per your original code
   };

   const statusTypes = await db.statuses.findAll({
      attributes: ['id', 'name', [literal(LEADS_COUNT_BY_STATUS_ID_QUERY), 'leadCount']],
      where: notInBucketSources,
      order: [['name', 'ASC']],
   });

   // Send the response with pagination metadata
   return NextResponse.json(statusTypes, { status: 200 });
}
