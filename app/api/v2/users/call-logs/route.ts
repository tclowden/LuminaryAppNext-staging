import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { getUserDataFromHeaders } from '@/utilities/api/helpers';

export async function GET(request: NextRequest, options: { params: { id: string } }) {
   try {
      const foundUser = await getUserDataFromHeaders(request.headers);

      if (!foundUser?.id) throw new LumError(400, `Invalid user id`);
      const { id } = foundUser;

      const callLogs = await db.callLogs.findAll({
         where: { userId: id },
         include: [
            { model: db.leads, as: 'lead', attributes: ['id', 'firstName', 'lastName', 'fullName', 'phoneNumber'] },
         ],
         order: [['createdAt', 'DESC']],
      });

      return NextResponse.json(callLogs, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/users/call-logs -> GET -> Error:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
