import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import * as Yup from 'yup';

export async function validateUsersOnRoles(reqBody: any, roleId: string | null = null) {
   for (const userOnRole of reqBody.usersOnRole) {
      const schema: any = await Yup.object({
         id: Yup.string().required().nullable(),
         userId: Yup.string().required(),
      });
      await schema.validate(userOnRole);

      if (userOnRole?.id) {
         // see if id is valid
         const userOnRoleIdExists = await db.rolesOnUsers.findByPk(userOnRole?.id);
         if (!userOnRoleIdExists) throw new LumError(400, `User on role with id: '${userOnRole.id}' doesn't exist.`);
      } else if (!userOnRole?.id && roleId) {
         // see if the permOnRole already existed at one point using the roleId & userId
         const userOnRoleAlreadyExists = await db.rolesOnUsers.findOne({
            where: { roleId: roleId, userId: userOnRole.userId },
            paranoid: false,
         });
         if (userOnRoleAlreadyExists) userOnRole['id'] = userOnRoleAlreadyExists.id;
      }

      // see if userId exists
      const userIdExists = await db.users.findByPk(userOnRole.userId);
      if (!userIdExists) throw new LumError(400, `User with id: '${userOnRole.userId}' doesn't exist.`);
   }

   return true;
}

export async function validatePermissionsOnRole(reqBody: any, roleId: string | null = null) {
   for (const permOnRole of reqBody.permissionsOnRole) {
      const schema: any = Yup.object({
         id: Yup.string().required().nullable(),
         permissionId: Yup.string().required(),
      });
      await schema.validate(permOnRole);

      if (permOnRole?.id) {
         // see if id is valid
         const permOnRoleIdExists = await db.permissionsOnRoles.findByPk(permOnRole?.id);
         if (!permOnRoleIdExists)
            throw new LumError(400, `Permission on role with id: '${permOnRole.id}' doesn't exist.`);
      } else if (!permOnRole?.id && roleId) {
         // see if the permOnRole already existed at one point using the roleId & permissionId
         const permOnRoleAlreadyExists = await db.permissionsOnRoles.findOne({
            where: { roleId: roleId, permissionId: permOnRole.permissionId },
            paranoid: false,
         });
         if (permOnRoleAlreadyExists) permOnRole['id'] = permOnRoleAlreadyExists.id;
      }

      // see if userId exists
      const permissionIdExists = await db.permissions.findByPk(permOnRole.permissionId);
      if (!permissionIdExists)
         throw new LumError(400, `Permission with id: '${permOnRole.permissionId}' doesn't exist.`);
   }

   return true;
}
