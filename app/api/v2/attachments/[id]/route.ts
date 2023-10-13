import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';
import { foreignKeysExists } from '../validators';
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest, options: { params: { id: string } }) {
   try {
      const attachmentId = options?.params?.id;
      if (!attachmentId) {
         throw new LumError(400, 'Invalid Attachment Id provided');
      }
      await db.attachments.destroy({ where: { id: attachmentId } });

      return NextResponse.json({ success: true, message: 'Attachment successfully deleted.' }, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateAttachment(request: NextRequest, options: any) {
   try {
      // this only handles updating the attachment data within the attachments table
      // no logic to handle replacing files in gcp / editing the public url or bucket info yet...
      // ^^ not sure if needed, tbh

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      let reqBody: any = await request.json();
      const schema = Yup.object({
         // nullable becuase of some migrated attachments didn't have a filePath
         filePath: Yup.string().nullable(),
         fileName: Yup.string().required(),
         fileNickName: Yup.string()
            .nullable()
            .when({
               is: (value: any) => typeof value === 'string',
               then: (schema: any) => {
                  return Yup.string().test(
                     'non-empty-string',
                     'Name must be greater than 0 characters',
                     (value: any) => {
                        if (value?.trim()?.length > 0) return true;
                        else return false;
                     }
                  );
               },
            }),
         leadId: Yup.string().required(),
         orderId: Yup.string().nullable(),
         attachmentTypeId: Yup.string().required(),
         createdById: Yup.string().required(),
         updatedById: Yup.string().nullable(),
         publicUrl: Yup.string().required(),
      });
      await schema.validate(reqBody);

      const attachmentIdExists = await db.attachments.findByPk(id);
      if (!attachmentIdExists) throw new LumError(400, `Attachment id: ${id} doesn't exist.`);

      await foreignKeysExists(reqBody);

      let updatedAttachment = await db.attachments.update(reqBody, { where: { id: id } }).catch((err: any) => {
         throw new LumError(500, err.message);
      });
      updatedAttachment = await db.attachments.findByPk(id, {
         include: [
            { model: db.users, as: 'createdBy', required: false },
            { model: db.users, as: 'updatedBy', required: false },
         ],
      });

      return NextResponse.json(updatedAttachment, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { updateAttachment as PUT };
