import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function GET(request: NextRequest, options: { params: { id: string } }) {
   try {
      const leadFieldSectionId = options?.params?.id;
      if (!leadFieldSectionId) throw new LumError(400, `Invalid Id in params.`);

      const leadFieldSection = await db.leadFieldsSections
         .findByPk(leadFieldSectionId, {
            include: [
               {
                  model: db.leadFieldsSubsections,
                  foreignKey: 'sectionId',
                  required: false,
                  include: [
                     {
                        model: db.leadFields,
                        foreignKey: 'subsectionId',
                        required: false,
                        include: [
                           { model: db.fieldTypesLookup, as: 'fieldType' },
                           {
                              model: db.leadFieldOptions,
                              foreignKey: 'leadFieldId',
                              required: false,
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
            throw new LumError(400, err);
         });

      return NextResponse.json(leadFieldSection, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function PUT(request: NextRequest, options: { params: { id: string } }) {
   try {
      const leadFieldSectionId = options?.params?.id;
      if (!leadFieldSectionId) throw new LumError(400, `Invalid Id in params.`);

      const sectionExists = await db.leadFieldsSections.findByPk(leadFieldSectionId).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!sectionExists) throw new LumError(400, `Section with id: '${leadFieldSectionId}', does not exist`);
      if (!sectionExists?.editable)
         throw new LumError(400, `Section with id: '${leadFieldSectionId}', is not editable`);

      const reqBody = await request.json();

      const { subsections = [], leadFields = [] }: { subsections: Array<any>; leadFields: Array<any> } = reqBody;

      if (subsections.length) {
         for (let subsection of subsections) {
            if (subsection?.id) {
               await db.leadFieldsSubsections.update(subsection, { where: { id: subsection.id } }).catch((err: any) => {
                  throw new LumError(400, err);
               });
            } else if (subsection?.tempId) {
               const newSubsection = await db.leadFieldsSubsections.create(subsection).catch((err: any) => {
                  throw new LumError(400, err);
               });
               leadFields.forEach((leadField, index: number) => {
                  if (leadField.subsectionId === subsection.tempId) {
                     leadFields[index] = { ...leadFields[index], subsectionId: newSubsection.id };
                  }
               });
            }
         }
      }

      if (leadFields.length) {
         await db.leadFields.bulkCreate(leadFields, {
            updateOnDuplicate: ['required', 'displayOrder', 'subsectionId', 'updatedAt'],
         });
      }

      return NextResponse.json({ success: true }, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
