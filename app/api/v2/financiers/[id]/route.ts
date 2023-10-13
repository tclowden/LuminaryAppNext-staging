import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';

async function getFinancierById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const financier = await db.financiersLookup.findByPk(id);

      return NextResponse.json(financier, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function deleteFinancier(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const financierIdExists = await db.financiersLookup.findByPk(id);
      if (!financierIdExists) throw new LumError(400, `Financer with id: ${id} doesn't exist...`);

      await db.financiersLookup.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json({ success: true, message: `Financier successfully deleted.` }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateFinancier(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
         specialNotes: Yup.string().nullable(),
         hidden: Yup.boolean().required(),
         pinned: Yup.boolean().required(),
      });
      await schema.validate(reqBody);

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      // validate that the financier exists
      const financierIdExists = await db.financiersLookup.findByPk(id);
      if (!financierIdExists) throw new LumError(400, `Financier with id: '${id}' doesn't exist.`);

      if (reqBody?.id) delete reqBody['id'];

      const updatedFinancier = await db.financiersLookup
         .update(reqBody, { where: { id: id }, returning: true })
         .then((res: any) => res[1][0] || res[1] || res);

      return NextResponse.json(updatedFinancier, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { updateFinancier as PUT };

export { deleteFinancier as DELETE };

export { getFinancierById as GET };
