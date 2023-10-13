import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
export const dynamic = 'force-dynamic';

async function getTaskById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const productTask = await db.productTasks.findByPk(id, { required: false });
      return NextResponse.json(productTask, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function deleteTask(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const taskIdExists = await db.productTasks.findByPk(id);
      if (!taskIdExists) throw new LumError(400, `Product task with id: ${id} doesn't exist...`);

      await db.productTasks.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json(`Product task successfully deleted.`, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateTask(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
         description: Yup.string().required(),
      });
      await schema.validate(reqBody);

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const taskIdExists = await db.productTasks.findByPk(id);
      if (!taskIdExists) throw new LumError(400, `Product task with id: ${id} doesn't exist...`);

      if (reqBody?.id) delete reqBody['id'];

      const updatedProductTask = await db.productTasks
         .update(reqBody, { where: { id: id }, returning: true, individualHooks: true })
         .then((res: any) => res[1][0] || res[1] || res);

      return NextResponse.json(updatedProductTask, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { updateTask as PUT };
export { deleteTask as DELETE };
export { getTaskById as GET };
