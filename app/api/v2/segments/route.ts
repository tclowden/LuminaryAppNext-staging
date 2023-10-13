import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { ColumnValue, ComparisonOperator, FilterPayloadType } from './types';
import { buildWhereCondition } from './utils';

/**
 * Gets a list of segments with the lead count for each segment
 */
export async function GET(request: NextRequest) {
   try {
      const segments = await getSegments();
      return NextResponse.json(segments, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function getSegments() {
   try {
      const segments = await db.segments.findAll({
         attributes: ['id', 'name', 'type', 'filter'],
         limit: 10,
         order: [['createdAt', 'ASC']],
      });

      // parse the filter column in segments and add leadCount
      for (const segment of segments) {
         const filter = JSON.parse(segment.filter);
         const whereCondition = await buildWhereCondition(filter);
         const leads = await db.leads.findAndCountAll({
            attributes: ['id'],
            where: whereCondition,
         });
         segment.setDataValue('leadCount', leads.count);
      }
      return segments;
   } catch (err: any) {
      console.log('err:', err);
      throw new LumError(400, err);
   }
}

export async function POST(request: NextRequest) {
   try {
      const filterPayload: FilterPayloadType[] = await request.json();

      const whereCondition = await buildWhereCondition(filterPayload);

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

      return NextResponse.json(leads || 0, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function PUT(request: NextRequest) {
   try {
      const filterPayload = await request.json();
      if (!filterPayload.id) {
         throw new LumError(400, 'Segment id is required');
      }

      if (typeof filterPayload.filter === 'object') {
         filterPayload.filter = JSON.stringify(filterPayload.filter);
      }

      if (filterPayload.id === 'new') {
         await db.segments.create({
            name: filterPayload.name,
            type: 'Dynamic',
            filter: filterPayload.filter,
         });
      } else {
         const updatedSegment = await db.segments.findByPk(filterPayload.id);
         if (!updatedSegment) {
            throw new LumError(400, 'Segment not found');
         }
         updatedSegment.name = filterPayload.name;
         updatedSegment.filter = filterPayload.filter;
         await updatedSegment.save();
      }
      return NextResponse.json({ status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
