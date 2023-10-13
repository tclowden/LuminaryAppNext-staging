import { NextRequest, NextResponse } from 'next/server';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { sendEmailInvite } from '@/utilities/api/helpers';

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const emailAddress = searchParams.get('email');
      const firstName = searchParams.get('firstName') || 'Unknown';
      const lastName = searchParams.get('lastName') || 'Name';
      const role = searchParams.get('role') || 'Super Admin';

      const foundUser = await db.users.findOne({ where: { emailAddress: emailAddress } }).then(deepCopy);
      if (foundUser) throw new LumError(400, `User with email: '${emailAddress}' already exists...`);

      let roleRes;
      if (role === 'Super Secret Dev') {
         // super secret dev
         roleRes = await db.roles.findByPk('b1421034-7ad9-40fc-bc3b-dc4f00c7e285').then(deepCopy);
      } else if (role === 'Admin') {
         // admin
         roleRes = await db.roles.findByPk('02d28634-d018-47c5-a4f6-ee528b44f92d').then(deepCopy);
      } else {
         // super admin
         roleRes = await db.roles.findByPk('dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6').then(deepCopy);
      }

      if (!roleRes) throw new LumError(400, `Role doesn't exist... did you run the latest migrations?`);

      const createdUser = await db.users
         .create({
            emailAddress: emailAddress,
            firstName: firstName,
            lastName: lastName,
            createdAt: new Date(),
            updatedAt: new Date(),
            prefersDarkMode: false,
            archived: false,
         })
         .then(deepCopy);

      // create row on rolesOnUsers with the default role
      await db.rolesOnUsers.create({ roleId: '1df5344f-99f0-4450-a1ad-7a752e61aab8', userId: createdUser?.id });

      // create the roleOnUser row with selected role
      await db.rolesOnUsers.create({ roleId: roleRes?.id, userId: createdUser.id });

      await sendEmailInvite(
         { userId: createdUser?.id, firstName: createdUser?.firstName, emailAddress: createdUser?.emailAddress },
         'register',
         db
      );

      return NextResponse.json({ createdUser }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
