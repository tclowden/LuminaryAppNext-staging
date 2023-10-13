import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { convertFormDataToJson } from '@/utilities/helpers';
import { uploadFile } from '@/utilities/api/cloudStorage';
const twilio = require('twilio');

export async function POST(request: NextRequest) {
   try {
      const formData: any = convertFormDataToJson(await request.formData());

      const { toNumber, leadId, fromNumber, userId, body, fileCount } = formData;

      if (!toNumber) {
         throw new LumError(400, 'No "To" number provided');
      }
      if (!fromNumber) {
         throw new LumError(400, 'No "From" number provided');
      }
      if (!body && fileCount < 1) {
         throw new LumError(400, 'No message body provided');
      }

      const newSmsLogId = crypto.randomUUID();
      const mmsUrls = await uploadMessageMedia(formData, newSmsLogId);

      const newSmsLog = await createSmsLog({
         id: newSmsLogId,
         messageSid: 'Just Goofing',
         to: toNumber,
         from: fromNumber,
         body: body,
         mmsUrls: mmsUrls,
         leadId: leadId,
         sentFromUserId: userId,
      });

      const newAssociatedSmsLog = await getSmsLogWithAssociations(newSmsLog?.id);

      const baseUrl = process.env.NODE_ENV === 'development' ? process.env.NGROK_ROOT_URL : process.env.CLIENT_SITE;
      const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      await twilioClient.messages.create({
         messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
         body: body,
         from: fromNumber,
         to: toNumber,
         mediaUrl: mmsUrls,
         statusCallback: `${baseUrl}/api/v2/twilio/message/callbacks/status/${newSmsLogId}`,
      });

      return NextResponse.json(newAssociatedSmsLog, { status: 200 });
   } catch (err: any) {
      console.log('twilio/message/outgoing -> Error:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function uploadMessageMedia(formData: any, smsLogId: string) {
   try {
      const promises = [];

      for (let i = 0; i < formData?.fileCount; i++) {
         const blob = formData[`file[${i}]`];

         const fileObject = {
            fileType: blob?.type,
            originalName: `Media_${i}`,
            fileNickName: `Media_${i}`,
            filePath: `leads/${formData?.leadId}/mms/outgoing/${smsLogId}_${i}`,
            buffer: Buffer.from(await blob.arrayBuffer()),
            cloudStorageError: null,
            cloudStorageObject: null,
         };
         promises.push(uploadFile(fileObject));
      }

      const mediaUrls: Array<string> = [];
      await Promise.allSettled(promises).then((results: any) => {
         return results.map((result: any) => {
            if (result.status === 'fulfilled') mediaUrls.push(result.value);
         });
      });

      return mediaUrls;
   } catch (err: any) {
      throw new LumError(400, err);
   }
}

async function createSmsLog({ id, messageSid, to, from, body, mmsUrls, leadId, sentFromUserId }: any) {
   try {
      return db.smsLogs
         .create({
            id,
            messageSid,
            to,
            from,
            body,
            direction: 'outbound',
            mmsUrls,
            leadId,
            sentFromUserId,
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });
   } catch (err: any) {
      throw new LumError(400, err);
   }
}

async function getSmsLogWithAssociations(smsLogId: string) {
   return db.smsLogs
      .findByPk(smsLogId, {
         include: [
            { model: db.leads, as: 'lead', attributes: ['id', 'firstName', 'lastName', 'phoneNumber'] },
            { model: db.users, as: 'sentFromUser', attributes: ['id', 'firstName', 'lastName'] },
            { model: db.users, as: 'sentToUser', attributes: ['id', 'firstName', 'lastName'] },
         ],
      })
      .catch((err: any) => {
         throw new LumError(400, err);
      });
}
