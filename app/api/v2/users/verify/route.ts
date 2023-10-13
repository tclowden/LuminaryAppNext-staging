import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { verifyToken } from '@/utilities/api/helpers';

export async function GET(request: NextRequest) {
   try {
      const nextCookies = cookies();
      const token = nextCookies.get('LUM_AUTH')?.value;
      if (!token) throw new LumError(401, 'User token not available in cookies...');

      const tokenResult: any = await verifyToken(token);
      if (!tokenResult) throw new LumError(400, 'User token not valid!');

      let user = await db.users
         .findByPk(tokenResult?.id, {
            include: [
               {
                  model: db.rolesOnUsers,
                  as: 'rolesOnUser',
                  required: false,
                  include: [
                     {
                        model: db.roles,
                        required: false,
                        as: 'role',
                        include: [
                           {
                              model: db.permissionsOnRoles,
                              as: 'permissionsOnRole',
                              required: false,
                              include: [
                                 {
                                    model: db.permissions,
                                    required: false,
                                    as: 'permission',
                                    include: [{ model: db.pagesLookup, as: 'page', required: false }],
                                 },
                              ],
                           },
                        ],
                     },
                  ],
               },
               { model: db.offices, as: 'office', required: false },
               {
                  model: db.appointments,
                  required: false,
               },
               {
                  model: db.phoneNumbersOnUsers,
                  as: 'phoneNumbersOnUser',
                  required: false,
                  include: { model: db.phoneNumbers, required: false },
               },
            ],
         })
         .then(deepCopy);

      const notificationCount = await db.notifications
         .count({ where: { taggedUserId: user?.id, complete: false } })
         .then(deepCopy);
      user['notificationCount'] = notificationCount;

      // if user doesn't exist in the database
      if (!user) throw new LumError(401, 'User does not exist.');

      // delete the passwordHash before returning the obj to the client
      delete user['passwordHash'];

      return NextResponse.json({ ...user, token: token }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
