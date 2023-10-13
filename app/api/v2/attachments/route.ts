import db from '@/sequelize/models';
import { convertFormDataToJson, deepCopy } from '@/utilities/helpers';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { foreignKeysExists } from './validators';
import { CloudStorageFileConfig, uploadFile } from '@/utilities/api/cloudStorage';
import { LumError } from '@/utilities/models/LumError';
export const dynamic = 'force-dynamic';

async function createAttachment(request: NextRequest, options: any) {
   try {
      let formData: any = await request.formData();
      formData = convertFormDataToJson(formData);

      // Get a default attachment type, if there is no attachment type in the request...
      if (!formData.attachmentTypeId) {
         let attachmentType = await db.attachmentTypesLookup.findOne({ where: { name: 'Sales' } }).then(deepCopy);
         // if you can't find one, just create one that defaults to Sales... should only happen once
         if (!attachmentType) attachmentType = await db.attachmentTypesLookup.create({ name: 'Sales' }).then(deepCopy);
         formData.attachmentTypeId = attachmentType?.id;
      }

      const schema = Yup.object({
         file: Yup.mixed()
            .required()
            .test('is-valid-type', 'Not a valid image type', (file: any) => {
               const validFileExtensions = ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'];
               const fileName = file?.name?.toLowerCase();
               validFileExtensions.indexOf(fileName.split('.').pop()) > -1;
               return fileName && validFileExtensions.indexOf(fileName.split('.').pop()) > -1;
            }),
         filePath: Yup.string().required(),
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
      });
      await schema.validate(formData);

      await foreignKeysExists(formData);

      let filePath = '';
      const filePathEndsWithSlash = formData?.filePath.endsWith('/');
      if (filePathEndsWithSlash) filePath = `${formData.filePath}${formData?.file?.name}-${Date.now()}`.trim();
      else filePath = `${formData.filePath}/${formData?.file?.name}-${Date.now()}`.trim();

      const fileConfig: CloudStorageFileConfig = {
         fileType: formData?.file?.type,
         originalName: formData?.file?.name,
         filePath: filePath,
         fileNickName: formData?.fileNickName,
         cloudStorageError: null,
         cloudStorageObject: null,
         buffer: Buffer.from(await formData?.file.arrayBuffer()),
      };

      const filePublicUrl = await uploadFile(fileConfig);

      let createdAttachment = await db.attachments
         .create({
            filePath: filePath,
            fileName: formData?.file?.name,
            fileNickName: formData?.fileNickName,
            attachmentTypeId: formData?.attachmentTypeId,
            publicUrl: filePublicUrl,
            leadId: formData?.leadId,
            orderId: formData?.orderId || null,
            createdById: formData?.createdById,
         })
         .catch((err: any) => {
            console.log(err);
            throw new LumError(500, err.message);
         });

      createdAttachment = await db.attachments.findByPk(createdAttachment?.id, {
         include: [
            { model: db.users, as: 'createdBy', required: false },
            { model: db.users, as: 'updatedBy', required: false },
         ],
      });

      return NextResponse.json(createdAttachment, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createAttachment as POST };
