import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { buildWhereCondition } from '../utils';

// needs
export async function GET(request: NextRequest, params: { params: { id: string } }) {
   try {
      const { id } = params.params;

      const segment = await db.segments.findByPk(id);
      if (!segment) {
         throw new LumError(404, 'Segment not found');
      }
      const segmentWithLeadCount = await getSegmentWithLeadData(segment);
      return NextResponse.json(segmentWithLeadCount, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

const getSegmentWithLeadData = async (segment: any) => {
   const filter = JSON.parse(segment.filter);
   const whereCondition = await buildWhereCondition(filter);
   const leads = await db.leads.findAndCountAll({
      attributes: ['id', 'firstName', 'lastName', 'fullName', 'phoneNumber', 'createdAt'],
      where: whereCondition,
      include: [
         {
            model: db.statuses,
            as: 'status',
            attributes: ['id', 'name'],
         },
         {
            model: db.leadSources,
            as: 'leadSource',
            attributes: ['id', 'name'],
         },
      ],
      limit: 10,
      order: [['createdAt', 'DESC']],
   });
   segment.setDataValue('leadCount', leads.count);
   segment.setDataValue('leads', leads.rows);
   segment.setDataValue('filter', filter);
   return segment;
};

export async function DELETE(request: NextRequest, params: { params: { id: string } }) {
   try {
      const { id } = params.params;
      const segment = await db.segments.findByPk(id);
      if (!segment) {
         throw new LumError(404, 'Segment not found');
      }
      await segment.destroy();
      return NextResponse.json({ status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
