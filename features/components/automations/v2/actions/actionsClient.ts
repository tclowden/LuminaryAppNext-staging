import { AutomationActionType } from './actions';
import { getAutomationActions } from './test';

import { actionWait } from './actionWait';
import { actionArchiveTasks } from './actionArchiveTasks';
import { actionAssignCoordinator } from './actionAssignCoordinator';
import { actionAssignTask } from './actionAssignTask';
import { actionConditional } from './actionConditional';
import { actionMakeFieldHidden } from './actionMakeFieldHidden';
import { actionMakeFieldRequired } from './actionMakeFieldRequired';
import { actionSendEmail } from './actionSendEmail';
import { actionSendSms } from './actionSendSms';
import { actionMakeOwned } from './actionMakeOwned';
import { actionRemoveOwner } from './actionRemoveOwner';
import { actionSendToWebhook } from './actionSendToWebhook';
import { actionUpdateField } from './actionUpdateField';
import { actionUpdateStage } from './actionUpdateStage';
import { actionFilter } from './actionFilter';

// TODO: Make this dynamic and automatically import all actions

// Actions are grouped by type
const actionsByType: Record<string, AutomationActionType[]> = {
   marketing: [actionMakeOwned, actionRemoveOwner],
   notification: [actionSendEmail, actionSendSms, actionSendToWebhook],
   operations: [
      actionArchiveTasks,
      actionAssignCoordinator,
      actionAssignTask,
      actionMakeFieldHidden,
      actionMakeFieldRequired,
      actionUpdateField,
      actionUpdateStage,
   ],
   workflow: [actionConditional, actionWait, actionFilter],
};

// getAutomationActions('client').then(async (res) => {
//    // console.log('res', res)

//    const data: any = {};

//    await res.imports.forEach(async (folder: string) => {
//       const actionData = await import(`@/features/components/automations/v2/actions/${folder}/actionData`).then(
//          (module) => module
//       );

//       if (!actionData.default?.hidden) {
//          const actionModal = await import(`@/features/components/automations/v2/actions/${folder}/actionModal`).then(
//             (module) => module
//          );
//          //  Get the action tile
//          const actionTile = await import(`@/features/components/automations/v2/actions/${folder}/actionTile`).then(
//             (module) => module
//          );

//          // console.log('actionModal:', actionsByType);

//          await actionData.default?.types?.forEach((type: string) => {
//             // console.log('type:', type);
//             actionsByType[type] = actionsByType[type] || [];
//             actionsByType[type].push({
//                ...actionData.default,
//                Modal: actionModal.default,
//                Tile: actionTile.default,
//             });
//          });
//       }

//       // console.log('data:', data);
//    });
// });

// Sort actions alphabetically and remove hidden actions
const sortActions = (actions: AutomationActionType[]) =>
   actions.filter((action) => !action?.hidden).sort((a, b) => a.prettyName.localeCompare(b.prettyName));

// Sort actions by type
const automationActions: Record<string, AutomationActionType[]> = {};
for (const [type, actions] of Object.entries(actionsByType)) {
   automationActions[type] = sortActions(actions);
}

export default automationActions;
