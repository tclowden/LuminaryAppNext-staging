'use server';
import { ActionProps } from './actionData';
import { AutomationActionExecutionType, AutomationExecutionResult } from '../actionsServer';
import db from '@/sequelize/models';
import { Op } from 'sequelize';
interface ExecutionProps extends ActionProps, AutomationActionExecutionType {}

// This needs to be repolaced with RoundRobin function
function getRandomUser(users: string[]): string | null {
   const randomIndex = Math.floor(Math.random() * users.length);
   return users[randomIndex];
}

export const execute = async ({
   leadId,
   orderId,
   executorId,
   prevValue,
   newValue,
   options,
}: ExecutionProps): Promise<AutomationExecutionResult> => {
   const { selectedProduct, selectedCoordinatorRole, howToAssign, selectedUser, selectedRole } = options;
   // console.log('selectedProduct:', selectedProduct)
   // console.log('selectedCoordinatorRole:', selectedCoordinatorRole)
   // console.log('howToAssign:', howToAssign)
   // console.log('selectedUser:', selectedUser)
   // console.log('selectedRole:', selectedRole)

   try {
      // Get all users based on how to assign
      let users = null;
      switch (howToAssign.id) {
         case '1':
            // round robin
            if (!selectedCoordinatorRole) throw new Error(`No coordinator role selected`);
            // TODO: get all users with the same role as the coordinator
            // 'SELECT user_id FROM users WHERE role = (SELECT role FROM product_coordinators WHERE coord_id = ?) ORDER BY first_name ASC'
            users = await db.users.findAll({
               where: { role: { [Op.in]: [selectedCoordinatorRole.id] } },
               raw: true,
            });
            break;
         case '2':
            // User Role
            if (!selectedRole) throw new Error(`No role selected`);
            // TODO: get all users with the selected role
            // 'SELECT user_id FROM users WHERE `role` = ? ORDER BY first_name ASC'
            users = await db.users.findAll({
               where: { role: { [Op.in]: [selectedRole.id] } },
               raw: true,
            });
            break;
         case '3':
            // Specific User
            if (!selectedUser) throw new Error(`No user selected`);
            users = [selectedUser.id];
            break;
         default:
            break;
      }
      console.log('users:', users);
      if (users.length === 0) {
         throw new Error(`No users exist with the same role assigned to this coordinator`);
      }

      // Get a user to assign
      // TODO: Round Robin. Right now it's RNG
      const randomUser = getRandomUser(users);

      // TODO: Assign the user as the order coordinator
      // 'INSERT INTO coordinator_assigned_to_order (`coordinator`, `order`, `user`) VALUES (?, ?, ?)', [this.coordinatorId, this.order, this.userToAssign]
      await db.coordinatorAssignedToOrder.create({
         coordinator: selectedCoordinatorRole.id,
         order: orderId,
         user: randomUser,
      });

      // EXTRA TODO: Notify admins if this fails?
      // try {
      //    const userData = {
      //       userName: this.getUserData(Crud, this.userId),
      //       leadName: this.getUserData(Crud, this.leadId),
      //       coordName: this.getUserData(Crud, this.coordinatorId),
      //       roleName: this.getUserRoleName(Crud, this.coordinatorId),
      //    };

      //    const targetAddress = 'mpickett@shinesolar.com, tlowden@shinesolar.com, ttrudo@shinesolar.com';
      //    const subject = `Luminary COORDINATOR Automation Error - Order: ${this.order}`;
      //    const message = `Luminary User ${
      //       userData.userName
      //    } updated an order's stage but round robin coordinator assignment failed.<br/>No users with the role ${
      //       userData.roleName
      //    } were found.<br/>Details - Order: ${this.order}, Lead: ${userData.leadName}, Coordinator: ${
      //       userData.coordName
      //    }, FlowID: ${this.taskConfig?.flowId || ''}`;
      //    const email = new SendEmail(
      //       targetAddress,
      //       subject,
      //       message,
      //       false,
      //       this.leadId.toString(),
      //       this.order.toString()
      //    );
      //    email.send();
      //    console.error(errorMsg);
      // } catch (err: any) {
      //    console.error(err?.message);
      // }

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
