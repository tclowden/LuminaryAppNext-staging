import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
export const dynamic = 'force-dynamic';

async function getTasks(request: NextRequest, options: any) {
   try {
      const productTasks = await db.productTasks.findAll({
         order: [['createdAt', 'ASC']], // order by created at ASC
      });
      return NextResponse.json(productTasks, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createTask(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
         description: Yup.string().required(),
      });
      await schema.validate(reqBody);

      const createdProductTask = await db.productTasks.create(reqBody);

      return NextResponse.json(createdProductTask, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createTask as POST };
export { getTasks as GET };
