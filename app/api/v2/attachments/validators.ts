import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';

export const foreignKeysExists = async (reqBody: any) => {
   const leadIdExists = await db.leads.findByPk(reqBody?.leadId);
   if (!leadIdExists) throw new LumError(400, `Lead with id: ${reqBody?.leadId} doesn't exist.`);

   const attachmentTypeIdExists = await db.attachmentTypesLookup.findByPk(reqBody?.attachmentTypeId);
   if (!attachmentTypeIdExists)
      throw new LumError(400, `Attachment type with id: ${reqBody?.attachmentTypeId} doesn't exist.`);

   if (reqBody?.orderId) {
      const orderIdExists = await db.orders.findByPk(reqBody?.orderId);
      if (!orderIdExists) throw new LumError(400, `Order with id: ${reqBody?.orderId} doesn't exist.`);
   }

   const createdByIdExists = await db.users.findByPk(reqBody?.createdById);
   if (!createdByIdExists) throw new LumError(400, `Created by with id: ${reqBody?.createdById} doesn't exist.`);

   if (reqBody?.updatedById) {
      const updatedByIdExists = await db.users.findByPk(reqBody?.updatedById);
      if (!updatedByIdExists) throw new LumError(400, `Updated by with id: ${reqBody?.updatedById} doesn't exist.`);
   }
};
