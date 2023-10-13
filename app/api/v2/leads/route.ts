import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';
import { foreignKeysExists, validateFieldsOnLeadArr } from './validators';
import { deepCopy } from '@/utilities/helpers';

async function getLeads(request: NextRequest) {
   try {
      const leads = await db.leads
         .findAll({
            include: [
               { model: db.leadSources, as: 'leadSource', required: false }, // for some reason this broke leads for me
               { model: db.statuses, as: 'status', required: false },
               { model: db.users, as: 'owner', required: false },
               { model: db.users, as: 'createdBy', required: false },
               { model: db.users, as: 'setterAgent', required: false },
               {
                  model: db.fieldsOnLeads,
                  include: { model: db.leadFields, as: 'leadField', required: false },
                  required: false,
               },
            ],
            order: [['createdAt', 'DESC']],
            limit: 200,
            offset: 0,
         })
         .catch((err: any) => {
            console.log('err: ', err);
            throw new LumError(400, err);
         });

      return NextResponse.json(leads, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createLead(request: NextRequest) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         leadSourceId: Yup.string(),
         ownerId: Yup.string(),
         createdById: Yup.string().required(),
         setterAgentId: Yup.string(),
         statusId: Yup.string(),
         fieldsOnLead: Yup.array(),
      });
      await schema.validate(reqBody);

      await foreignKeysExists(reqBody);

      if (reqBody?.fieldsOnLead?.length) await validateFieldsOnLeadArr(reqBody);

      // create the lead here
      const createdLead = await db.leads.create(reqBody).then(deepCopy);

      // with the created leadId, create all the fieldsOnLead
      if (reqBody?.fieldsOnLead?.length) {
         const fieldsOnLeadWithNewLeadId = [...reqBody.fieldsOnLead].map((fieldOnLead: any) => ({
            ...fieldOnLead,
            leadId: createdLead.id,
         }));
         await db.fieldsOnLeads.bulkCreate(fieldsOnLeadWithNewLeadId);
      }

      return NextResponse.json(createdLead, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getLeads as GET };
export { createLead as POST };
