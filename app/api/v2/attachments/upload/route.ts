import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { convertFormDataToJson } from '@/utilities/helpers';
import { CloudStorageFileConfig, uploadFile } from '@/utilities/api/cloudStorage';
export const dynamic = 'force-dynamic';

async function fileUpload(request: NextRequest) {
   try {
      const formData: any = convertFormDataToJson(await request.formData());

      const filePath = `${formData.filePath}${formData?.file?.name}-${Date.now()}`.trim();
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

      if (!filePublicUrl) {
         throw new LumError(500, 'File upload failed!');
      }

      // Get a default attachment type
      const attachmentType = await db.attachmentTypesLookup.findOne({ where: { name: 'Sales' } });

      const createdAttachment = await db.attachments
         .create({
            filePath: filePath,
            fileName: formData?.file?.name,
            fileNickName: formData?.fileNickName,
            attachmentTypeId: attachmentType?.id,
            publicUrl: filePublicUrl,
            leadId: formData?.leadId,
            // userId: formData?.userId,
            createdById: formData?.userId,
         })
         .then((newAttachment: any) =>
            db.attachments.findByPk(newAttachment.id, {
               include: [
                  // { model: db.users, as: 'user' },
                  { model: db.users, as: 'createdBy' },
                  { model: db.leads, as: 'lead' },
               ],
            })
         )
         .catch((err: any) => {
            console.log(err);
            throw new LumError(500, err.message);
         });

      return NextResponse.json(createdAttachment, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { fileUpload as POST };
