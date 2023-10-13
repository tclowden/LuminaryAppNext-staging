import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { literal, Op } from 'sequelize';
import { LEADS_COUNT_BY_SOURCE_ID_QUERY } from '../utils';

export async function GET(request: NextRequest) {
   // Read query parameters for pagination from the request
   const limit = request.nextUrl.searchParams.get('limit') || 20; // Number of records per page (default is 10)
   const nameToSearch = request.nextUrl.searchParams.get('name');

   let whereClause = {};

   // Build a sub-query to select all lead source IDs from the bucketLeadSources table
   const bucketSourceIds = await db.bucketLeadSources.findAll({
      attributes: ['leadSourceId'],
      raw: true, // Return only plain objects
   });

   // Extract just the status IDs from the query result
   const sourceIdsArr = bucketSourceIds.map((item: any) => item.leadSourceId);

   const notInBucketSources = {
      id: {
         [Op.notIn]: sourceIdsArr,
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
            notInBucketSources,
         ],
      };
   } else {
      whereClause = notInBucketSources;
   }

   // Fetch data from the database with pagination and sorting
   const sources = await db.leadSources.findAll({
      attributes: ['id', 'name', [literal(LEADS_COUNT_BY_SOURCE_ID_QUERY), 'leadCount']],
      include: [{ model: db.leadSourceTypes, attributes: ['id', 'typeName'] }],
      limit: limit,
      where: whereClause,
      order: [['name', 'ASC']],
   });

   // Send the response with pagination metadata
   return NextResponse.json(
      {
         data: sources,
      },
      { status: 200 }
   );
}
