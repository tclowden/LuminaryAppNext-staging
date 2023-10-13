import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';

async function getConfiguredLists(request: NextRequest, options: any) {
   try {
      const configuredLists = await db.configuredListsLookup.findAll({});
      return NextResponse.json(configuredLists, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getConfiguredLists as GET };
