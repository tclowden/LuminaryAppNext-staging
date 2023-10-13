import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';

async function getNetMeteringTypes(request: NextRequest, options: any) {
   try {
      const netMeteringTypes = await db.netMeteringTypesLookup.findAll({});
      return NextResponse.json(netMeteringTypes, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getNetMeteringTypes as GET };
