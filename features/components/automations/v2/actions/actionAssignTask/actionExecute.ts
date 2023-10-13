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
}: ExecutionProps): Promise<AutomationExecutionResult> => {
   const { selectedProduct, selectedTask, howToAssign, selectedCoordinatorRole, selectedRole, selectedUser } = options;

   try {
      // Php action:
      // $build_task = new AssignTask($action_to_execute, $input_data['order'], $input_data['lead'], $input_data['executor_id']);
      // $build_task->set_task_details($this->Crud);
      // $build_task->set_task_assignee($this->Crud);
      // $task_id = $build_task->assign($this->Crud); // -1 means it should be skipped
      // if($task_id !== -1){
      //    $task_assignee_name = $this->Crud->read('SELECT CONCAT(first_name, " ", last_name) as full_name FROM users WHERE user_id = ?', array($build_task->task_assignee), true);
      //    $realtime = new Realtime($input_data['order'], $input_data['lead']);
      //    $realtime->fire('order_'.$input_data['order'], 'task', array(
      //       'order' => $input_data['order'],
      //       'lead' => $input_data['lead'],
      //       'assigned_to' => $build_task->task_assignee,
      //       'assigned_to_name' => $task_assignee_name['full_name'],
      //       'name' => $build_task->task_name,
      //       'description' => $build_task->task_description,
      //       // This needs to be here because time() returns a timezone indepenent time...so we need to adjust it by our chosen offset.
      //       // We do central time, but right now we do the daylight savings...so we need the offset to either be 18000 seconds or 21600 seconds
      //       'task_due' => $build_task->realtime_date,#date('m/d/y g:i a', ((time() + (($build_task->hour_offset * 60) * 60)) - (date('I') == '1' ? 18000 : 21600))),
      //       'task_id' => $task_id
      //    ));
      // }

      // TODO

      return {
         success: true,
         message: ``,
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
