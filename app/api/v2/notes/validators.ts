import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import * as Yup from 'yup';

export async function foreignKeysExists(reqBody: any) {
   const userExists = await db.users.findByPk(reqBody?.createdById).catch((err: any) => {
      throw new LumError(400, `Error finding user: createdById`);
   });
   if (!userExists) throw new LumError(400, `createdById: ${reqBody?.createdById} doesn't exist.`);

   if (reqBody?.updatedById && reqBody?.updatedById !== reqBody?.createdById) {
      const userExists = await db.users.findByPk(reqBody.updatedById).catch((err: any) => {
         throw new LumError(400, `Error finding user: updatedById`);
      });
      if (!userExists) throw new LumError(400, `updatedById: ${reqBody.updatedById} doesn't exist.`);
   }

   if (!reqBody?.leadId && !reqBody?.orderId)
      throw new LumError(400, `Note must be created with either a lead id or order id`);

   if (reqBody?.leadId) {
      const leadIdExists = await db.leads.findByPk(reqBody?.leadId).catch((err: any) => {
         throw new LumError(400, `Error finding leadId`);
      });
      if (!leadIdExists) throw new LumError(400, `Lead with id: ${reqBody?.leadId} doesn't exist.`);
   }

   if (reqBody?.orderId) {
      const orderIdExists = await db.orders.findByPk(reqBody?.orderId).catch((err: any) => {
         throw new LumError(400, `Error finding orderId`);
      });
      if (!orderIdExists) throw new LumError(400, `Order with id: ${reqBody?.orderId} doesn't exist.`);
   }
}

export const validateNotificationsArr = async (reqBody: any, noteId?: string) => {
   for (const noti of reqBody?.notifications) {
      const schema = Yup.object({
         id: Yup.string().nullable(),
         notificationTypeId: Yup.string().required(),
         // notificationType: Yup.object({ id: Yup.string().required(), name: Yup.string().required() }).required(),
         taggedByUserId: Yup.string().required(),
         // could be a user tagged or a team tagged
         taggedUserId: Yup.string().required(),
         taggedTeamId: Yup.string().nullable(),
         complete: Yup.boolean().required(),
      });
      await schema.validate(noti);

      if (noti?.id) {
         const notificationIdExists = await db.notifications.findByPk(noti.id);
         if (!notificationIdExists) throw new LumError(400, `Notification with id: ${noti?.id} doesn't exist.`);
      } else if (!noti?.id && noteId) {
         const notificationExists = await db.notifications.findOne({
            where: { taggedUserId: noti?.taggedUserId, noteId: noteId, notificationTypeId: noti?.notificationTypeId },
            paranoid: false,
         });
         if (notificationExists) noti['id'] = notificationExists?.id;
      }

      const notificationTypeIdExists = await db.notificationTypesLookup.findByPk(noti?.notificationTypeId);
      if (!notificationTypeIdExists)
         throw new LumError(400, `Notification type with id: ${noti?.notificationTypeId} doesn't exist.`);

      const taggedByUserIdExists = await db.users.findByPk(noti?.taggedByUserId);
      if (!taggedByUserIdExists) throw new LumError(400, `Tagged by user id ${noti?.taggedByUserId} doesn't exist.`);

      const taggedUserIdExists = await db.users.findByPk(noti?.taggedUserId);
      if (!taggedUserIdExists) throw new LumError(400, `Tagged user id: ${noti?.taggedUserId} doesn't exist.`);

      if (noti?.taggedTeamId) {
         const taggedTeamIdExists = await db.teams.findByPk(noti?.taggedTeamId);
         if (!taggedTeamIdExists) throw new LumError(400, `Tagged team id: ${noti?.taggedTeamId} doesn't exist.`);
      }
   }
};
