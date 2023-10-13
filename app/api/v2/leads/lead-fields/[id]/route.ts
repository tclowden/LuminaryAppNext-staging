import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function GET(request: NextRequest, options: { params: { id: string } }) {
   try {
      const leadFieldId = options?.params?.id;
      if (!leadFieldId) throw new LumError(400, `Invalid Id in params.`);

      const leadField = await db.leadFields
         .findByPk(leadFieldId, {
            include: [
               { model: db.fieldTypesLookup, as: 'fieldType' },
               { model: db.leadFieldOptions, required: false },
            ],
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      return NextResponse.json(leadField, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function PUT(request: NextRequest, options: { params: { id: string } }) {
   try {
      const leadFieldId = options?.params?.id;
      if (!leadFieldId) throw new LumError(400, `Invalid Id in params.`);

      const reqBody = await request.json();
      const fieldType = reqBody?.fieldType?.name;

      const updatedLeadField = await db.leadFields
         .update(reqBody, { where: { id: leadFieldId }, returning: true })
         .then((res: any) => res[1][0] || res[1] || res)
         .catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

      // Check to make sure leadFieldOptions has items on req.body before continuing with leadFieldOptions updates/creates
      if (!!reqBody?.leadFieldOptions?.length) {
         const leadFieldOptionsCopy = [...reqBody.leadFieldOptions].map((option) => ({
            ...option,
            leadFieldId: updatedLeadField.id,
         }));

         if (updatedLeadField?.id && fieldType === 'Dropdown') {
            for (let option of leadFieldOptionsCopy) {
               if (option?.id) {
                  // Update existing option
                  if (!!option?.archived) {
                     await db.leadFieldOptions.destroy({ where: { id: option.id } }).catch((err: any) => {
                        throw new LumError(400, err);
                     });
                  } else {
                     await db.leadFieldOptions.update(option, { where: { id: option.id } }).catch((err: any) => {
                        throw new LumError(400, err);
                     });
                  }
               } else {
                  // Create new option, because it doesn't have an id
                  await db.leadFieldOptions.create(option).catch((err: any) => {
                     throw new LumError(400, err);
                  });
               }
            }
         } else {
            // If fieldType is not Dropdown, then we want to go ahead and destroy all existing leadFieldOptions
            for (let option of leadFieldOptionsCopy) {
               if (option?.id) {
                  await db.leadFieldOptions.destroy({ where: { id: option.id } }).catch((err: any) => {
                     throw new LumError(400, err);
                  });
               }
            }
         }
      }

      return NextResponse.json(updatedLeadField, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function DELETE(request: NextRequest, options: { params: { id: string } }) {
   try {
      const leadFieldId = options?.params?.id;
      if (!leadFieldId) throw new LumError(400, `Invalid Id in params.`);

      const leadFieldIdExists = await db.leadFields.findByPk(leadFieldId).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!leadFieldIdExists) throw new LumError(400, `Lead Field with id: "${leadFieldId}" doesn't exist.`);

      await db.leadFields.destroy({ where: { id: leadFieldId } }).catch((err: any) => {
         throw new LumError(400, err);
      });

      return NextResponse.json({ success: true, message: 'Lead field successfully deleted' }, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
