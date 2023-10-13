import { convertFormDataToJson, getObjectProp } from '@/utilities/helpers';
import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
const { MessagingResponse } = require('twilio').twiml;
import db from '@/sequelize/models';
import Ably from 'ably/promises';
import { uploadFile } from '@/utilities/api/cloudStorage';

export async function POST(request: NextRequest) {
   try {
      const incomingMessageData: any = convertFormDataToJson(await request.formData());

      const phoneNumber = await getPhoneNumber(incomingMessageData?.To);

      const leadSourceId: string = getObjectProp(
         phoneNumber,
         ['leadSourcesOnPhoneNumber', 0, 'id'],
         'ce48eea4-e0d6-4bfc-ae33-c7d7f5643f4a' // TODO: Need to add admin page to handle choosing this fallback leadSource
      );

      const lead = await findOrCreateLead(incomingMessageData?.From, leadSourceId);

      const userId = getObjectProp(phoneNumber, ['usersOnPhoneNumber', 0, 'user', 'id']);

      if (!userId) {
         throw new LumError(400, 'Phone Number is not associated to a user');
      }

      const mmsUrls = await getMediaUrls({ messageData: incomingMessageData, lead });

      const newSmsLog = await createSmsLog({
         messageSid: incomingMessageData?.MessageSid,
         to: incomingMessageData?.To,
         from: incomingMessageData?.From,
         body: incomingMessageData?.Body,
         mmsUrls: mmsUrls,
         leadId: lead?.id,
         sentToUserId: userId,
      });
      const newAssociatedSmsLog = await getSmsLogWithAssociations(newSmsLog?.id);

      const client = new Ably.Realtime(`${process.env.ABLY_ROOT_KEY}`);
      const channel = client.channels.get(userId);
      await channel.publish({
         name: 'incoming-message',
         data: newAssociatedSmsLog,
      });

      const response = new MessagingResponse();
      const res = new NextResponse(response, { status: 200 });
      res.headers.set('Content-Type', 'text/xml');
      return res;
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function findOrCreateLead(fromNumber: string, leadSourceId: string) {
   try {
      if (!fromNumber) return [];

      // created = boolean, true = newly created, false = already created
      const [lead, created] = await db.leads
         .findOrCreate({
            where: { phoneNumber: fromNumber },
            defaults: { leadSourceId: leadSourceId },
            attributes: ['id', 'firstName', 'lastName', 'phoneNumber'],
         })
         .catch((err: any) => {
            throw new LumError(400, err.message);
         });

      return lead;
   } catch (err: any) {
      throw new LumError(400, err);
   }
}

async function getPhoneNumber(toNumber: string) {
   try {
      if (!toNumber) throw new LumError(400, `No 'To' number provided`);

      const phoneNumber = await db.phoneNumbers
         .findOne({
            where: { number: toNumber },
            include: [
               {
                  model: db.phoneNumbersOnUsers,
                  as: 'usersOnPhoneNumber',
                  required: false,
                  include: { model: db.users, required: false },
               },
               {
                  model: db.phoneNumbersOnLeadSources,
                  as: 'leadSourcesOnPhoneNumber',
                  required: false,
                  include: { model: db.leadSources, required: false },
               },
               {
                  model: db.phoneNumbersOnCallRoutes,
                  as: 'callRoutesOnPhoneNumber',
                  required: false,
                  include: {
                     model: db.callRoutes,
                     required: false,
                     include: {
                        model: db.actionsOnCallRoutes,
                        as: 'actionsOnCallRoute',
                        required: false,
                        include: { model: db.callRouteActionTypesLookup, as: 'type', required: false },
                     },
                  },
               },
               {
                  model: db.phoneNumberTypesLookup,
                  as: 'type',
                  attributes: ['id', 'name'],
               },
            ],
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      if (!phoneNumber) throw new LumError(404, `Phone Number, ${toNumber}, not found.`);

      return phoneNumber;
   } catch (err: any) {
      throw new LumError(400, err);
   }
}

async function getMediaUrls({ messageData, lead }: { messageData: any; lead: any }): Promise<Array<string>> {
   if (!messageData?.NumMedia || messageData.NumMedia < 1) return [];

   const promises = [];
   for (let i = 0; i < messageData.NumMedia; i++) {
      if (!!messageData[`MediaUrl${i}`]) {
         promises.push(
            handleMediaUploads({
               mediaUrl: messageData[`MediaUrl${i}`],
               index: i,
               messageSid: messageData.MessageSid,
               leadId: lead?.id,
            })
         );
      }
   }

   const mediaUrls: Array<string> = [];
   await Promise.allSettled(promises).then((results: any) => {
      return results.map((result: any) => {
         if (result.status === 'fulfilled') mediaUrls.push(result.value);
      });
   });

   return mediaUrls;
}

async function handleMediaUploads({
   mediaUrl,
   index,
   messageSid,
   leadId,
}: {
   mediaUrl: string;
   index: number;
   messageSid: string;
   leadId: string;
}) {
   const blob = await fetch(mediaUrl).then((res) => res.blob());
   const fileObject = {
      fileType: blob?.type,
      originalName: `Media_${index}`,
      fileNickName: `Media_${index}`,
      filePath: `leads/${leadId}/mms/incoming/${messageSid}_${index}`,
      buffer: Buffer.from(await blob.arrayBuffer()),
      cloudStorageError: null,
      cloudStorageObject: null,
   };

   return uploadFile(fileObject);
}

async function createSmsLog({ messageSid, to, from, body, mmsUrls, leadId, sentToUserId }: any) {
   try {
      return db.smsLogs
         .create({
            messageSid,
            to,
            from,
            body,
            direction: 'inbound',
            mmsUrls,
            leadId,
            sentToUserId,
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

// Message with body
// incomingMessageData: {
//    ToCountry: 'US',
//    ToState: 'ID',
//    SmsMessageSid: 'SMc2af2687164bb322b54bfd78663b11cb',
//    NumMedia: '0',
//    ToCity: 'DAYTON',
//    FromZip: '85003',
//    SmsSid: 'SMc2af2687164bb322b54bfd78663b11cb',
//    FromState: 'AZ',
//    SmsStatus: 'received',
//    FromCity: 'PHOENIX',
//    Body: '🌎 Hello World! 🌎 ',
//    FromCountry: 'US',
//    To: '+12087470863',
//    ToZip: '83232',
//    AddOns: '{"status":"successful","message":null,"code":null,"results":{}}',
//    NumSegments: '1',
//    MessageSid: 'SMc2af2687164bb322b54bfd78663b11cb',
//    AccountSid: 'AC5c1ae5f11732e97e64fc7acca2a06b6b',
//    From: '+14804146685',
//    ApiVersion: '2010-04-01'
// }

// Message with body and two images
// incomingMessageData: {
//    MediaContentType1: 'image/jpeg',
//    ToCountry: 'US',
//    MediaContentType0: 'image/jpeg',
//    ToState: 'ID',
//    SmsMessageSid: 'MM53e4054a7b4d554f4110cd99d1a40dda',
//    NumMedia: '2',
//    ToCity: 'DAYTON',
//    FromZip: '85003',
//    SmsSid: 'MM53e4054a7b4d554f4110cd99d1a40dda',
//    FromState: 'AZ',
//    SmsStatus: 'received',
//    FromCity: 'PHOENIX',
//    Body: 'Here you go!',
//    FromCountry: 'US',
//    To: '+12087470863',
//    MessagingServiceSid: 'MGa3ab781b075577715b3e57cccb4fe0d9',
//    MediaUrl1: 'https://api.twilio.com/2010-04-01/Accounts/AC5c1ae5f11732e97e64fc7acca2a06b6b/Messages/MM53e4054a7b4d554f4110cd99d1a40dda/Media/ME2bd65297d68a3665e93fda7070ec7892',
//    ToZip: '83232',
//    AddOns: '{"status":"successful","message":null,"code":null,"results":{}}',
//    NumSegments: '2',
//    MessageSid: 'MM53e4054a7b4d554f4110cd99d1a40dda',
//    AccountSid: 'AC5c1ae5f11732e97e64fc7acca2a06b6b',
//    From: '+14804146685',
//    MediaUrl0: 'https://api.twilio.com/2010-04-01/Accounts/AC5c1ae5f11732e97e64fc7acca2a06b6b/Messages/MM53e4054a7b4d554f4110cd99d1a40dda/Media/ME53354d35b8e68c8ee13a443ce79aea1f',
//    ApiVersion: '2010-04-01'
// }
