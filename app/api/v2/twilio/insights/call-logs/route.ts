import { NextResponse } from 'next/server';
const twilio = require('twilio');
// https://www.twilio.com/docs/voice/api/call-resource

/***
 * @param startDate (Date) Fetch calls made on or after this date.
 * @param direction (String) Fetch calls based on the direction. Possible values: inbound, outbound-api (calls initiated via the API), outbound-dial (calls initialed via dial verb)
 * @param endDate: (Date) Fetch calls made on or before this date.
 * @param from: (String) Fetch calls made from this specific phone number or client.
 * @param to: (String) Fetch calls made to this specific phone number or client.
 * @param status: (String) Fetch calls with a specific status. Possible values:
 * @param limit: (Number) Limits the number of calls fetched. Maximum of 1000 per API request.
 * @param pageSize: (Number) Number of records to return per page. Used for pagination.
 * @param page: (Number) For paginating through large record sets. Zero-indexed so the first page is
 * @param startTimeBefore: (Date) Fetch calls that started before this time.
 * @param startTimeAfter: (Date) Fetch calls that started after this time.
 *
 * @param parentCallSid: (String) Fetch calls that are children of the specified call SID.
 * @param forwardedFrom: (String) Fetch calls forwarded from this specific number.
 */

type statusOptions = 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed' | 'no-answer' | 'canceled';
type directionOptions = 'inbound' | 'outbound-dial' | 'outbound-api';

type TwilioQuery = {
   startDate?: Date;
   endDate?: Date;
   startTimeBefore?: Date;
   startTimeAfter?: Date;
   direction?: directionOptions;
   to?: string;
   from?: string;
   status?: statusOptions;
   limit?: number;
   pageSize?: number;
};

const getTwilioClient = () => {
   const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
   const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
   return new twilio(twilioAccountSid, twilioAuthToken);
};

const getValidatedRequestParams = (payload: TwilioQuery): TwilioQuery => {
   let params: TwilioQuery = {};

   if (payload.from && typeof payload.from === 'string') {
      params.from = payload.from;
   }

   if (payload.direction && ['inbound', 'outbound-dial', 'outbound-api'].includes(payload.direction)) {
      params.direction = payload.direction;
   }

   if (
      payload.status &&
      ['queued', 'ringing', 'in-progress', 'completed', 'busy', 'failed', 'no-answer', 'canceled'].includes(
         payload.status
      )
   ) {
      params.status = payload.status;
   }

   if (payload.startDate && payload.startDate instanceof Date) {
      params.startDate = payload.startDate;
   }

   if (payload.endDate && payload.endDate instanceof Date) {
      params.endDate = payload.endDate;
   }

   if (payload.startTimeBefore && payload.startTimeBefore instanceof Date) {
      params.startTimeBefore = payload.startTimeBefore;
   }

   if (payload.startTimeAfter && payload.startTimeAfter instanceof Date) {
      params.startTimeAfter = payload.startTimeAfter;
   }

   if (payload.to && typeof payload.to === 'string') {
      params.to = payload.to;
   }

   if (payload.limit && typeof payload.limit === 'number' && payload.limit <= 1000) {
      params.limit = payload.limit;
   }

   if (payload.pageSize && typeof payload.pageSize === 'number') {
      params.pageSize = payload.pageSize;
   }

   return params;
};

export async function POST(request: Request) {
   try {
      // Get the body of the request
      const reqData = await request.json();

      // format the params
      const params: TwilioQuery = getValidatedRequestParams(reqData);

      // get a client
      const client = getTwilioClient();

      // make the quey
      const calls = await client.calls.list(params);

      // let callLogs = calls.map((call: any) => {
      //    return {
      //       call: call,
      //    };
      // });

      return NextResponse.json({ success: true, data: calls, count: calls.length });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err.message);
   }
}
