'use server';
import { ActionProps } from './actionData';
import { AutomationActionExecutionType, AutomationExecutionResult } from '../actionsServer';
import db from '@/sequelize/models';
import { co } from '@fullcalendar/core/internal-common';
interface ExecutionProps extends ActionProps, AutomationActionExecutionType {}

export const execute = async ({
   leadId,
   orderId,
   executorId,
   prevValue,
   newValue,
   options,
}: ExecutionProps): Promise<AutomationExecutionResult> => {
   const { webhookName, webhookUrl, webhookDescription } = options;

   try {
      // get all lead data from db
      // Add anything we want here
      const leadData = await db.leads.findOne({
         where: {
            id: leadId,
         },
         raw: true,
      });

      // send data to webhook
      if (leadData) {
         fetch(webhookUrl, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               ...leadData,
            }),
         });
      } else {
         throw new Error('No lead data found');
      }

      return {
         success: true,
         message: `Data set to: ${webhookName}`,
         results: null,
      };
   } catch (error: any) {
      return {
         success: false,
         message: `Error`,
         results: error.message,
         status: 'Failed',
      };
   }
};
