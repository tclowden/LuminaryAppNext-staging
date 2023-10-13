import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import * as Yup from 'yup';

export async function validateTeamUsers(reqBody: any, teamId: string | null = null) {
   for (const teamUser of reqBody?.teamUsers) {
      const schema = Yup.object({
         id: Yup.string().required().nullable(),
         userId: Yup.string().required(),
         teamLead: Yup.boolean().required(),
      });
      await schema.validate(teamUser);

      // check to see if teamUser exists by id
      if (teamUser?.id) {
         const teamUserIdExists = await db.teamsUsers.findByPk(teamUser.id);
         if (!teamUserIdExists) throw new LumError(400, `Team user with id: '${teamUser.id}' doesn't exist.`);
      } else if (!teamUser?.id && teamId) {
         // see if team exists by userId and teamId
         const teamUserRowExists = await db.teamsUsers.unscoped().findOne({
            where: { teamId: teamId, userId: teamUser?.userId },
            paranoid: false,
         });
         if (teamUserRowExists) teamUser['id'] = teamUserRowExists?.id;
      }

      // check to see if team type exists... will return null if not there
      const userIdExists = await db.users.findByPk(teamUser.userId);
      if (!userIdExists) throw new LumError(400, `User with id: ${teamUser.userId} doesn't exist.`);
   }

   // make sure there is only one teamLead
   const teamLeadsArr = [...reqBody.teamUsers].filter((teamUser) => teamUser.teamLead);
   if (teamLeadsArr.length > 1) throw new LumError(400, 'There must only be 1 team lead.');
}

export async function validateTeamProducts(reqBody: any, teamId: string | null = null) {
   for (const teamProduct of reqBody.teamProducts) {
      const schema = Yup.object({
         id: Yup.string().required().nullable(),
         productId: Yup.string().required(),
      });
      await schema.validate(teamProduct);

      if (teamProduct?.id) {
         const teamProductIdExists = await db.teamsProducts.findByPk(teamProduct?.id);
         if (!teamProductIdExists) throw new LumError(400, `Team product with is: ${teamProduct.id} doesn't exist.`);
      } else if (!teamProduct?.id && teamId) {
         // see if team exists by userId and productId
         const teamProductRowExists = await db.teamsProducts
            .unscoped()
            .findOne({ where: { teamId: teamId, productId: teamProduct?.productId }, paranoid: false });
         if (teamProductRowExists) teamProduct['id'] = teamProductRowExists.id;
      }

      // check to see if team type exists... will return null if not there
      const productIdExists = await db.productsLookup.findByPk(teamProduct.productId);
      if (!productIdExists) throw new LumError(400, `Product with id: ${teamProduct.productId} doesn't exist.`);
   }
}
