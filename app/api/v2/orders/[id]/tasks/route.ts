import db from '@/sequelize/models';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import { Sequelize } from 'sequelize';
import * as Yup from 'yup';
import { foreignKeysExists } from './validators';
export const dynamic = 'force-dynamic';

// Create a one off task on order or create a task on order from a taskOnProduct row
async function createTaskOnOrder(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const reqBody = await request.json();
      const schema = Yup.object({
         // assigning users logic here
         assignTypeAnswer: Yup.object().nullable(),
         assignType: Yup.object({ name: Yup.string().required(), key: Yup.string().required() }).nullable(),

         // task on order other fields
         name: Yup.string().nullable(),
         productTaskId: Yup.string().nullable(),
         taskOnProductId: Yup.string().nullable(),
         assignedToId: Yup.string().nullable(),
         completedAt: Yup.date().nullable(),
         completed: Yup.boolean().nullable(),
         completedById: Yup.string().nullable(),
         // required it for now on when creating a task... even tho the migration, old db, didn't have it required.
         createdById: Yup.string().required(),
         updatedById: Yup.string().nullable(),
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
      const roundRobinRoles =
         reqBody?.assignType && reqBody?.assignType?.roundRobin && reqBody?.assignType?.key === 'role';
      const randomRoles =
         reqBody?.assignType && !reqBody?.assignType?.roundRobin && reqBody?.assignType?.key === 'role';
      const clientSelectedUser =
         reqBody?.assignType &&
         !reqBody?.assignType?.roundRobin &&
         (reqBody?.assignType?.key === 'user' ||
            reqBody?.assignType?.key === 'me' ||
            reqBody?.assignType?.key === 'agent');

      if (roundRobinRoles) {
         const assignedTo = await roundRobinRole(reqBody);
         reqBody['assignedToId'] = assignedTo?.id;
      } else if (randomRoles) {
         const assignedTo = await randomRole(reqBody);
         reqBody['assignedToId'] = assignedTo?.id;
      } else if (clientSelectedUser) {
         reqBody['assignedToId'] = reqBody?.assignTypeAnswer?.id;
      }

      const createdTask = await db.tasksOnOrders.create({
         ...reqBody,
         orderId: id,
         assignedToId: reqBody?.assignedToId || null,
      });

      return NextResponse.json(createdTask, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createTaskOnOrder as POST };

async function roundRobinRole(reqBody: any) {
   // returns the selected user
   const roleId = reqBody?.assignTypeAnswer?.id;

   // get all the users by role
   const usersByRole = await db.users
      .findAll({
         attributes: ['id', 'firstName', 'lastName', 'fullName', 'emailAddress'],
         include: [{ model: db.roles, as: 'roles', where: { id: roleId }, required: true }],
         order: [['firstName', 'ASC']],
      })
      .then(deepCopy);

   if (!usersByRole?.length) return null;

   for (const user of usersByRole) {
      const latestTaskForAnyOrder = await db.tasksOnOrders.findOne({
         where: { assignedToId: user?.id },
         order: [['createdAt', 'DESC']],
      });
      user['latestTaskOnOrder'] = latestTaskForAnyOrder;
   }

   // see what user is next up by whoever was assigned a task the latest
   // sort users by 'createdAt' of their latestTaskOnOrder. users without a task come first.
   // array is already sorted by firstName 'ASC'
   usersByRole.sort((a: any, b: any) => {
      if (!a.latestTaskOnOrder && !b.latestTaskOnOrder) return 0; // both users haven't been assigned tasks
      if (!a.latestTaskOnOrder) return -1; // only 'a' hasn't been assigned a task
      if (!b.latestTaskOnOrder) return 1; // only 'b' hasn't been assigned a task

      // compare based on the 'createdAt' timestamps with in latestTaskOnOrder object
      const aCreatedAt = new Date(a?.latestTaskOnOrder?.createdAt).getTime();
      const bCreatedAt = new Date(b?.latestTaskOnOrder?.createdAt).getTime();
      return aCreatedAt - bCreatedAt;
   });

   // the first user in the sorted array is the one next up to be assigned a task
   return usersByRole[0];
}

async function randomRole(reqBody: any) {
   // returns the selected user
   const roleId = reqBody?.assignTypeAnswer?.id;

   // get random user with roleId match
   const randomUserByRole = await db.users
      .findOne({
         attributes: ['id', 'firstName', 'lastName', 'fullName', 'emailAddress'],
         include: [{ model: db.roles, as: 'roles', where: { id: roleId }, required: true }],
         order: [Sequelize.fn('RANDOM')],
      })
      .then(deepCopy);

   // return the random user
   return randomUserByRole;
}
