import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import { deepCopy } from '@/utilities/helpers';
import db from '@/sequelize/models';

export async function GET(request: NextRequest, params: { params: { id: string; sectionId: string } }) {
   try {
      const leadId = params.params.id;

      if (!leadId) throw new LumError(400, 'Must provide lead ID');

      const lead = await db.leads.findByPk(leadId).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!lead) throw new LumError(400, `Lead with ID: ${leadId}, does not exist.`);

      const sectionId = params.params.sectionId;
      if (!sectionId) throw new LumError(400, `Must provide section ID`);

      const leadSectionsData = await db.leadFieldsSections
         .findByPk(sectionId, {
            include: [
               {
                  model: db.leadFieldsSubsections,
                  required: false,
                  include: [
                     {
                        model: db.leadFields,
                        required: false,
                        include: [
                           { model: db.fieldTypesLookup, as: 'fieldType', required: false },
                           {
                              model: db.leadFieldOptions,
                              required: false,
                           },
                           {
                              as: 'fieldOnLead',
                              model: db.fieldsOnLeads,
                              required: false,
                              where: { leadId },
                           },
                        ],
                     },
                  ],
               },
            ],
            order: [
               ['displayOrder', 'ASC'],
               [{ model: db.leadFieldsSubsections }, 'displayOrder', 'ASC'],
               [{ model: db.leadFieldsSubsections }, { model: db.leadFields }, 'displayOrder', 'ASC'],
               [
                  { model: db.leadFieldsSubsections },
                  { model: db.leadFields },
                  { model: db.leadFieldOptions },
                  'displayOrder',
                  'ASC',
               ],
            ],
         })
         .catch((err: any) => {
            console.log('ERR: ', err);
            throw new LumError(400, err);
         });

      return NextResponse.json(leadSectionsData, { status: 200 });
   } catch (err: any) {
      console.log('ERR: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
