import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function PUT(request: NextRequest, options: { params: { id: string } }) {
   try {
      const { active } = await request.json();
      if (!options.params.id) throw new LumError(400, `Invalid Id in params.`);

      const phoneNumberExists = await db.phoneNumbers.findByPk(options.params.id).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!phoneNumberExists) throw new LumError(400, `Phone Number with id: "${options.params.id}" doesn't exist.`);

      const updatedPhoneNumberRes = await db.phoneNumbers
         .update({ active: active }, { where: { id: options.params.id }, returning: true })
         .then((res: any) => res[1][0] || res[1] || res)
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      return NextResponse.json(updatedPhoneNumberRes, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
