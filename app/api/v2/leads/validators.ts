import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';

export const foreignKeysExists = async (reqBody: any) => {
   const createdByIdExists = await db.users.findByPk(reqBody.createdById).catch((err: any) => {
      throw new LumError(400, err);
   });
   if (!createdByIdExists) throw new LumError(400, `User (createdBy) with id: ${reqBody.createdById} doesn't exist.`);

   if (reqBody.leadSourceId) {
      const leadSourceIdExists = await db.leadSources.findByPk(reqBody.leadSourceId).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!leadSourceIdExists) throw new LumError(400, `Lead Source with id: ${reqBody.leadSourceId} doesn't exist.`);
   }

   if (reqBody.ownerId) {
      const ownerIdExists = await db.users.findByPk(reqBody.ownerId).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!ownerIdExists) throw new LumError(400, `User (owner) with id: ${reqBody.ownerId} doesn't exist.`);
   }

   if (reqBody.setterAgentId) {
      const setterAgentIdExists = await db.users.findByPk(reqBody.setterAgentId).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!setterAgentIdExists)
         throw new LumError(400, `User (setterAgent) with id: ${reqBody.setterAgentId} doesn't exist.`);
   }

   if (reqBody.statusId) {
      const statusIdExists = await db.statuses.findByPk(reqBody.statusId).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!statusIdExists) throw new LumError(400, `Status with id: ${reqBody.statusId} doesn't exist.`);
   }

   return true;
};

export const validateFieldsOnLeadArr = async (reqBody: any) => {
   for (const fieldOnLead of reqBody.fieldsOnLead) {
      const validationArr = Yup.object({
         leadFieldId: Yup.string().required('leadFieldId is required on fieldOnLead'),
         answer: Yup.string().required('Answer is required on fieldOnLead'),
      });
      await validationArr.validate(fieldOnLead);

      // validate the leadFieldId exists
      const leadFieldIdExists = await db.leadFields.findByPk(fieldOnLead.leadFieldId);
      if (!leadFieldIdExists) throw new LumError(400, `leadFieldId: '${fieldOnLead.leadFieldId} doesn't exist.`);
   }

   return true;
};
