import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { validateTeamProducts, validateTeamUsers } from '../validators';
import { upsert } from '@/utilities/api/helpers';

async function getTeamById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const team = await db.teams.findByPk(id, {
         include: [
            {
               model: db.teamsUsers,
               as: 'teamUsers',
               include: [{ model: db.users, as: 'user', required: false }],
               required: false,
            },
            {
               model: db.teamsProducts,
               as: 'teamProducts',
               include: [{ model: db.productsLookup, required: false, as: 'product' }],
               required: false,
            },
            {
               model: db.teamTypesLookup,
               as: 'teamType',
               required: false,
            },
         ],
      });

      return NextResponse.json(team, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateTeam(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
         teamTypeId: Yup.string().required(),
         teamUsers: Yup.array().required(),
         teamProducts: Yup.array().required(),
      });
      await schema.validate(reqBody);

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      // check to see if team type exists... will return null if not there
      const teamTypeIdExists = await db.teamTypesLookup.findByPk(reqBody.teamTypeId);
      if (!teamTypeIdExists) throw new LumError(400, `State with id: ${reqBody.stateId} doesn't exist.`);

      if (!!reqBody?.teamUsers?.length) validateTeamUsers(reqBody, id);
      if (!!reqBody?.teamProducts?.length) validateTeamProducts(reqBody, id);

      // delete the id out of the obj, don't want to rewrite the id...
      if (reqBody?.id) delete reqBody['id'];

      const updatedTeam = await db.teams
         .update({ ...reqBody }, { where: { id: id }, returning: true, individualHooks: true })
         .then((res: any) => res[1][0] || res[1] || res);

      if (!!reqBody?.teamUsers?.length) {
         const teamUsers = [...reqBody.teamUsers].map((teamUser: any) => ({ ...teamUser, teamId: id }));
         for (const teamUser of teamUsers) {
            await upsert(teamUser, 'teamsUsers', db);
         }
      }

      if (!!reqBody?.teamProducts?.length) {
         const teamProducts = [...reqBody.teamProducts].map((teamProduct: any) => ({ ...teamProduct, teamId: id }));
         for (const teamProduct of teamProducts) {
            await upsert(teamProduct, 'teamsProducts', db);
         }
      }

      return NextResponse.json(updatedTeam, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function deleteTeam(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;
      console.log('deleting team...');
      const teamIdExists = await db.teams.findByPk(id);
      if (!teamIdExists) throw new LumError(400, `Team with id: '${id}' doesn't exist.`);

      // const archivedTeamRes = await db.teams
      //    .update({ deletedAt: Date.now() }, { where: { id: id }, returning: true, individualHooks: true })
      //    .then((res: any) => res[1][0] || res[1] || res);
      await db.teams.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json('Team successfully deleted.', { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { deleteTeam as DELETE };
export { updateTeam as PUT };
export { getTeamById as GET };
