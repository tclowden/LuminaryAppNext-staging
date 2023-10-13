import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { Op } from 'sequelize';

export async function GET(request: NextRequest) {
   // Read query parameters for pagination from the request
   const limit = request.nextUrl.searchParams.get('limit') || 20;
   const offset = request.nextUrl.searchParams.get('offset') || 0;

   const teamId = request.nextUrl.searchParams.get('teamId') || false;
   const teamTypeName = request.nextUrl.searchParams.get('teamTypeName') || false;
   const userNameSearch = request.nextUrl.searchParams.get('userName') || false;

   const users = await getUsers(teamId, teamTypeName, userNameSearch);
   const teams = await getTeams();

   // Send the response with pagination metadata
   return NextResponse.json(
      {
         users: users,
         teams: teams,
      },
      { status: 200 }
   );
}

async function getUsers(teamId: any, teamTypeName: any, userNameSearch: any) {
   let users;
   if (teamId) {
      users = await getUsersByTeamId(teamId);
   }

   if (teamTypeName) {
      users = await getUsersByTeamTypeName(teamTypeName);
   }
   if (userNameSearch) {
      users = await searchUsersByName(userNameSearch);
   }

   if (!teamId && !teamTypeName && !userNameSearch) {
      users = await getAllUsers();
   }
   return users;
}

async function getAllUsers() {
   return await db.users.findAll({
      limit: 50,
      order: [['firstName', 'ASC']],
   });
}

async function getTeams() {
   return await db.teams.findAll({
      include: [
         {
            model: db.teamTypesLookup,
            as: 'teamType',
            where: {
               name: 'Sales',
            },
            include: [],
         },
      ],
   });
}

async function searchUsersByName(userNameSearch: string) {
   return await db.users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'fullName'],
      where: {
         firstName: {
            [Op.iLike]: `%${userNameSearch}%`,
         },
      },
      limit: 10,
      order: [['firstName', 'ASC']],
   });
}

async function getUsersByTeamId(teamId: string) {
   console.log('getting here');
   return await db.users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'fullName'],
      include: [
         {
            model: db.teamsUsers,
            as: 'teamUsers',
            where: {
               teamId: teamId,
            },
            attributes: [],
         },
      ],
      order: [['firstName', 'ASC']],
      limit: 50,
   });
}

async function getUsersByTeamTypeName(typeName: string) {
   return await db.users.findAll({
      include: [
         {
            model: db.teams,
            as: 'team',
            include: [
               {
                  model: db.teamTypesLookup,
                  as: 'teamType',
                  where: { name: typeName }, // Search by team type name instead of ID
               },
            ],
            through: {
               model: db.teamsUsers, // Explicitly specify the through model
               attributes: [], // Empty to not include any extra attributes
            },
         },
      ],
      order: [['firstName', 'ASC']],
      limit: 50,
   });
}
