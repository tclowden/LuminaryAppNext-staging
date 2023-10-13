import { CloudStorageFileConfig, uploadFile } from '@/utilities/api/cloudStorage';
import { NextRequest, NextResponse } from 'next/server';

async function upload(request: NextRequest, options: any) {
   try {
      const formData: any = await request.formData();
      // const formDataEntryValues = Array.from(formData.values());
      const fileConfig: CloudStorageFileConfig = {
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
               formData['fileNickName'] = value;
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

      const filePublicUrl = await uploadFile(fileConfig);
      return NextResponse.json(filePublicUrl, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
export { upload as POST };
