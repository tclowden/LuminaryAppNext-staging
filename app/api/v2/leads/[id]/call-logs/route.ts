import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function GET(request: NextRequest, options: { params: { id: string } }) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const callLogs = await db.callLogs.findAll({
         where: { leadId: id },
         include: [{ model: db.users, as: 'consultant' }],
         order: [['createdAt', 'ASC']],
      });

      return NextResponse.json(callLogs, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/leads/[id]/call-logs -> GET -> Error: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
