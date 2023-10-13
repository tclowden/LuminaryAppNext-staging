import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';

/**
 *
 * @param request
 * @param params
 * @returns All the ACTIVE buckets that the user is assigned to (public buckets?)
 */
export async function GET(request: NextRequest, params: { params: { userId: string } }) {
   const buckets = await db.buckets.findAll({
      include: [
         {
            model: db.bucketUsers,
            where: {
               userId: params.params.userId,
            },
         },
         {
            model: db.bucketTypes,
         },
      ],
      where: {
         isActive: true,
      },
   });

   // Send the response with pagination metadata
   return NextResponse.json(buckets, { status: 200 });
}
