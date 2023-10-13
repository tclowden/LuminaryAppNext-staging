import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { literal, Op } from 'sequelize';
import { LEADS_COUNT_BY_SOURCE_ID_QUERY } from '../../utils';

export async function GET(request: NextRequest) {
   const leadSourceTypes = await db.leadSourceTypes.findAll({
      attributes: ['id', 'typeName'],
      order: [['typeName', 'ASC']],
   });
   return NextResponse.json(leadSourceTypes, { status: 200 });
}

export async function POST(request: NextRequest) {
   const body = await request.json();

   // Build a sub-query to select all leadSource IDs from the bucketLeadSources table
   const bucketLeadSourceIds = await db.bucketLeadSources.findAll({
      attributes: ['leadSourceId'],
      raw: true, // Return only plain objects
   });

   // Extract just the leadSource IDs from the query result
   const leadSourceIdArray = bucketLeadSourceIds.map((item: any) => item.leadSourceId);

   // Common where clause for filtering
   const notInBucketLeadSources = {
      id: {
         [Op.notIn]: leadSourceIdArray,
      },
      typeId: body.typeId, // As per your original code
   };

   const leadSourceTypes = await db.leadSources.findAll({
      attributes: ['id', 'name', [literal(LEADS_COUNT_BY_SOURCE_ID_QUERY), 'leadCount']],
      where: notInBucketLeadSources,
      order: [['name', 'ASC']],
   });

   // Send the response with pagination metadata
   return NextResponse.json(leadSourceTypes, { status: 200 });
}
