import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { Op } from 'sequelize';
import { getUserDataFromHeaders } from '@/utilities/api/helpers';

export async function GET(request: NextRequest, options: { params: { id: string } }) {
   try {
      const foundUser = await getUserDataFromHeaders(request.headers);

      if (!foundUser?.id) throw new LumError(400, `Invalid user id`);
      const { id } = foundUser;

      const smsLogs = await db.smsLogs.findAll({
         where: {
            [Op.or]: [{ sentFromUserId: id }, { sentToUserId: id }],
         },
         include: [
            { model: db.leads, as: 'lead', attributes: ['id', 'firstName', 'lastName', 'fullName', 'phoneNumber'] },
         ],
         order: [['createdAt', 'DESC']],
      });

      return NextResponse.json(smsLogs, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/users/sms-logs -> GET -> Error:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
