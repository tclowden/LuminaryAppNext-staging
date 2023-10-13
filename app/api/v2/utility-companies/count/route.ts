import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';

async function getTotalUtilityCompanyCount(request: NextRequest, options: any) {
   try {
      const count = await db.utilityCompaniesLookup.count();
      return NextResponse.json(count, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getTotalUtilityCompanyCount as GET };
