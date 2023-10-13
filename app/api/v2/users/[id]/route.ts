import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { validateRolesOnUsers } from '../validators';
import { deepCopy } from '@/utilities/helpers';
import { sendEmailInvite, upsert } from '@/utilities/api/helpers';

async function deleteUser(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const userIdExists = await db.users.findByPk(id);
      if (!userIdExists) throw new LumError(400, `User with id: ${id} doesn't exist.`);

      // const archivedUserRes = await db.users
      //    .update({ deletedAt: new Date() }, { where: { id: id }, returning: true, individualHooks: true })
      //    .then((res: any) => res[1][0] || res[1] || res);
      await db.users.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json(`User successfully deleted.`, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateUser(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema: any = Yup.object({
         firstName: Yup.string().required(),
         lastName: Yup.string().required(),
         emailAddress: Yup.string().email().required(),
         officeId: Yup.string().required(),
         sendEmailInvite: Yup.boolean().required(),
         rolesOnUser: Yup.array(),
         profileUrl: Yup.string().nullable(),
      });
      await schema.validate(reqBody);

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const userIdExists = await db.users.findByPk(id);
      if (!userIdExists) throw new LumError(400, `User with id: ${id} doesn't exist.`);

      if (!!reqBody?.rolesOnUser.length) await validateRolesOnUsers(reqBody, id);

      // delete unnecessary keys
      delete reqBody['id'];
      // delete reqBody['archived'];

      const updatedUser = await db.users
         .update(reqBody, { where: { id: id }, returning: true, individualHooks: true, paranoid: false })
         .then((res: any) => res[1][0] || res[1] || res)
         .then(deepCopy);

      // delete password hash
      delete updatedUser['passwordHash'];

      // attached the roles to the user
      const rolesOnUsersToUpsert = [...reqBody.rolesOnUser].map((roleOnUser: any) => ({
         ...roleOnUser,
         userId: updatedUser?.id,
      }));
      if (!!reqBody?.rolesOnUser.length) {
         for (const rolesOnUser of rolesOnUsersToUpsert) {
            await upsert(rolesOnUser, 'rolesOnUsers', db);
         }
      }

      if (reqBody.sendEmailInvite) {
         await sendEmailInvite(
            { userId: updatedUser?.id, firstName: reqBody.firstName, emailAddress: reqBody.emailAddress },
            'register',
            db
         );
      }

      return NextResponse.json(updatedUser, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function getUserById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const userIdExists = await db.users.findByPk(id);
      if (!userIdExists) throw new LumError(400, `User with id: ${id} doesn't exist.`);

      const userRes = await db.users.findByPk(id);
      return NextResponse.json(userRes, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { deleteUser as DELETE };
export { updateUser as PUT };
export { getUserById as GET };
