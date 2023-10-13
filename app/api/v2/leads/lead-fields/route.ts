import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function GET(request: NextRequest) {
   try {
      const leadFields = await db.leadFields
         .findAll({
            include: [
               { model: db.fieldTypesLookup, as: 'fieldType' },
               { model: db.leadFieldOptions, required: false },
            ],
            order: [['id', 'ASC']],
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      return NextResponse.json(leadFields, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function POST(request: NextRequest) {
   try {
      const reqBody = await request.json();
      const fieldType = reqBody?.fieldType?.name;

      const createdLeadField = await db.leadFields.create(reqBody).catch((err: any) => {
         console.log(err);
         throw new LumError(400, err);
      });

      if (createdLeadField?.id && fieldType === 'Dropdown' && !!reqBody?.leadFieldOptions?.length) {
         const leadFieldOptionsCopy = [...reqBody.leadFieldOptions].map((option) => ({
            ...option,
            leadFieldId: createdLeadField.id,
         }));

         await db.leadFieldOptions.bulkCreate(leadFieldOptionsCopy).catch((err: any) => {
            throw new LumError(400, err);
         });
      }

      return NextResponse.json(createdLeadField, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
