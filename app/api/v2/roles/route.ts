import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';
import { validatePermissionsOnRole, validateUsersOnRoles } from './validators';

export async function GET(request: NextRequest) {
   try {
      const roles = await db.roles
         .findAll({
            include: [
               { model: db.users, required: false },
               { model: db.permissions, required: false },
            ],
            order: [['name', 'ASC']],
         })
         .catch((err: any) => {
            console.log('ERR: ', err);
            throw new LumError(400, err);
         });

      return NextResponse.json(roles, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createRole(request: NextRequest) {
   try {
      const reqBody = await request.json();
      const schema: any = await Yup.object({
         name: Yup.string().required(),
         description: Yup.string().required(),
         usersOnRole: Yup.array().required(),
         permissionsOnRole: Yup.array().required(),
      });
      await schema.validate(reqBody);

      if (!!reqBody.usersOnRoles?.length) await validateUsersOnRoles(reqBody);
      if (!!reqBody.permissionsOnRole?.length) await validatePermissionsOnRole(reqBody);

      // create role
      const createdRole = await db.roles.create(reqBody);

      if (!!reqBody.usersOnRole?.length) {
         const usersOnRoleToCreate = [...reqBody.usersOnRole]
            .filter((uOR: any) => !uOR.archived)
            .map((uOR: any) => {
               // delete archived key
               delete uOR['archived'];
               // id is null so delete it
               delete uOR['id'];
               return {
                  ...uOR,
                  roleId: createdRole?.id,
               };
            });
         await db.rolesOnUsers.bulkCreate(usersOnRoleToCreate);
      }

      if (!!reqBody.permissionsOnRole?.length) {
         const permissionsOnRoleToCreate = [...reqBody.permissionsOnRole]
            .filter((pOR: any) => !pOR.archived)
            .map((pOR: any) => {
               // delete archived key
               delete pOR['archived'];
               // id is null so delete it
               delete pOR['id'];
               return {
                  ...pOR,
                  roleId: createdRole?.id,
               };
            });
         await db.permissionsOnRoles.bulkCreate(permissionsOnRoleToCreate);
      }

      return NextResponse.json(createdRole, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
export { createRole as POST };
