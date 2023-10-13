import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';

async function getFieldTypes(request: NextRequest, options: any) {
   try {
      const fieldTypes = await db.fieldTypesLookup.findAll({});
      return NextResponse.json(fieldTypes, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getFieldTypes as GET };
