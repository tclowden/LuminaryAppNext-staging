import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';

async function getAutomationRuns(request: NextRequest, options: any) {
   try {
      const automationRuns = await db.automationRuns.findAll({});
      return NextResponse.json(automationRuns, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/automations/runs -> GET -> Error:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createAutomationRun(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({});
      await schema.validate(reqBody);

      // create the automation here
      const createdAutomationRun = await db.automationRuns.create(reqBody);

      return NextResponse.json(createdAutomationRun, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/automations/runs -> POST -> Error', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createAutomationRun as POST };

export { getAutomationRuns as GET };
