import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { foreignKeysExists } from '../validators';
export const dynamic = 'force-dynamic';

// update a one-off task on order or update a taskOnOrder row that was created from a taskOnProduct row
async function updateTaskOnOrderByTaskId(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id || !options?.params?.taskOnOrderId) throw new LumError(400, `Invalid id in params`);
      const { id: orderId, taskOnOrderId } = options?.params;

      const reqBody = await request.json();
      const schema = Yup.object({
         // assigning users logic here
         assignTypeAnswer: Yup.object().nullable(),
         assignType: Yup.object({ name: Yup.string().required().nullable(), key: Yup.string().required() }).nullable(),

         // task on order other fields
         name: Yup.string().nullable(),
         taskOnProductId: Yup.string().nullable(),
         productTaskId: Yup.string().nullable(),
         assignedToId: Yup.string().nullable(),
         completedAt: Yup.date().nullable(),
         completed: Yup.boolean().nullable(),
         // createdById is nullable because in the migration, some tasks didn't have a createdById on it
         createdById: Yup.string().nullable(),
         updatedById: Yup.string().required(),
         dueAt: Yup.date().nullable(),
         description: Yup.string()
            .nullable()
            .when({
               is: (value: any) => typeof value === 'string',
               then: (schema: any) => {
                  return Yup.string().test(
                     'non-empty-string',
                     'Description length must be greater than 0 characters',
                     (value: any) => {
                        if (value?.length > 0) return true;
                        else return false;
                     }
                  );
               },
            }),
      });
      await schema.validate(reqBody);

      await foreignKeysExists(reqBody);

      // conditionals
      // const roundRobinRoles =
      //    reqBody?.assignType && reqBody?.assignType?.roundRobin && reqBody?.assignType?.key === 'role';
      // const randomRoles =
      //    reqBody?.assignType && !reqBody?.assignType?.roundRobin && reqBody?.assignType?.key === 'role';
      const clientSelectedUser =
         reqBody?.assignType &&
         !reqBody?.assignType?.roundRobin &&
         (reqBody?.assignType?.key === 'user' ||
            reqBody?.assignType?.key === 'me' ||
            reqBody?.assignType?.key === 'agent');

      if (clientSelectedUser) {
         reqBody['assignedToId'] = reqBody?.assignTypeAnswer?.id;
      }

      await db.tasksOnOrders.update(reqBody, { where: { id: taskOnOrderId } });

      return NextResponse.json('response here', { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { updateTaskOnOrderByTaskId as PUT };
