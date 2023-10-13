import { TriggerNames } from '@/features/components/automations/v2/triggers/triggersServer';
import { triggerAutomationRun } from './triggerAutomationRun';

type TriggerAutomationType = {
   leadId: string;
   orderId: string | null;
   executorId: string | null;
   prevValue: string;
   newValue: string;
};

export const triggerAutomation = {
   /**
    * Trigger automations
    * @param trigger Trigger name
    * @param leadId Lead ID
    * @param executorId Id of user that fired this trigger
    * @param newValue New value
    * @param prevValue Old value
    * @param orderId Order ID
    * @returns
    */
   fire: async (trigger: TriggerNames, { leadId, executorId, orderId, newValue, prevValue }: TriggerAutomationType) => {
      console.log('Triggered:', trigger);
      // console.log('Triggered:', trigger, {
      //    leadID: leadId || 'null',
      //    executorId: executorId || 'null',
      //    orderId: orderId || 'null',
      //    newValue: newValue || 'null',
      //    prevValue: prevValue || 'null',
      // });
      await triggerAutomationRun({ trigger, leadId, orderId, executorId, newValue, prevValue });
      return { trigger };
   },
   devTest: async (
      trigger: TriggerNames,
      { leadId, executorId, orderId, newValue, prevValue }: TriggerAutomationType
   ) => {
      console.log('Triggered: DevTest:', `Trigger '${trigger}' would have fired with the following data:`);
      console.log(trigger, {
         leadID: leadId || 'null',
         executorId: executorId || 'null',
         orderId: orderId || 'null',
         newValue: newValue || 'null',
         prevValue: prevValue || 'null',
      });
      return { trigger };
   },
};
