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
   const {} = options;

   try {
      // Php action:
      // $this->Crud->change('UPDATE leads SET owner = NULL WHERE lead_id = ?', array($input_data['lead']));
      await db.leads.update({
         ownerId: null
      }, {
         where: {
            id: leadId
         }
      })
      
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
