import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';

export async function foreignKeysExists(reqBody: any) {
   if (reqBody?.createdById) {
      const userExists = await db.users.findByPk(reqBody?.createdById).catch((err: any) => {
         throw new LumError(400, `Error finding user: createdById`);
      });
      if (!userExists) throw new LumError(400, `createdById: ${reqBody?.createdById} doesn't exist.`);
   }

   if (reqBody?.updatedById && reqBody?.updatedById !== reqBody?.createdById) {
      const userExists = await db.users.findByPk(reqBody.updatedById).catch((err: any) => {
         throw new LumError(400, `Error finding user: updatedById`);
      });
      if (!userExists) throw new LumError(400, `updatedById: ${reqBody.updatedById} doesn't exist.`);
   }

   if (
      reqBody?.completedById &&
      reqBody?.completedById !== reqBody?.updatedById &&
      reqBody.completedById !== reqBody.createdById
   ) {
      const userExists = await db.users.findByPk(reqBody.completedById).catch((err: any) => {
         throw new LumError(400, `Error finding user: completedById`);
      });
      if (!userExists) throw new LumError(400, `completedById: ${reqBody.completedById} doesn't exist.`);
   }

   if (
      reqBody?.assignedToId &&
      reqBody?.assignedToId !== reqBody?.completedById &&
      reqBody?.assignedToId !== reqBody?.updatedById &&
      reqBody?.assignedToId !== reqBody?.createdById
   ) {
      const userExists = await db.users.findByPk(reqBody.assignedToId).catch((err: any) => {
         throw new LumError(400, `Error finding user: assignedToId`);
      });
      if (!userExists) throw new LumError(400, `assignedToId: ${reqBody.assignedToId} doesn't exist.`);
   }
}
