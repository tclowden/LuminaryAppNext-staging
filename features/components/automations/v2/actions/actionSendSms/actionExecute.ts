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
   const { smsRecipientType, selectedProduct, selectedCoordinatorRole, selectedRole, selectedUser, toSms, message } =
      options;

   try {
      // Php action:
      // $lead_data = $this->Crud->read('SELECT phone_number, lead_id FROM leads WHERE lead_id = ?', array($input_data['lead']), true);

      // if (empty($lead_data)) {
      //    // this lead no longer exists
      //    error_log('lead_data was empty');
      //    exit;
      // }

      // if ($action_to_execute['value']['template_or_text'] === 'template') {
      //    $template_returned = $this->Crud->read('SELECT sms_body FROM marketing_sms WHERE sms_id = ?', array($action_to_execute['value']['template_id']), true);
      //    $message = EmailTarget::clean_non_body($template_returned['sms_body']);
      // } else {
      //    $message = EmailTarget::clean_non_body($action_to_execute['value']['message']);
      // }

      // $text = new SendText($lead_data['phone_number'], $message, $lead_data['lead_id'], true, null);
      // $text->send();

      // TODO: send sms

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
