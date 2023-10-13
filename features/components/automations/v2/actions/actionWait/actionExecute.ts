'use server';
import { ActionProps } from './actionData';
import { AutomationActionExecutionType, AutomationExecutionResult } from '../actionsServer';
interface ExecutionProps extends ActionProps, AutomationActionExecutionType {}

export const execute = async ({
   leadId,
   orderId,
   executorId,
   prevValue,
   newValue,
   options,
   prevResults,
}: ExecutionProps): Promise<AutomationExecutionResult> => {
   const { days, hours, minutes } = options;

   const msInDay = 24 * 60 * 60 * 1000;
   const msInHour = 60 * 60 * 1000;
   const msInMinute = 60 * 1000;

   try {
      const currentDate = new Date();
      let waitUntil: Date;

      if (prevResults) {
         waitUntil = new Date(prevResults);
      } else {
         waitUntil = new Date(currentDate.getTime() + days * msInDay + hours * msInHour + minutes * msInMinute);
      }

      if (waitUntil.getTime() < currentDate.getTime()) {
         console.log('Done waiting');
         return {
            success: true,
            message: `Wait time has passed.`,
            results: waitUntil,
            status: 'Success',
         };
      } else {
         console.log(`Waiting until ${waitUntil}`);
         return {
            success: true,
            message: `Waiting until ${waitUntil}`,
            results: waitUntil,
            status: 'Waiting',
         };
      }
   } catch (error: any) {
      return {
         success: false,
         message: `Error setting wait.`,
         results: error.message,
         status: 'Failed',
      };
   }
};
