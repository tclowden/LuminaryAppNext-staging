import { AutomationTriggerType } from './triggers';
import { getAutomationTriggers } from './test';

import { triggerAssignedStatus } from './triggerAssignedStatus';
import { triggerAssignedStatusType } from './triggerAssignedStatusType';
import { triggerFieldUpdated } from './triggerFieldUpdated';
import { triggerOrderCreated } from './triggerOrderCreated';
import { triggerInboundWebhook } from './triggerInboundWebhook';
import { triggerLeadCreated } from './triggerLeadCreated';
import { triggerStageUpdated } from './triggerStageUpdated';
import { triggerTaskCompleted } from './triggerTaskCompleted';
import { triggerTeamScheduled } from './triggerTeamScheduled';
import { triggerTaskPastDue } from './triggerTaskPastDue';

// TODO: Make this dynamic and automatically import all triggers

// Triggers are grouped by type
const triggersByType: Record<string, AutomationTriggerType[]> = {
   marketing: [triggerAssignedStatus, triggerAssignedStatusType, triggerLeadCreated],
   // notification: [
   // ],
   operations: [
      triggerFieldUpdated,
      triggerOrderCreated,
      triggerStageUpdated,
      triggerTaskCompleted,
      triggerTaskPastDue,
      triggerTeamScheduled,
   ],
   workflow: [triggerInboundWebhook],
};

// getAutomationTriggers('client').then(async (res) => {
//    // console.log('res', res)

//    const data: any = {};

//    await res.imports.forEach(async (folder: string) => {
//       const triggerData = await import(`@/features/components/automations/v2/triggers/${folder}/triggerData`).then(
//          (module) => module
//       );

//       if (!triggerData.default?.hidden) {
//          const triggerModal = await import(`@/features/components/automations/v2/triggers/${folder}/triggerModal`).then(
//             (module) => module
//          );
//          //  Get the trigger tile
//          const triggerTile = await import(`@/features/components/automations/v2/triggers/${folder}/triggerTile`).then(
//             (module) => module
//          );

//          // console.log('triggerModal:', triggersByType);

//          await triggerData.default?.types?.forEach((type: string) => {
//             // console.log('type:', type);
//             triggersByType[type] = triggersByType[type] || [];
//             triggersByType[type].push({
//                ...triggerData.default,
//                Modal: triggerModal.default,
//                Tile: triggerTile.default,
//             });
//          });
//       }

//       // console.log('data:', data);
//    });
// });

// Sort triggers alphabetically and remove hidden triggers
const sortTriggers = (triggers: AutomationTriggerType[]) =>
   triggers.filter((trigger) => !trigger?.hidden).sort((a, b) => a.prettyName.localeCompare(b.prettyName));

// Sort triggers by type
const automationTriggers: Record<string, AutomationTriggerType[]> = {};
for (const [type, triggers] of Object.entries(triggersByType)) {
   automationTriggers[type] = sortTriggers(triggers);
}

export default automationTriggers;
