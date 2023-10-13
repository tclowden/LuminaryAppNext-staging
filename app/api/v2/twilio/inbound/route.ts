import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { convertFormDataToJson, getObjectProp, removeStringDuplicatesFromArray } from '@/utilities/helpers';
import { actionsQueue } from '@/workers/queue.worker';
import { kv } from '@vercel/kv';
const VoiceResponse = require('twilio').twiml.VoiceResponse;
import Ably from 'ably/promises';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
   try {
      const inboundCallData: any = convertFormDataToJson(await request.formData());

      const baseUrl = process.env.NODE_ENV === 'development' ? process.env.NGROK_ROOT_URL : process.env.CLIENT_SITE;

      const client = new Ably.Realtime(`${process.env.ABLY_ROOT_KEY}`);
      const response = new VoiceResponse();

      const isBlackListed = await checkBlackListedNumbers(inboundCallData?.From);
      if (isBlackListed) return response.reject();

      // ENQUEUE THE CALL
      response.enqueue(
         {
            action: `${baseUrl}/api/v2/twilio/callbacks/queue-status-call`,
            method: 'POST',
            // waitUrl: `http://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHAMP-Borghestral.mp3`,
            // waitUrlMethod: 'POST',
         },
         'inbound-call-queue'
      );

      // Return the phone number type, and the associated user or lead source
      const phoneNumber = await getPhoneNumber(inboundCallData?.To);

      // if there is a lead source id attached to the called phone number, else inbound call lead source.
      const leadSourceId: string = getObjectProp(
         phoneNumber,
         ['leadSourcesOnPhoneNumber', 0, 'leadSourceId'],
         'ce48eea4-e0d6-4bfc-ae33-c7d7f5643f4a' // TODO: Need to add admin page to handle choosing this fallback leadSource
      );

      const lead = await findOrCreateLead(inboundCallData?.From, leadSourceId);

      // If lead has a status used in a call route, then proceed with that status' call route actions. This currently takes TOP PRIORITY
      if (getObjectProp(lead, ['status', 'callRoutes', 'length'])) {
         const actionsOnCallRoute = [...getObjectProp(lead.status.callRoutes, [0, 'actionsOnCallRoute'], [])].sort(
            (a, b) => a.displayOrder - b.displayOrder
         );

         await addActionsToQueue(inboundCallData, lead, actionsOnCallRoute);

         await storeCallData(
            lead?.id,
            getObjectProp(phoneNumber, ['usersOnPhoneNumber', 0, 'user', 'id']),
            inboundCallData
         );

         const res = new NextResponse(response, { status: 200 });
         res.headers.set('Content-Type', 'text/xml');
         return res;
      }

      const dialedPhoneNumberType = getObjectProp(phoneNumber, ['type', 'name']);

      switch (dialedPhoneNumberType) {
         // lead has called a direct line to an agent
         case 'User':
            const userId = getObjectProp(phoneNumber, ['usersOnPhoneNumber', 0, 'user', 'id']);
            if (!userId) throw new LumError(400, 'No user id was found associated with callee phone number');
            const user = await db.users.findByPk(userId);
            if (!user) throw new LumError(400, 'Callee user does not exist');

            const channel = client.channels.get(userId);
            await channel.publish({
               name: 'incoming-call',
               data: {
                  incomingCall: inboundCallData,
                  lead: {
                     id: lead?.id,
                     firstName: lead?.firstName,
                     lastName: lead?.lastName,
                  },
                  notifiedChannels: [user?.id],
               },
            });
            await setCallSidAndChannelsInRedis(inboundCallData.CallSid, [user?.id]);
            break;
         // lead has called a lead source number
         case 'Lead Source':
            const callRoutesOnPhoneNumber = getObjectProp(phoneNumber, ['callRoutesOnPhoneNumber']);
            if (callRoutesOnPhoneNumber?.length) {
               const actionsOnCallRoute = [
                  ...getObjectProp(callRoutesOnPhoneNumber, [0, 'callRoute', 'actionsOnCallRoute'], []),
               ].sort((a, b) => a.displayOrder - b.displayOrder);

               await addActionsToQueue(inboundCallData, lead, actionsOnCallRoute);
            }
            break;
         case 'Unassigned':
            console.log('\n*** unassigned');
            if (phoneNumber?.callRoutesOnPhoneNumber?.length) {
            }
            throw new Error('Call Route not implemented yet');
         case 'Local Presence':
            throw new Error('Call Route not implemented yet');
         default:
            throw new Error('Unhandled phone number type');
      }

      await storeCallData(
         lead?.id,
         getObjectProp(phoneNumber, ['usersOnPhoneNumber', 0, 'user', 'id']),
         inboundCallData
      );

      const res = new NextResponse(response, { status: 200 });
      res.headers.set('Content-Type', 'text/xml');
      return res;
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function checkBlackListedNumbers(fromNumber: string) {
   const blackListedNumbersArray = ['+12813308004'];
   return blackListedNumbersArray.includes(fromNumber);
}

// Return the phone number type, and the associated user or lead source
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

async function findOrCreateLead(fromNumber: string, leadSourceId: string): Promise<any> {
   try {
      if (!fromNumber) return;
      const last10CharsOfPhone = fromNumber.slice(-10);
      const existingLead = await db.leads.findOne({
         where: {
            // Using Sequelize.literal to inject raw SQL
            phoneNumber: db.Sequelize.literal(`RIGHT("phoneNumber", 10) = '${last10CharsOfPhone}'`),
         },
         attributes: ['id', 'firstName', 'lastName'],
         include: [
            {
               model: db.statuses,
               as: 'status',
               attributes: ['id', 'name'],
               required: false,
               include: {
                  model: db.callRoutes,
                  as: 'callRoutes',
                  required: false,
                  include: {
                     model: db.actionsOnCallRoutes,
                     as: 'actionsOnCallRoute',
                     required: false,
                     include: { model: db.callRouteActionTypesLookup, as: 'type', required: false },
                  },
               },
            },
         ],
      });

      if (existingLead) return existingLead;

      const newLead = await db.leads.create({ leadSourceId, phoneNumber: fromNumber });
      return newLead;
   } catch (err: any) {
      throw new LumError(400, err);
   }
}

async function storeCallData(leadId: string, userId: string, payload: any) {
   try {
      return await db.callLogs
         .create({
            leadId: leadId,
            userId: userId,
            sid: payload?.CallSid,
            from: payload?.From,
            to: payload?.To,
            callStatus: payload?.CallStatus,
            direction: payload?.Direction,
         })
         .catch((err: any) => console.log('err: ', err));
   } catch (err: any) {
      throw new LumError(400, err);
   }
}

async function addActionsToQueue(incomingCall: any, lead: any, actions: Array<any>) {
   try {
      const notifiedChannels = getNotifiedUserAndRoleIds(actions);
      await setCallSidAndChannelsInRedis(incomingCall.CallSid, notifiedChannels);
      const actionJobs = [];
      let delaySum = 0;
      for (const action of actions) {
         delaySum += action.waitSeconds * 1000;
         actionJobs.push({
            name: getObjectProp(action, ['type', 'name']),
            data: {
               incomingCall,
               lead: { id: lead?.id, firstName: lead?.firstName, lastName: lead?.lastName },
               notifiedChannels,
               action,
            },
            opts: { delay: delaySum },
         });
      }

      await actionsQueue.addBulk(actionJobs);
   } catch (err: any) {
      throw new LumError(400, err);
   }
}

function getNotifiedUserAndRoleIds(actions: Array<any>) {
   let channelIds: Array<string> = [];
   actions.forEach((action) => {
      if (action?.userIdsToDial?.length) {
         channelIds = [...channelIds, ...action.userIdsToDial];
      }
      if (action?.roleIdsToDial?.length) {
         channelIds = [...channelIds, ...action.roleIdsToDial];
      }
   });
   return removeStringDuplicatesFromArray(channelIds);
}

function setCallSidAndChannelsInRedis(callSid: string, notifiedChannels: Array<string>) {
   return kv.setex(`${callSid}`, 3600, notifiedChannels);
}
