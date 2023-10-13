import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

async function getAttachmentTypes(request: NextRequest, options: any) {
   try {
      const attachmentTypes = await db.attachmentTypesLookup.findAll({});
      return NextResponse.json(attachmentTypes, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getAttachmentTypes as GET };
