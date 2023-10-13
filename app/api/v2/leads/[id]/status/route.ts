import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';
import { RulesOnStatus } from './types';
import {
   humanAnsweredStatusRule,
   askAppointmentOutcomeStatusRule,
   hiddenStatusRule,
   triggerWebHookStatusRule,
   requireNoteStatusRule,
   bucketStatusRule,
   dollarPerLeadStatusRule,
   scheduledStatusRule,
   pipeStatusRule,
   doNotContactStatusRule,
   requireNumberOfCallsStatusRule,
   removeFromPipeStatusRule,
   hideIfContactedStatusRule,
   // You can add any other rule functions you have later...
} from './utils';

import { headers } from 'next/headers';

type StatusPayload = {
   userId: string;
   newStatus: {
      leadCount: string;
      id: string;
      name: string;
      rulesOnStatuses: object[];
   };
   oldStatus: {
      id: string;
      name: string;
      oldId: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: null | string;
      typeId: string;
   };
   leadId: string;
   rulesOnStatus: RulesOnStatus[];
   scheduledStatusDate: string;
   note: string;
   appointmentOutcome: string;
};

// update lead status and execute status rules
export async function PUT(request: NextRequest, params: { params: { id: string } }) {
   try {
      const headersList = headers();
      const userAuthToken = headersList.get('authorization')?.split(' ')[1];
      const body = await request.json();
      console.log('BODY: ', body);
      await updateAuditLog(body.newStatus, body.leadId, body.userId);

      await doStatusRules(body, userAuthToken);

      await updateStatus(body.newStatus.id, body.leadId);

      return NextResponse.json({ success: true });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
/***
 * if a statusRule is found on the status here, we execute each function mapped to the rule in the ruleFunctionMap
 */
const doStatusRules = (body: any, authToken: any) => {
   return new Promise(async (resolve, reject) => {
      try {
         const ruleFunctionsMap = {
            'Human Answered Status': humanAnsweredStatusRule,
            'Ask Appointment Outcome': askAppointmentOutcomeStatusRule,
            'Hidden Status': hiddenStatusRule,
            'Require Note': requireNoteStatusRule,
            'Bucket Status': bucketStatusRule,
            'Hide If Contacted': hideIfContactedStatusRule,
            'Dollar Per Lead Status': dollarPerLeadStatusRule,
            'Scheduled Status': scheduledStatusRule,
            'Pipe Status': pipeStatusRule,
            'Do Not Contact': doNotContactStatusRule,
            'Required Number of Calls': requireNumberOfCallsStatusRule,
            'Trigger Webhook': (body: any, authToken: any) => triggerWebHookStatusRule(body, authToken),
            'Remove From Pipe': removeFromPipeStatusRule,
         };

         type RuleKey = keyof typeof ruleFunctionsMap;

         const rulesOnStatus: RuleKey[] = body.rulesOnStatus;

         for (const rule of rulesOnStatus) {
            const ruleFunction = await ruleFunctionsMap[rule];
            if (typeof ruleFunction === 'function') {
               console.log(`${rule} RULE`);
               ruleFunction(body, authToken);
            } else {
               console.log(`No function mapped for rule: ${rule}`);
            }
         }

         resolve(true);
      } catch (err: any) {
         reject(err);
      }
   });
};

const updateStatus = (statusId: string, leadId: string) => {
   return new Promise(async (resolve, reject) => {
      try {
         await db.leads.update(
            {
               statusId: statusId,
            },
            {
               where: {
                  id: leadId,
               },
            }
         );
         resolve(true);
      } catch (err) {
         console.log(err);
         reject(err);
      }
   });
};

const updateAuditLog = async (newStatus: any, leadId: string, userId: string) => {
   return new Promise(async (resolve, reject) => {
      try {
         const oldStatus = await db.leads.findByPk(leadId, {
            attributes: [],
            include: [
               {
                  model: db.statuses,
                  as: 'status',
               },
            ],
         });

         await db.auditLogs.create({
            table: 'leads',
            rowId: leadId,
            originalValue: JSON.stringify({
               statusId: oldStatus.status.id,
               statusName: oldStatus.status.name,
            }),
            newValue: JSON.stringify({
               statusId: newStatus.id,
               statusName: newStatus.name,
               user: userId,
            }),
            modifiedById: userId,
         });
         resolve(true);
      } catch (err: any) {
         reject(err);
      }
   });
};

// Return status
export async function GET(request: NextRequest, params: { params: { id: string } }) {
   try {
      const status = await db.leads.findByPk(params.params.id, {
         attributes: [],
         include: [
            {
               model: db.statuses,
               as: 'status',
            },
         ],
      });

      return NextResponse.json(status, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
