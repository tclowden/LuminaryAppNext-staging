import { NextResponse, NextRequest } from 'next/server';
import * as Yup from 'yup';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import argon2 from 'argon2';
import db from '@/sequelize/models';
import { generateToken } from '@/utilities/api/helpers';

export async function POST(request: NextRequest) {
   try {
      const reqBody = await request.json();
      const createUserSchema: any = Yup.object({
         emailAddress: Yup.string().email().required('Email Address is required'),
         password: Yup.string().required('Password is required.'),
      });
      await createUserSchema.validate(reqBody);

      const userFound = await db.users
         .unscoped()
         .findOne({
            where: { emailAddress: reqBody?.emailAddress },
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
                  model: db.phoneNumbersOnUsers,
                  as: 'phoneNumbersOnUser',
                  required: false,
                  include: { model: db.phoneNumbers, required: false },
               },
            ],
         })
         .then(deepCopy);

      const notificationCount = await db.notifications
         .count({ where: { taggedUserId: userFound?.id, complete: false } })
         .then(deepCopy);
      userFound['notificationCount'] = notificationCount;

      // if userFound returns null or the userFound is archived, throw an error
      if (!userFound) throw new LumError(401, `User not found with email address: ${reqBody.emailAddress}`);
      if (!userFound?.passwordHash)
         throw new LumError(401, 'User has no associated password. Reach out to HR to set that up.');

      // validate the passwordHash to the password being passed in the request
      // should return true or false
      const passwordMatch = await argon2.verify(userFound.passwordHash, reqBody.password);
      if (!passwordMatch) throw new LumError(401, 'Password is not valid. Please try again.');

      // delete the passwordHash out of the userFound object
      delete userFound['passwordHash'];

      // generate a token
      const payload = { emailAddress: userFound.emailAddress, id: userFound.id };
      const token = await generateToken(payload);

      return NextResponse.json({ ...userFound, token: token }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
