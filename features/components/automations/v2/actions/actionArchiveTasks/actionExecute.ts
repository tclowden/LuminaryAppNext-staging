'use server';
import { ActionProps } from './actionData';
import { AutomationActionExecutionType, AutomationExecutionResult } from '../actionsServer';
import db from '@/sequelize/models';
import { Op, or } from 'sequelize';

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

      // If an Order id is provided, then we destroy all the tasks on the single order
      if(!orderId) {

         const orders = await db.orders.findAll({
            where: { leadId: leadId },
            raw:true
         })   
         const orderIds = orders.map((order: any) => order.id)
         await db.tasksOnOrders.destroy(
            {
               where: {orderId: {[Op.in]: orderIds}},
            }
         );
      } else {
         await db.tasksOnOrders.destroy(
            {
               where: { orderId: {[Op.in]: orderId}},
            }
         );
      }

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
