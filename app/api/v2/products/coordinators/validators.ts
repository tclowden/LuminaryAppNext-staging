import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import * as Yup from 'yup';

export async function validateRolesOnProductCoordinator(reqBody: any, prodCoordId: string | null = null) {
   for (const roleOnProdCoord of reqBody.rolesOnProductCoordinator) {
      const schema = Yup.object({
         id: Yup.string().nullable(),
         roleId: Yup.string().required(),
      });
      await schema.validate(roleOnProdCoord);

      const roleIdExists = await db.roles.findByPk(roleOnProdCoord.roleId);
      if (!roleIdExists) throw new LumError(400, `Role with id: ${roleOnProdCoord.roleId} doesn't exist.`);

      if (roleOnProdCoord?.id) {
         const roleOnProdCoordExists = await db.rolesOnProductCoordinators.findByPk(roleOnProdCoord.id);
         if (!roleOnProdCoordExists)
            throw new LumError(400, `Role on product coordinator with id: ${roleOnProdCoordExists.id} doesn't exist.`);
      } else if (!roleOnProdCoord?.id && prodCoordId) {
         // see if the role on prod coord exists by roleId and productCoordinatorId
         const roleOnProdCoordExists = await db.rolesOnProductCoordinators.unscoped().findOne({
            where: { roleId: roleOnProdCoord?.roleId, productCoordinatorId: prodCoordId },
            paranoid: false,
         });
         if (roleOnProdCoordExists) roleOnProdCoord['id'] = roleOnProdCoordExists.id;
      }
   }

   // validate there are no duplicate roles being passed in
   const roleOnProductCoordinatorsCopy = new Set(reqBody.rolesOnProductCoordinator.map((rOPC: any) => rOPC.roleId));
   if (roleOnProductCoordinatorsCopy.size < reqBody.rolesOnProductCoordinator?.length)
      throw new LumError(400, 'There is a duplicate role being passed in.');

   return true;
}
