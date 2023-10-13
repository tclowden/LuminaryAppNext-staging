import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';

async function getLead(request: NextRequest, options: { params: { id: string } }) {
   try {
      const leadId = options?.params?.id;
      if (!leadId) throw new LumError(400, `Invalid id in params`);

      const lead = await db.leads
         .findByPk(leadId, {
            include: [
               { model: db.leadSources, as: 'leadSource', required: false },
               { model: db.statuses, as: 'status', required: false },
               { model: db.users, as: 'owner', required: false },
               { model: db.users, as: 'createdBy', required: false },
               { model: db.users, as: 'setterAgent', required: false },
               { model: db.appointments, required: false },
               {
                  model: db.fieldsOnLeads,
                  include: { model: db.leadFields, as: 'leadField', required: false },
                  required: false,
               },
               {
                  model: db.smsAcknowledgedBy,
                  attributes: ['acknowledgedByUserIds'],
                  required: false,
               },
            ],
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      if (!lead) throw new LumError(404, `Lead with id '${leadId}' was not found.`);
      return NextResponse.json(lead, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function PUT(request: NextRequest, options: { params: { id: string } }) {
   try {
      const leadId = options?.params?.id;
      if (!leadId) throw new LumError(400, `Invalid id in params`);

      const reqBody = await request.json();

      await db.leads.update({ ...reqBody }, { where: { id: leadId } }).catch((err: any) => {
         throw new LumError(400, err);
      });

      const leadData = await db.leads
         .findByPk(leadId, {
            include: [
               { model: db.users, as: 'setterAgent' },
               { model: db.users, as: 'owner' },
            ],
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      return NextResponse.json(leadData, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
export { getLead as GET };
