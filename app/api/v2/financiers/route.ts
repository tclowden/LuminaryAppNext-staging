import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';

async function getFinanciers(request: NextRequest, options: any) {
   try {
      const financiers = await db.financiersLookup.findAll({ order: [['name', 'ASC']] });
      return NextResponse.json(financiers, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createFinanciers(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
         specialNotes: Yup.string().nullable(),
         hidden: Yup.boolean().required(),
         pinned: Yup.boolean().required(),
      });
      await schema.validate(reqBody);

      const createdFinancier = await db.financiersLookup.create(reqBody);

      return NextResponse.json(createdFinancier, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createFinanciers as POST };

export { getFinanciers as GET };
