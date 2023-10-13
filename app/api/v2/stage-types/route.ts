import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';

async function getStageTypes(request: NextRequest, options: any) {
   try {
      const stageTypes = await db.stageTypesLookup.findAll({});
      return NextResponse.json(stageTypes, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getStageTypes as GET };
