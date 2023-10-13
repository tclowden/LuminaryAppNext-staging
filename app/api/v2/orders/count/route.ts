import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

async function getTotalOrderCount(request: NextRequest, options: any) {
   try {
      const orderCount = await db.orders.count();
      return NextResponse.json(orderCount, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getTotalOrderCount as GET };
