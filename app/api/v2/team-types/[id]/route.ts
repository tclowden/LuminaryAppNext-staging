import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';

async function getTeamTypeById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;
      const teamType = await db.teamTypesLookup.findByPk(id);

      return NextResponse.json(teamType, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateTeamType(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
      });
      await schema.validate(reqBody);

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      // check to see if team type exists
      const teamTypeIdExists = await db.teamTypesLookup.findByPk(id);
      if (!teamTypeIdExists) throw new LumError(400, `Team type with id: '${id}' doesn't exist.`);

      // delete the id out of the obj, don't want to rewrite the id...
      if (reqBody.id) delete reqBody['id'];

      const updatedTeamType = await db.teamTypesLookup
         .update(reqBody, { where: { id: id }, returning: true, individualHooks: true })
         .then((res: any) => res[1][0] || res[1] || res);

      return NextResponse.json(updatedTeamType, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function deleteTeamType(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const teamIdExists = await db.teams.findByPk(id);
      if (!teamIdExists) throw new LumError(400, `Team with id: '${id}' doesn't exist.`);

      await db.teams.destroy({ where: { id: id }, individualHooks: true });
      // const archivedTeamTypeRes = await db.teams
      //    .update({ deletedAt: Date.now() }, { where: { id: id }, returning: true, individualHooks: true })
      //    .then((res: any) => res[1][0] || res[1] || res);

      return NextResponse.json('Team type successfully deleted.', { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getTeamTypeById as GET };
export { updateTeamType as PUT };
export { deleteTeamType as DELETE };
