import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';

async function getTotalUserCount(request: NextRequest, options: any) {
   try {
      const userCount = await db.users.count();
      return NextResponse.json(userCount, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getTotalUserCount as GET };
