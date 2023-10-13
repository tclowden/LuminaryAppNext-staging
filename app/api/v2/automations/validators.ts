// import db from '@/sequelize/models';
// import { LumError } from '@/utilities/models/LumError';
// import * as Yup from 'yup';

// export async function foreignKeysExists(reqBody: any) {
//    const createdByIdExists = await db.users.findByPk(reqBody.createdById).catch((err: any) => {
//       throw new LumError(400, err);
//    });
//    if (!createdByIdExists) throw new LumError(400, `User (createdBy) with id: ${reqBody.createdById} doesn't exist.`);

//    if (reqBody?.updatedById) {
//       const updatedByIdExists = await db.users.findByPk(reqBody.updatedById).catch((err: any) => {
//          throw new LumError(400, err);
//       });
//       if (!updatedByIdExists)
//          throw new LumError(400, `User (updatedBy) with id: ${reqBody.updatedById} doesn't exist.`);
//    }

//    const automationTypeIdExists = await db.automationTypesLookup
//       .findByPk(reqBody.automationTypeId)
//       .catch((err: any) => {
//          throw new LumError(400, err);
//       });
//    if (!automationTypeIdExists)
//       throw new LumError(400, `Automation type with id: ${reqBody.automationTypeId} doesn't exist.`);
// }

// export async function validateAutomationTriggersOnAutomation(reqBody: any, automationId: string | null = null) {
//    for (const triggerOnAutomation of reqBody?.automationTriggersOnAutomation) {
//       const schema = Yup.object({
//          id: Yup.string().nullable(),
//          automationTriggerId: Yup.string().required(),
//       });
//       await schema.validate(triggerOnAutomation);

//       const automationActionIdExists = await db.automationTriggers.findByPk(triggerOnAutomation?.automationTriggerId);
//       if (!automationActionIdExists)
//          throw new LumError(
//             400,
//             `Automation trigger with id: ${triggerOnAutomation?.automationTriggerId} doesn't exist.`
//          );

//       if (triggerOnAutomation?.id) {
//          const triggerIdExists = await db.automationTriggersOnAutomations.findByPk(triggerOnAutomation?.id);
//          if (!triggerIdExists)
//             throw new LumError(400, `Trigger on automation with id: ${triggerOnAutomation?.id} doesn't exist.`);
//       } else if (!triggerOnAutomation?.id && automationId) {
//          const exists = await db.automationTriggersOnAutomations.findOne({
//             where: { automationId: automationId, automationTriggerId: triggerOnAutomation.automationTriggerId },
//          });
//          if (exists) triggerOnAutomation['id'] = exists?.id;
//       }
//    }
// }

// export async function validateAutomationActionsOnAutomation(reqBody: any, automationId: string | null = null) {
//    for (const actionOnAutomation of reqBody?.automationActionsOnAutomation) {
//       const schema = Yup.object({
//          id: Yup.string().nullable(),
//          automationActionId: Yup.string().required(),
//          order: Yup.number().required(),
//          input: Yup.string(),
//          options: Yup.string(),
//       });
//       await schema.validate(actionOnAutomation);

//       const automationActionIdExists = await db.automationActions.findByPk(actionOnAutomation?.automationActionId);
//       if (!automationActionIdExists)
//          throw new LumError(400, `Automation action with id: ${actionOnAutomation?.automationActionId} doesn't exist.`);

//       if (actionOnAutomation?.id) {
//          const actionIdExists = await db.automationActionsOnAutomations.findByPk(actionOnAutomation?.id);
//          if (!actionIdExists)
//             throw new LumError(400, `Action on automation with id: ${actionOnAutomation?.id} doesn't exist.`);
//       } else if (!actionOnAutomation?.id && automationId) {
//          const exists = await db.automationActionsOnAutomations.findOne({
//             where: { automationId: automationId, automationActionId: actionOnAutomation.automationActionId },
//          });
//          if (exists) actionOnAutomation['id'] = exists?.id;
//       }
//    }
// }

// Temp for build
export {};
