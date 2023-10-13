import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextResponse } from 'next/server';

export async function GET() {
   try {
      const permissionTags = await db.permissionTagsLookup
         .findAll({ order: [['createdAt', 'ASC']] })
         .catch((err: any) => {
            throw new LumError(400, err);
         });
      return NextResponse.json(permissionTags, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
