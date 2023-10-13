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
   try {
      if (!options.selectedStatus || (options?.selectedStatus?.id && options.selectedStatus.id === newValue)) {
         console.log(`Status selected.`);
      } else {
         throw new Error(`Status not selected.`);
      }
      return {
         success: true,
         message: ``,
      };
   } catch (error: any) {
      return {
         success: false,
         message: error?.message || `Error triggering assigned status.`,
      };
   }
};
