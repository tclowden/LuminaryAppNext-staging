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
   const {} = options;

   try {
      // Php action:
      // $this->Crud->change('UPDATE lead_product_input_value SET input_value = ?, updated_by = 1234567 WHERE lead_product = ? AND input_field = ?', array($action_to_execute['value']['new_value'], $input_data['order'], $action_to_execute['value']['field_to_change']));
      // $ops_fire_back = new GCPTask('ops-flows', '/api/v1/fire/ops/flow/trigger/');
      // $ops_fire_back->fire(json_encode(array(
      //    'sent_value' => $action_to_execute['value']['new_value'],
      //    'lead' => $input_data['lead'],
      //    'order' => $input_data['order'],
      //    'executor_id' => $input_data['executor_id'],
      //    'trigger' => 'field_updated'
      // )));

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
