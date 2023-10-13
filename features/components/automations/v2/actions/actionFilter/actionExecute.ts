'use server';
import db from '@/sequelize/models';
import { Op } from 'sequelize';
import { ActionProps } from './actionData';
import { AutomationActionExecutionType, AutomationExecutionResult } from '../actionsServer';
import { buildWhereCondition } from '@/app/api/v2/segments/utils';

interface ExecutionProps extends ActionProps, AutomationActionExecutionType {}

export const execute = async ({
   leadId,
   orderId,
   executorId,
   prevValue,
   newValue,
   options,
}: ExecutionProps): Promise<AutomationExecutionResult> => {
   const { filterData } = options;

   try {
      const whereCondition = await buildWhereCondition(filterData);

      const results = await db.leads.findAndCountAll({
         attributes: ['id', 'firstName', 'lastName', 'fullName', 'phoneNumber', 'createdAt'],
         where: {
            [Op.and]: [{ ...whereCondition }, { id: leadId }],
         },
      });

      if (results.count !== 0) {
         return {
            success: true,
            message: `Found matches`,
            results: results,
            status: 'Success',
         };
      } else {
         return {
            success: true,
            message: `No matches found`,
            results: results,
            status: 'Filtered',
         };
      }
   } catch (error: any) {
      return {
         success: false,
         message: `Error running filter.`,
         results: error.message,
         status: 'Failed',
      };
   }
};
