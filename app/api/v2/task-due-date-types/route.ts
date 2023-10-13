import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';
const dynamic = 'force-dynamic';

async function getTaskDueDateTypes(request: NextRequest, options: any) {
   try {
      const taskDueDateTypes = await db.taskDueDateTypesLookup.findAll({});
      return NextResponse.json(taskDueDateTypes, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getTaskDueDateTypes as GET };
