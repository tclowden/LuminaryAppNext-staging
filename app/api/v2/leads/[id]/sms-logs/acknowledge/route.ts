import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { getUserDataFromHeaders } from '@/utilities/api/helpers';

export async function PUT(request: NextRequest, options: { params: { id: string } }) {
   try {
      const userObj = await getUserDataFromHeaders(request.headers);
      const leadId = options?.params?.id;

      if (!leadId) throw new LumError(400, 'Must provide lead ID');

      const lead = await db.leads.findByPk(leadId).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!lead) throw new LumError(400, `Lead with ID: ${leadId}, does not exist.`);

      const smsAcknowledgedRecord = await db.smsAcknowledgedBy.findOne({ where: { leadId } }).catch((err: any) => {
         throw new LumError(400, err);
      });

      if (!smsAcknowledgedRecord) {
         await db.smsAcknowledgedBy.create({ leadId, acknowledgedByUserIds: [userObj?.id] }).catch((err: any) => {
            throw new LumError(400, err);
         });
      } else {
         if (!smsAcknowledgedRecord.acknowledgedByUserIds.includes(userObj.id)) {
            smsAcknowledgedRecord.acknowledgedByUserIds = [...smsAcknowledgedRecord.acknowledgedByUserIds, userObj.id];
            await smsAcknowledgedRecord.save().catch((err: any) => {
               throw new LumError(400, err);
            });
         }
      }

      return NextResponse.json({ success: true }, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
