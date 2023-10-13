import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function GET(request: NextRequest, options: { params: { id: string } }) {
   try {
      const leadId = options?.params?.id;

      if (!leadId) throw new LumError(400, 'Must provide lead ID');

      const lead = await db.leads.findByPk(leadId).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!lead) throw new LumError(400, `Lead with ID: ${leadId}, does not exist.`);

      const leadSmsLogs = await db.smsLogs
         .findAll({
            where: { leadId: leadId },
            include: [
               {
                  model: db.leads,
                  as: 'lead',
                  attributes: ['id', 'firstName', 'lastName', 'phoneNumber'],
                  include: { model: db.smsAcknowledgedBy, attributes: ['acknowledgedByUserIds'] },
               },
               { model: db.users, as: 'sentFromUser', attributes: ['id', 'firstName', 'lastName'] },
               { model: db.users, as: 'sentToUser', attributes: ['id', 'firstName', 'lastName'] },
            ],
            order: [['createdAt', 'ASC']],
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      return NextResponse.json(leadSmsLogs, { status: 200 });
   } catch (err: any) {
      console.log('/leads/[id]/sms-logs -> Error:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
