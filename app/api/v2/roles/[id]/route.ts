import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { validatePermissionsOnRole, validateUsersOnRoles } from '../validators';
import { upsert } from '@/utilities/api/helpers';

async function getRoleById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const role = await db.roles.findByPk(id, {
         include: [
            { model: db.users, required: false },
            {
               model: db.permissionsOnRoles,
               as: 'permissionsOnRole',
               required: false,
               include: [{ model: db.permissions, required: false, as: 'permission' }],
            },
         ],
      });
      return NextResponse.json(role, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
export { getRoleById as GET };

async function deleteRole(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const roleIdExists = await db.roles.findByPk(id);
      if (!roleIdExists) throw new LumError(400, `Role with id: ${id} doesn't exist...`);

      await db.roles.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json({ success: true, message: `Role successfully deleted.` }, { status: 200 });
   } catch (err: any) {
      console.log('err', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
export { deleteRole as DELETE };

async function updateRole(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema: any = Yup.object({
         name: Yup.string().required(),
         description: Yup.string().required(),
         usersOnRole: Yup.array().required(),
         permissionsOnRole: Yup.array().required(),
      });
      await schema.validate(reqBody);

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const roleIdExists = await db.roles.findByPk(id);
      if (!roleIdExists) throw new LumError(400, `Role with id: ${id} doesn't exist...`);

      if (!!reqBody.usersOnRole?.length) await validateUsersOnRoles(reqBody, id);
      if (!!reqBody.permissionsOnRole?.length) await validatePermissionsOnRole(reqBody, id);

      // delete the id out of the obj, don't want to rewrite the id...
      if (reqBody?.id) delete reqBody['id'];

      const updatedRole = await db.roles
         .update({ ...reqBody }, { where: { id: id }, returning: true })
         .then((res: any) => res[1][0] || res[1] || res);

      if (!!reqBody.usersOnRole?.length) {
         const usersOnRole = [...reqBody.usersOnRole].map((uOR: any) => ({ ...uOR, roleId: id }));
         for (const userOnRole of usersOnRole) {
            await upsert(userOnRole, 'rolesOnUsers', db);
         }
      }

      if (!!reqBody.permissionsOnRole?.length) {
         const permsOnRole = [...reqBody.permissionsOnRole].map((pOR: any) => ({ ...pOR, roleId: id }));
         for (const permOnRole of permsOnRole) {
            await upsert(permOnRole, 'permissionsOnRoles', db);
         }
      }

      return NextResponse.json(updatedRole, { status: 200 });
   } catch (err: any) {
      console.log('err', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
export { updateRole as PUT };

// async function upsert(obj: any, tableName: string) {
//    if (obj?.archived && obj?.id) {
//       // soft delete the user on role
//       await db[tableName].update({ deletedAt: new Date() }, { where: { id: obj?.id }, individualHooks: true });
//    } else if (!obj?.archived && obj?.id) {
//       // delete the archived key then update by id
//       delete obj['archived'];
//       // set deleteAt to null... same as unarchiving a row
//       obj['deletedAt'] = null;
//       await db[tableName].update(obj, { where: { id: obj?.id }, individualHooks: true, paranoid: false });
//    } else if (!obj?.archived && !obj?.id) {
//       // delete the archived & id key then create
//       delete obj['archived'];
//       delete obj['id'];
//       await db[tableName].create(obj);
//    }
// }
