import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';

async function updateFieldsOnLead(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         fieldsOnLead: Yup.array().required(),
      });
      await schema.validate(reqBody);

      // if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      // const { id } = options?.params;

      const upsertedFieldsOnLead = [];
      for (let field of reqBody.fieldsOnLead) {
         const [updatedField, created] = await db.fieldsOnLeads.upsert(field);
         upsertedFieldsOnLead.push(updatedField);
      }

      return NextResponse.json(upsertedFieldsOnLead, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/leads/[id]/fields-on-lead -> Error:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { updateFieldsOnLead as PUT };
