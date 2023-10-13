import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';

async function getAutomations(request: NextRequest, options: any) {
   try {
      const automations = await db.automations.findAll({});
      return NextResponse.json(automations, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createAutomation(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      // const schema = Yup.object({
        
      // });
      // await schema.validate(reqBody);

      console.log('reqBody:', reqBody);

      // create the automation here
      const createdAutomation = await db.automations.create(reqBody);

      return NextResponse.json(createdAutomation, { status: 200 });
      // return NextResponse.json({}, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createAutomation as POST };

export { getAutomations as GET };
