import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { buildWhereCondition } from '../../utils';

// needs
export async function GET(request: NextRequest, params: { params: { id: string } }) {
   try {
      const { id } = params.params;

      const segment = await db.segments.findByPk(id);
      if (!segment) {
         throw new LumError(404, 'Segment not found');
      }
      const segmentWithLeadCount = await getSegmentWithoutLeadData(segment);
      return NextResponse.json(segmentWithLeadCount, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

const getSegmentWithoutLeadData = async (segment: any) => {
   const filter = JSON.parse(segment.filter);
   const whereCondition = await buildWhereCondition(filter);
   return await db.leads.count({
      where: whereCondition,
   });
   
};

