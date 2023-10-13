import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function GET(request: NextRequest) {
   try {
      const smsLogs = await db.smsLogs
         .findAll({
            include: [
               {
                  model: db.leads,
                  as: 'lead',
                  attributes: ['id', 'firstName', 'lastName', 'phoneNumber'],
                  where: { ownerId: null },
                  include: {
                     model: db.smsAcknowledgedBy,
                     attributes: ['acknowledgedByUserIds'],
                     required: false,
                  },
               },
            ],
            where: { direction: 'inbound' },
            order: [['createdAt', 'DESC']],
            limit: 100,
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      // Filter out any additional messages from the same lead
      const filteredSmsLogs = smsLogs.filter(
         (smsLog: any, index: number, self: any) =>
            index === self.findIndex((selfSmsLog: any) => selfSmsLog?.lead?.id === smsLog?.lead?.id)
      );

      return NextResponse.json(filteredSmsLogs, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
