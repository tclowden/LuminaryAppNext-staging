import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { validateTeamProducts, validateTeamUsers } from './validators';

async function getAllTeams(request: NextRequest, options: any) {
   try {
      const teams = await db.teams.findAll({
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
         ],
         order: [['name', 'ASC']],
      });

      return NextResponse.json(teams, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createTeam(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
         teamTypeId: Yup.string().required(),
         teamUsers: Yup.array().required(),
         teamProducts: Yup.array().required(),
      });
      await schema.validate(reqBody);

      // check to see if team type exists... will return null if not there
      const teamTypeIdExists = await db.teamTypesLookup.findByPk(reqBody.teamTypeId);
      if (!teamTypeIdExists) throw new LumError(400, `State with id: ${reqBody.stateId} doesn't exist.`);

      if (reqBody?.teamUsers?.length) validateTeamUsers(reqBody);
      if (reqBody?.teamProducts?.length) validateTeamProducts(reqBody);

      // check to see if there is a team that already exists by name
      const teamAlreadyExists = await db.teams.findOne({ where: { name: reqBody.name } });
      if (teamAlreadyExists) throw new LumError(400, `Team with name: '${reqBody.name}' already exists`);

      // create the team
      const createdTeam = await db.teams.create({ ...reqBody });

      if (!!reqBody.teamUsers.length) {
         // create the teamsUsers rows with each user being on the team
         const teamUsersTempData = reqBody.teamUsers.map((teamUser: any) => {
            delete teamUser['id'];
            return { ...teamUser, teamId: createdTeam.id };
         });
         await db.teamsUsers.bulkCreate(teamUsersTempData);
      }

      if (!!reqBody.teamProducts.length) {
         // create the teamsProducts rows with each product being associated to the team
         const teamProductsTempData = reqBody.teamProducts.map((teamProduct: any) => {
            delete teamProduct['id'];
            return { ...teamProduct, teamId: createdTeam.id };
         });
         await db.teamsProducts.bulkCreate(teamProductsTempData);
      }

      return NextResponse.json(createdTeam, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createTeam as POST };

export { getAllTeams as GET };
