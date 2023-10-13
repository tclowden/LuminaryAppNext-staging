import { LumError } from '../models/LumError';

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
   projectId: process.env.GCP_PROJECT_ID,
   credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
   },
});

let bucketName = process.env.PUBLIC_GCP_BUCKET_NAME;

export type CloudStorageFileConfig = {
   fileType: string | null;
   originalName: string | null;
   filePath: string | null;
   fileNickName: string | null;
   cloudStorageError: any;
   cloudStorageObject: any;
   buffer: any;
};

export async function uploadFile(fileObject: CloudStorageFileConfig) {
   return new Promise((resolve, reject) => {
      // make a bucket object 'shine-solar-luminary'
      const bucket = storage.bucket(bucketName);

      // set the path to the file with the folder structure prefix given from user
      const gcsFileName = fileObject.filePath;

      // this creates a file object on GCS: https://googleapis.dev/nodejs/storage/latest/Bucket.html#file
      const file = bucket.file(gcsFileName);

      // now we use a writeStream to over ride this newly created object: https://googleapis.dev/nodejs/storage/latest/File.html#createWriteStream
      const stream = file.createWriteStream({
         metadata: {
            contentType: fileObject.fileType,
            // contentType: fileObject.originalFile.mimetype,
         },
         gzip: true,
      });

      stream.on('error', (err: any) => {
         fileObject.cloudStorageError = err;
         // next(err);
         reject(err);
      });

      stream.on('finish', () => {
         fileObject.cloudStorageObject = gcsFileName;
         const publicUrl = `${file.parent.parent.apiEndpoint}/${file.parent.id}/${file.name}`;
         resolve(publicUrl);
         // return fileObject;
      });

      stream.end(fileObject.buffer);
   });
}

export async function getAuthedUrl(filePath: string) {
   async function generateV4ReadSignedUrl() {
      // These options will allow temporary read access to the file
      const options = {
         version: 'v4',
         action: 'read',
         expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      };

      // Get a v4 signed URL for reading the file
      const [url] = await storage.bucket(bucketName).file(filePath).getSignedUrl(options);

      return url;
   }

   return await generateV4ReadSignedUrl().catch(console.error);
}

export async function deleteFile(filePath: string) {
   try {
      await storage.bucket(bucketName).file(filePath).delete();

      return {
         success: true,
      };
   } catch (err: any) {
      throw new LumError(500, err.message);
   }
}
