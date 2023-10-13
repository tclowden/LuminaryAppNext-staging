import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';

export async function GET(request: NextRequest) {
   // Read query parameters for pagination from the request
   const limit = request.nextUrl.searchParams.get('limit') || 20; // Number of records per page (default is 10)
   const offset = request.nextUrl.searchParams.get('offset') || 0; // Starting index (default is 0)

   // Fetch data from the database with pagination and sorting
   const bucketTypes = await db.bucketTypes.findAll({
      limit: limit,
      offset: offset,
   });

   // Send the response with pagination metadata
   return NextResponse.json(bucketTypes, { status: 200 });
}
