import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';

async function getTotalLeadCount(request: NextRequest, options: any) {
   try {
      const leadCount = await db.leads.count();
      return NextResponse.json(leadCount, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getTotalLeadCount as GET };
