import db from '@/sequelize/models';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { upsert } from '@/utilities/api/helpers';

async function getAutomationRunById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      let automation = await db.automationRuns
         .findByPk(id, {
            include: [
            ],
            order: [['createdAt', 'DESC']],
         })
         .then(deepCopy);

      return NextResponse.json(automation, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function deleteAutomationRun(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const automationRunId = await db.automationRuns.findByPk(id);
      if (!automationRunId) throw new LumError(400, `Automation with id: ${id} doesn't exist...`);

      await db.automationRuns.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json({ success: true, message: `Automation successfully deleted.` }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateAutomationRun(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
      });
      await schema.validate(reqBody);

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      // delete the id out of the obj, don't want to rewrite the id...
      if (reqBody?.id) delete reqBody['id'];

      const updatedAutomationRun = await db.automationRuns
         .update(reqBody, { where: { id: id }, returning: true })
         .then((res: any) => res[1][0] || res[1] || res);


      return NextResponse.json(updatedAutomationRun, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { updateAutomationRun as PUT };

export { deleteAutomationRun as DELETE };

export { getAutomationRunById as GET };
