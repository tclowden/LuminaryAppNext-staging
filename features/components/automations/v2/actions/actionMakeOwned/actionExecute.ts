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
   const { selectedUser } = options;

   try {
      // Php action:
      // $user_id = ($action_to_execute['value']['manual_or_auto'] === 'automatic' ? $input_data['executor_id'] : AssignTask::get_decoded_user_id($action_to_execute['value']['manual_user_id']));
      // $this->Crud->change('UPDATE leads SET owner = ? WHERE lead_id = ?', array($user_id, $input_data['lead']));

      await db.leads.update(
         {
            ownerId: selectedUser?.id || executorId,
         },
         {
            where: {
               id: leadId,
            },
         }
      );

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
