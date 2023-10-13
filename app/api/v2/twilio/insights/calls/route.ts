import { NextResponse, NextRequest } from 'next/server';
import db from '@/sequelize/models';
import { Op } from 'sequelize';

type Status = 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed' | 'no-answer' | 'canceled';
type Direction = 'inbound' | 'outbound-dial' | 'outbound-api';

export async function GET(request: NextRequest) {
   try {
      const params = request.nextUrl.searchParams;
      const whereClause = await getWhereClause(params);
      console.log('whereClause', whereClause);
      const calls = await db.callLogs.findAndCountAll({
         where: whereClause,
         include: [
            {
               model: db.users,
               required: false,
            },
            {
               model: db.leads,
               required: false,
            },
         ],
         limit: 10,
         order: [['createdAt', 'DESC']],
      });

      return NextResponse.json({ calls }, { status: 200 });
   } catch (err: any) {
      console.log('Error:', err);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
   }
}

async function getWhereClause(params: URLSearchParams) {
   const whereClause: Record<string, any> = {};
   const dateRange: Record<string, any> = {};

   const queryToFieldMap: Record<string, string> = {
      status: 'status',
      direction: 'direction',
      startDate: 'createdAt',
      endDate: 'createdAt',
      callSid: 'sid',
      toNumber: 'to',
      fromNumber: 'from',
      duration: 'duration',
   };

   for (const [query, field] of Object.entries(queryToFieldMap)) {
      let value = params.get(query);

      if (value) {
         if (query === 'startDate') {
            dateRange[Op.gte as any] = value;
         } else if (query === 'endDate') {
            dateRange[Op.lte as any] = value;
         } else if (query === 'toNumber' || query === 'fromNumber') {
            whereClause[field] = {
               [Op.iLike]: `%${value}%`,
            };
         } else if (query === 'duration') {
            whereClause[field] = {
               [Op.gte]: value,
            };
         } else {
            whereClause[field] = value;
         }
      }
   }

   if (Object.keys(dateRange).length > 0) {
      whereClause.createdAt = dateRange;
   }

   return whereClause;
}
