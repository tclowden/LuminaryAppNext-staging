import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';
const dynamic = 'force-dynamic';

async function getNotificationTypes(request: NextRequest, options: any) {
   try {
      const results = await db.notificationTypesLookup.findAll({ order: [['createdAt', 'ASC']] });
      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getNotificationTypes as GET };
