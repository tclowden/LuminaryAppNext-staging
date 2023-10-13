import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';

export async function GET(request: NextRequest, params: { params: { id: string } }) {
   try {
      const statusHistory = await db.auditLogs.findAll({
         where: {
            table: 'leads',
            rowId: params.params.id,
         },
         limit: 1,
         order: [['modifiedAt', 'ASC']],
      });

      console.log('statusHistory: ', JSON.parse(statusHistory[0].originalValue));
      return NextResponse.json(statusHistory, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
