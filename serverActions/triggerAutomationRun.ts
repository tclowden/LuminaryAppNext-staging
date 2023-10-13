'use server';

import { getAutomationTriggers } from '@/features/components/automations/v2/triggers/test';
import { TriggerNames } from '@/features/components/automations/v2/triggers/triggersServer';
import { fetchDbApi } from './fetchDbApi';

export async function triggerAutomationRun({
   trigger,
   leadId,
   orderId = null,
   executorId = null,
   newValue = '',
   prevValue = '',
}: {
   trigger: TriggerNames;
   leadId: string;
   orderId: string | null;
   executorId: string | null;
   newValue: string;
   prevValue: string;
}) {
   const foundTriggerData = await findTriggerData(trigger);
   // console.log('foundTriggerData', foundTriggerData);

   // get all automations from database that have this trigger
   const automationsWithTrigger = await queryAutomationsWithTrigger(trigger);
   // console.log('automationsWithTrigger', automationsWithTrigger);

   // Loop through all automations with this trigger
   automationsWithTrigger.forEach((automation: any) => {
      automation.triggers
         // filter out triggers that are not the current trigger
         .filter((trigger: any) => trigger.name !== trigger)
         .map(async (trigger: any) => {
            // Check if automation passes segment filter
            const segmentRun = async () => {
               if (!leadId) throw { success: false, message: 'No leadId provided' };
               return automation?.segmentId
                  ? await fetchDbApi(`/api/v2/segments/lead-in-segment`, {
                       method: 'POST',
                       body: JSON.stringify({
                          leadId: leadId,
                          segmentId: automation.segmentId,
                       }),
                    })
                       .then((res) => {
                          return { success: res?.count > 0 ? true : false };
                       })
                       .catch((err) => {
                          console.log('Segment filter Error', err);
                          throw { success: false, error: err };
                       })
                  : { success: true };
            };

            // Check if automation passes trigger filter
            const triggerRun = () =>
               foundTriggerData
                  ?.execute({ leadId, executorId, newValue, prevValue, options: trigger.options })
                  .then((result: any) => {
                     // create automation run
                     return result;
                  })
                  .catch((err: any) => {
                     console.log('error', err);
                     throw { success: false, error: err };
                  });

            const [segmentResult, triggerResult] = await Promise.all([segmentRun(), triggerRun()]).catch((err) => {
               console.log('Automation Trigger:', trigger.name, err);
               return [null, null];
            });
            // console.log('segmentResult', segmentResult);

            // Create automation run if automation passes segment and trigger filters
            if (segmentResult?.success && triggerResult?.success) {
               // console.log('triggerResult', triggerResult);
               const data = {
                  automationId: automation.id,
                  leadId: leadId || null,
                  orderId: orderId || null,
                  executorId: executorId || null,
                  trigger: trigger.name,
                  previousVal: prevValue,
                  newVal: newValue,
                  statusType: 'new',
                  actionData: automation.actions,
                  waitUntil: null,
               };

               const newAutomationRun = await fetchDbApi(`/api/v2/automations/runs`, {
                  method: 'POST',
                  body: JSON.stringify(data),
               })
                  .then((res) => {
                     // console.log('automation run created', res);
                     return res;
                  })
                  .catch((err) => {
                     console.log('Error creating automation run:', err);
                     return null;
                  });

               if (newAutomationRun && newAutomationRun?.id) {
                  fetchDbApi(`/api/v2/automations/runs/fire/${newAutomationRun.id}`, { method: 'PUT' })
                     .then((res) => {
                        console.log('Automation Completed', res);
                        // return res;
                     })
                     .catch((err) => {
                        console.log('Error auto running automation', err);
                        return null;
                     });
               }
            }
         });
   });
}

const findTriggerData = async (trigger: TriggerNames) => {
   const automationTriggers: {
      [key: string]: any;
   } = await getAutomationTriggers('server');

   // console.log('automationTriggers', automationTriggers);

   return Object.values(automationTriggers)
      .reduce((acc, val) => acc.concat(val), [])
      .find((a: any) => a.name === trigger);
};

const queryAutomationsWithTrigger = async (trigger: TriggerNames) => {
   return fetchDbApi(`/api/v2/automations/query?trigger=${trigger}`, { method: 'GET' })
      .then((res) => {
         return res;
      })
      .catch((err) => {
         console.log(err);
         return [];
      });
};
