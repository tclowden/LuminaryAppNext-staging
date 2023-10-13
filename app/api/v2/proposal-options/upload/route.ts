import { CloudStorageFileConfig, uploadFile } from '@/utilities/api/cloudStorage';
import { NextRequest, NextResponse } from 'next/server';
import { UUID } from 'sequelize';

async function upload(request: NextRequest, options: any) {
   try {
      const formData: any = await request.formData();

      console.log('Form data! ', formData);

      let fileConfig: CloudStorageFileConfig = {
         fileType: null,
         originalName: null,
         filePath: null,
         fileNickName: null,
         cloudStorageError: null,
         cloudStorageObject: null,
         buffer: null,
      };

      for (const [key, value] of formData) {
         switch (key) {
            case 'fileNickName':
               fileConfig['fileNickName'] = value;
               break;
            case 'filePath':
               fileConfig['filePath'] = value;
               break;
            case 'file':
               const blob = value as Blob;
               fileConfig['fileType'] = blob?.type;
               fileConfig['originalName'] = blob?.name;
               fileConfig['buffer'] = Buffer.from(await blob.arrayBuffer());
               break;
            default:
               break;
         }
      }

      // The ID of your GCS bucket
      const bucketName = 'shine-solar-luminary-public';

      // The path to your file to upload
      const filePath = 'proposalFiles';

      // + crypto.randomUUID()
      // The new ID for your GCS file
      const destFileName = 'your-new-file-name';

      const filePublicUrl = await uploadFile(fileConfig);

      console.log('fileConfig', fileConfig);

      console.log('return is : ', filePublicUrl);

      return NextResponse.json({ filePath: filePublicUrl }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
export { upload as POST };
