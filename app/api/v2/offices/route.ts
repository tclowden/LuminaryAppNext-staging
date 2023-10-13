import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';

async function getOffices(request: NextRequest) {
   try {
      const offices = await db.offices.findAll({ order: [['createdAt', 'ASC']] });
      return NextResponse.json(offices, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getOffices as GET };
