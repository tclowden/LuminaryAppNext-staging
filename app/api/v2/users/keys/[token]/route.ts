import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import { deepCopy } from '@/utilities/helpers';
import db from '@/sequelize/models';

export async function GET(request: NextRequest, params: { params: { token: string } }) {
   try {
      const { token } = params.params;
      if (!token) throw new LumError(404, 'Token not there...');

      const foundUser = await db.usersKeys
         .findOne({
            where: { value: token },
            include: [{ model: db.keyTypesLookup, as: 'keyType' }, { model: db.users }],
         })
         .then(deepCopy);
      return NextResponse.json({ ...foundUser }, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
