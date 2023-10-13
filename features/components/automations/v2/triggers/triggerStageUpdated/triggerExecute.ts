'use server';
import { TriggerProps } from './triggerData';
import { AutomationTriggerExecutionType, AutomationExecutionResult } from '../triggersServer';
interface ExecutionProps extends TriggerProps, AutomationTriggerExecutionType {}

export const execute = async ({
   leadId,
   orderId,
   executorId,
   prevValue,
   newValue,
   options,
}: ExecutionProps): Promise<AutomationExecutionResult> => {
   const { selectedProduct, selectedStage } = options;

   try {
      if (selectedStage.id !== newValue) {
         throw new Error(`Stage is not the same`);
      }

      return {
         success: true,
         message: ``,
      };
   } catch (error: any) {
      return {
         success: false,
         message: error?.message || `Error triggering stage updated.`,
      };
   }
};
