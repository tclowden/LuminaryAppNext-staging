import util from 'util';
import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import { deepCopy } from '@/utilities/helpers';
import db from '@/sequelize/models';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { getUserDataFromHeaders, verifyToken } from '@/utilities/api/helpers';

export async function GET(request: NextRequest) {
   try {
      const foundUser = await getUserDataFromHeaders(request.headers);

      const leads = await db.leads.findAll({
         where: {
            ownerId: foundUser?.id,
         },
         include: [
            { model: db.leadSources, as: 'leadSource', required: false },
            { model: db.statuses, as: 'status', required: false },
            { model: db.users, as: 'owner', required: false },
            { model: db.users, as: 'createdBy', required: false },
            { model: db.users, as: 'setterAgent', required: false },
            {
               model: db.notes,
               required: false,
               include: [{ model: db.users, as: 'createdBy', required: false }],
            },
            { model: db.appointments, required: false },
            {
               model: db.callLogs,
               where: { userId: foundUser?.id, direction: 'outbound' },
               attributes: ['id'],
               required: false,
            },
            {
               model: db.smsLogs,
               where: { sentFromUserId: foundUser?.id, direction: 'outbound' },
               attributes: ['id'],
               required: false,
            },
            { model: db.smsAcknowledgedBy, required: false },
         ],
         order: [
            ['createdAt', 'DESC'],
            [db.notes, 'createdAt', 'ASC'],
         ],
         distinct: true,
      });

      return NextResponse.json(leads, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/leads/my/pipe -> Error:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
