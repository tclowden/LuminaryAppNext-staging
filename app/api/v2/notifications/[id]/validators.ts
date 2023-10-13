import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';

// will throw an error if doesn't exist... else just return true;
export const foreignKeysExists = async (reqBody: any) => {
   const notificationTypeIdExists = await db.notificationTypesLookup.findByPk(reqBody.notificationTypeId);
   if (!notificationTypeIdExists)
      throw new LumError(400, `Notification type with id: ${reqBody.notificationTypeId} doesn't exist.`);

   const taggedByUserIdExists = await db.users.findByPk(reqBody.taggedByUserId);
   if (!taggedByUserIdExists)
      throw new LumError(400, `Tagged by user with id: ${reqBody.taggedByUserId} doesn't exist.`);

   const taggedUserIdExists = await db.users.findByPk(reqBody.taggedUserId);
   if (!taggedUserIdExists) throw new LumError(400, `Tagged user with id: ${reqBody.taggedUserId} doesn't exist.`);

   if (reqBody?.taggedTeamId) {
      const taggedTeamIdExists = await db.teams.findByPk(reqBody.taggedTeamId);
      if (!taggedTeamIdExists) throw new LumError(400, `Tagged team with id: ${reqBody.taggedTeamId} doesn't exist.`);
   }

   return true;
};
