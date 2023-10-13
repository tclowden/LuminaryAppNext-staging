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
   const { selectedProduct, selectedField, requiredStatus } = options;

   try {
      // Php action:
      // $required = ($action_to_execute['value']['required'] ? 1 : 0);
      // $this->Crud->change('UPDATE lead_product_input_value SET field_required = ? WHERE lead_product = ? AND input_field = ?', array($required, $input_data['order'], $action_to_execute['value']['field_to_change']));

      // TODO: make field required
      
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
