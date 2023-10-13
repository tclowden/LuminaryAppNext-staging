'use server';
import { ActionProps } from './actionData';
import { AutomationActionExecutionType, AutomationExecutionResult } from '../actionsServer';
import db from '@/sequelize/models';
interface ExecutionProps extends ActionProps, AutomationActionExecutionType {}

export const execute = async ({
   leadId,
   orderId,
   executorId,
   prevValue,
   newValue,
   options,
}: ExecutionProps): Promise<AutomationExecutionResult> => {
   const {selectedProduct, selectedStage} = options;

   try {
      // Php action:
      // $this->Crud->change('UPDATE lead_products SET stage = ?, last_updated_by = 1234567 WHERE id = ?', array($action_to_execute['value'], $input_data['order']));
      // $ops_fire_back = new GCPTask('ops-flows', '/api/v1/fire/ops/flow/trigger/');
      // $ops_fire_back->fire(json_encode(array(
      //    'sent_value' => $action_to_execute['value'],
      //    'lead' => $input_data['lead'],
      //    'order' => $input_data['order'],
      //    'executor_id' => $input_data['executor_id'],
      //    'trigger' => 'stage_updated'
      // )));
      // $stage_name = $this->Crud->read('SELECT name FROM product_stages WHERE stage_id = ?', array($action_to_execute['value']), true);
      // $realtime = new Realtime($input_data['order'], $input_data['lead']);
      // $realtime->fire('order_'.$input_data['order'], 'stage_updated', array(
      //    'order' => $input_data['order'],
      //    'name' => $stage_name['name'],
      //    'stage_id' => $action_to_execute['value']
      // ));

      await db.orders.update({
         productStageId: options.selectedStage.id
      }, {
         where: {
            id: orderId,
         }
      })

      return {
         success: true,
         message: '',
         results: null,
         status: 'Failed',
      };
   } catch (error: any) {
      return {
         success: false,
         message: 'Error Updating Stage.',
         results: error.message,
      };
   }
};
