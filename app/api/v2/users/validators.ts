import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import * as Yup from 'yup';

export async function validateRolesOnUsers(reqBody: any, userId: string | null = null) {
   for (const roleOnUser of reqBody.rolesOnUser) {
      const schema = Yup.object({
         id: Yup.string().required().nullable(),
         roleId: Yup.string().required(),
      });
      await schema.validate(roleOnUser);

      if (roleOnUser?.id) {
         // validate the id is valid
         const roleOnUserIdExists = await db.rolesOnUsers.findByPk(roleOnUser.id);
         if (!roleOnUserIdExists) throw new LumError(400, `Role on user with id: ${roleOnUser.id} doesn't exist.`);
      } else if (!roleOnUser?.id && userId) {
         const roleOnUserExists = await db.rolesOnUsers.findOne({
            where: { userId: userId, roleId: roleOnUser?.roleId },
            paranoid: false,
         });
         if (roleOnUserExists) roleOnUser['id'] = roleOnUserExists?.id;
      }

      // see if roleId exists
      const roleIdExists = await db.roles.findByPk(roleOnUser.roleId);
      if (!roleIdExists) throw new LumError(400, `Role with id: '${roleOnUser.roleId}' doesn't exist.`);
   }

   return true;
}
