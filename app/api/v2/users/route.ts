import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';
import { deepCopy, formatPostgresTimestamp } from '@/utilities/helpers';
import { validateRolesOnUsers } from './validators';
import { sendEmailInvite, upsert } from '@/utilities/api/helpers';
export const dynamic = 'force-dynamic';

async function getUsers(request: NextRequest) {
   try {
      const users = await db.users
         .findAll({
            include: [
               {
                  model: db.rolesOnUsers,
                  required: false,
                  as: 'rolesOnUser',
                  include: [{ model: db.roles, as: 'role', required: false }],
               },
               {
                  model: db.phoneNumbersOnUsers,
                  as: 'phoneNumbersOnUser',
                  required: false,
                  include: { model: db.phoneNumbers, required: false },
               },
            ],
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      return NextResponse.json(users, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createUser(request: NextRequest) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         firstName: Yup.string().required(),
         lastName: Yup.string().required(),
         emailAddress: Yup.string().email().required(),
         officeId: Yup.string().required(),
         // .test(
         //    'id-exists',
         //    (params: any) => `Office id: ${params?.value} doesn't exists...`,
         //    async (value: string) => {
         //       const officeExists = await db.offices.findByPk(value);
         //       if (officeExists) return true;
         //       else return false;
         //    }
         // ),
         rolesOnUser: Yup.array().required(),
         sendEmailInvite: Yup.boolean().required(),
      });
      await schema.validate(reqBody);

      const userExistsByEmail = await db.users
         .findOne({ where: { emailAddress: reqBody.emailAddress }, paranoid: false })
         .then(deepCopy);
      if (userExistsByEmail) {
         const deletedAt = userExistsByEmail?.deletedAt ? formatPostgresTimestamp(userExistsByEmail?.deletedAt) : null;
         const message = `User with email ${reqBody.emailAddress} already exists${
            deletedAt ? `, but was deleted at datetime: ${deletedAt}` : ''
         }...`;
         throw new LumError(400, message);
      }

      if (!!reqBody.rolesOnUser.length) await validateRolesOnUsers(reqBody);

      const createdUser = await db.users.create(reqBody);

      if (!!reqBody.rolesOnUser.length) {
         // attached the role(s) to the user
         const rolesOnUserToUpsert = [...reqBody.rolesOnUser].map((roleOnUser: any) => ({
            ...roleOnUser,
            userId: createdUser.id,
         }));

         for (const roleOnUser of rolesOnUserToUpsert) {
            await upsert(roleOnUser, 'rolesOnUsers', db);
         }
      }

      if (reqBody.sendEmailInvite) {
         await sendEmailInvite(
            { userId: createdUser?.id, firstName: createdUser?.firstName, emailAddress: createdUser?.emailAddress },
            'register',
            db
         );
      }

      return NextResponse.json(createdUser, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getUsers as GET };
export { createUser as POST };
