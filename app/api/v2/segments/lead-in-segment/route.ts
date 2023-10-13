import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { Op } from 'sequelize';
import { buildWhereCondition } from '../utils';

// needs
export async function POST(request: NextRequest) {
   try {
      const body = await request.json();

      const segment = await db.segments.findByPk(body?.segmentId);
      if (!segment) {
         throw new LumError(404, 'Segment not found');
      }

      const isFound = await isLeadInSegment(segment, body.leadId);
      return NextResponse.json(isFound, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/segments/lead-in-segment -> POST -> Error:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

const isLeadInSegment = async (segment: any, leadId: any) => {
   const filter = JSON.parse(segment.filter);
   let whereCondition = await buildWhereCondition(filter);

   const results = await db.leads.findAndCountAll({
      attributes: ['id', 'firstName', 'lastName', 'fullName', 'phoneNumber', 'createdAt'],
      where: {
         [Op.and]: [{ ...whereCondition }, { id: leadId }],
      },
   });

   return results;
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
      console.log('/api/v2/segments/lead-in-segment -> DELETE -> Error:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
