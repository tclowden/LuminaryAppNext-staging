import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { Op } from 'sequelize';
import { buildWhereCondition } from '../utils';

type Model = 'leadSourceId' | 'leadSourceTypeId' | 'statusId' | 'statusTypeId';

type Column = 'Lead Source' | 'Lead Source Type' | 'Status' | 'Status Type';

type ColumnValue = {
   id: number;
   columnValue: string;
};

type ComparisonOperator = 'Is Not' | 'Is Not In' | 'Is' | 'Is In';

type FilterPayloadType = {
   columnName: Column;
   columnValues: ColumnValue[];
   comparisonOperator: ComparisonOperator;
};

export async function POST(request: NextRequest) {
   try {
      const segment = await request.json();
      const filters = segment.filters;
      const whereCondition = await buildWhereCondition(filters);
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
      });

      return NextResponse.json(leads, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
