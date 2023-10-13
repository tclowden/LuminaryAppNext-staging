'use server';
import { ActionProps } from './actionData';
import { AutomationActionExecutionType, AutomationExecutionResult } from '../actionsServer';
import { createEmail } from '@/features/components/send-grid/createEmail';
import { email } from '@/utilities/formValidation/validators';
import e from 'cors';
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
   const {
      emailRecipientType,
      selectedProduct,
      selectedCoordinatorRole,
      selectedRole,
      fromName,
      fromEmail,
      toEmail,
      subject,
      message,
      ccEmail,
   } = options;

   try {
      // TODO:
      // 1. Coordinator
      // 2. Coordinator Team Lead

      let emailRecipientList = null;

      switch (emailRecipientType.id) {
         case '1':
            // Coordinator
            // emailRecipientList = await db.orders
            //    .findOne({
            //       where: { id: orderId },
            //       include: [
            //          {
            //             model: db.users,
            //             as: 'user',
            //             attributes: ['emailAddress'],
            //          },
            //       ],
            //       raw: true,
            //    })
            //    .then((order: any) => {
            //       if (!order.user.emailAddress) throw new Error("Order doesn't have an email address");
            //       return [order.user.emailAddress];
            //    });
            break;
         case '2':
            // Coordinator Team Lead
            break;
         case '3':
            // Get the email address from the current Sales Rep/Owner
            emailRecipientList = await db.leads
               .findOne({
                  where: { id: leadId },
                  include: [{ model: db.users, as: 'owner', required: false, attributes: ['emailAddress'] }],
                  attributes: [],
                  raw: true,
               })
               .then((lead: any) => {
                  if (!lead['owner.emailAddress']) throw new Error("Lead doesn't have an email address");
                  return [lead['owner.emailAddress']];
               });

            break;
         case '4':
            // Get the lead's email address from the db
            emailRecipientList = await db.leads
               .findOne({
                  where: { id: leadId },
                  attributes: ['emailAddress'],
                  raw: true,
               })
               .then((lead: any) => {
                  if (!lead.emailAddress) throw new Error("Lead doesn't have an email address");
                  return [lead.emailAddress];
               });
            break;
         case '5':
            // get all email addresses of users with the selected role
            emailRecipientList = await db.users
               .findAll({
                  include: [
                     {
                        model: db.rolesOnUsers,
                        as: 'rolesOnUser',
                        where: { roleId: selectedRole.id },
                        attributes: [],
                     },
                  ],
                  attributes: ['emailAddress'],
                  raw: true,
               })
               .then((users: any) => {
                  if (!users || users.length === 0) throw new Error('No users found with that role');
                  return users.map((user: any) => user.emailAddress);
               });
            break;
         case '6':
            // Specific Email Addresses
            emailRecipientList = toEmail.split(',');
            break;
         default:
            break;
      }

      if (!emailRecipientList || emailRecipientList.length === 0) {
         throw new Error('No email recipients found');
      }

      const emailRecipientPersonalizations = emailRecipientList.map((emailAddress: string) => ({
         to_email: emailAddress?.trim(),
         // to_name: `${lead.first_name} ${lead.last_name}`,
         // substitutions: lead.substitutions,
         // custom_args: { "lead_id": `${lead.lead_id}` }
      }));

      // console.log('----- Email Recipients -----');
      // console.log(emailRecipientPersonalizations);

      // Actually send the email(s)
      await createEmail
         .setPersonalizations(emailRecipientPersonalizations)
         .setFrom(fromEmail, fromName)
         .setSubject(subject)
         .setText(message)
         // .setHtml(blastHtml)
         // .setReplyToList([verifiedReplyEmail])
         // .setCategories([`blast_id: ${blast_id}`])
         .send();

      return {
         success: true,
         message: `Email sent.`,
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
