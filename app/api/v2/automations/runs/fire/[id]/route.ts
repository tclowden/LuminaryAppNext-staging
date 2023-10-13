import db from '@/sequelize/models';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import { getAutomationActions } from '@/features/components/automations/v2/actions/test';
import { stat } from 'fs';

async function getAutomationRunById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const automation = await db.automationRuns
         .findByPk(id, {
            include: [],
            order: [['createdAt', 'DESC']],
         })
         .then(deepCopy);

      return NextResponse.json(automation, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/automations/runs/fire/[id] -> GET -> Error', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function asyncMap(arr: any, actions: any, automation: any): Promise<any[]> {
   const results = [];

   let breakMap: boolean = false;
   let status: string = 'success';
   let waitUntil: Date | undefined | null;

   let updatedAction;

   for (const action of arr) {
      // console.log();
      // console.log('Start action:', action.name, action.options);

      // short circuit if an action failed ir skip if the action already succeeded
      if (breakMap || (action.success === true && action.status !== 'Waiting')) {
         results.push(action);
         continue;
      }
      // console.log('action Execute:', action);

      // run the action
      updatedAction = {
         ...action,
         ...(await actions[action.name]?.execute({
            leadId: automation.leadId,
            orderId: automation.orderId,
            executorId: automation.executorId,
            prevValue: automation.previousVal,
            newValue: automation.newVal,
            options: action.options,
            prevResults: action?.results,
         })),
      };

      // console.log('updatedAction:', updatedAction);

      // provide specific handling for select actions
      switch (action.name) {
         case 'wait':
            if (updatedAction?.status === 'Waiting') {
               breakMap = true;
               status = 'waiting';
               waitUntil = updatedAction.results;
            }
            break;
         case 'filter':
            if (updatedAction?.status === 'Filtered') {
               breakMap = true;
               status = 'success - filtered';
            }
            break;
         default:
            break;
      }

      // if action failed then break the map
      if (updatedAction.success === false) {
         breakMap = true;
         status = 'failed';
      }

      // console.log('End Action:', action.name);

      results.push(updatedAction);
   }

   return [results, status, waitUntil];
}

async function fireAutomationRunById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      // Get the automation run data
      const automation = await db.automationRuns
         .findByPk(id, {
            include: [],
            order: [['createdAt', 'DESC']],
         })
         .then(deepCopy);
      if (!automation) throw new LumError(404, `Automation run not found`);

      // Get the automation actions and their associated modules
      const actions = await getAutomationActions('server');

      // console.log('actions:', actions);

      // update the automation in the db with running status
      await db.automationRuns.update({ statusType: 'running' }, { where: { id: automation.id } });

      const [automationRunResult, status, waitUntil] = await asyncMap(automation.actionData, actions, automation);

      // console.log('automationActions:', automation?.actionData);
      // console.log('automationRunResult:', automationRunResult);

      // update the automation in the db with success or failed status
      status &&
         (await db.automationRuns.update(
            { statusType: status, actionData: automationRunResult, waitUntil: waitUntil },
            { where: { id: automation.id } }
         ));

      // console.log(automationRunResult);

      // let breakMap: boolean = false;

      // const actionResults = automation.actionData?.map(async (action: any) => {
      //    // short circuit if an action failed
      //    if (breakMap) return action;

      //    console.log('breakMap:', breakMap);

      //    // run the action
      //    action = {
      //       ...action,
      //       ...(await actions[action.name]?.execute({
      //          leadId: automation.leadId,
      //          orderId: automation.orderId,
      //          executorId: automation.executorId,
      //          prevValue: automation.previousVal,
      //          newValue: automation.newVal,
      //          options: action.options,
      //       })),
      //    };

      //    // provide specific handling for select actions
      //    switch (action.name) {
      //       case 'wait':
      //          if (!automation.waitUntil) {
      //             automation.waitUntil = action.results;
      //             await db.automationRuns.update({ waitUntil: action.results }, { where: { id: automation.id } });
      //             breakMap = true;
      //          }
      //          break;
      //       default:
      //          break;
      //    }

      //    // if action failed then break the map
      //    if (action.success === false) breakMap = true;

      //    return action;
      // });

      // const automationRunResult = await Promise.all(actionResults);

      // console.log(automationRunResult);

      // console.log('module:', await module.execute({ options: { days:1, hours:2, minutes:3 } }));

      // console.log(test);
      // console.log(await test['wait'].execute({ options: { days: 1, hours: 2, minutes: 3 } }));

      // const test = 'test'

      // Example usage:
      // const myAutomation = new Automation();
      // console.log('myWorkflow:', myAutomation);

      // myWorkflow.addAction(statusUpdateAction);
      // myWorkflow.addAction(stageUpdateAction);
      // myWorkflow.addAction(teamScheduledAction);

      // // Add event listeners for triggers
      // eventDispatcher.addEventListener(WorkflowEventType.StatusUpdated, (event: StatusUpdateEvent) => {
      //    console.log(`Status updated: Task ${event.taskId} - New status: ${event.newStatus}`);
      // });

      // eventDispatcher.addEventListener(WorkflowEventType.StageUpdated, (event: StageUpdateEvent) => {
      //    console.log(`Stage updated: Task ${event.taskId} - New stage: ${event.newStage}`);
      // });

      // eventDispatcher.addEventListener(WorkflowEventType.TeamScheduled, (event: TeamScheduledEvent) => {
      //    console.log(
      //       `Team scheduled: Task ${event.taskId} - Team member: ${event.teamMember} - Scheduled time: ${event.scheduledTime}`
      //    );
      // });

      // myWorkflow.execute().then(() => {
      //    console.log('Workflow completed');
      // });

      // const reqBody = await request.json();
      // const schema = Yup.object({});
      // await schema.validate(reqBody);

      // if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      // const { id } = options?.params;

      // delete the id out of the obj, don't want to rewrite the id...
      // if (reqBody?.id) delete reqBody['id'];

      // const updatedAutomationRun = await db.automationRuns
      // .update(reqBody, { where: { id: id }, returning: true })
      // .then((res: any) => res[1][0] || res[1] || res);

      return NextResponse.json({ status, automationRunResult }, { status: 200 });
      // return NextResponse.json('test', { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/automations/runs/fire/[id] -> PUT -> Error', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { fireAutomationRunById as PUT };

// export { getAutomationRunById as GET };
