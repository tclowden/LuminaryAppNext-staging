import db from '@/sequelize/models';
import { sendEmailInvite } from '@/utilities/api/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';

async function inviteUser(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const userIdExists = await db.users.findByPk(id);
      if (!userIdExists) throw new LumError(400, `User with id: ${id} doesn't exist.`);

      if (userIdExists?.passwordHash)
         throw new LumError(400, `User already has a password set. Reset password if you've forgotten your password`);

      await sendEmailInvite(
         { userId: userIdExists?.id, firstName: userIdExists?.firstName, emailAddress: userIdExists?.emailAddress },
         'register',
         db
      );

      return NextResponse.json({ message: 'Invite sent! Check your email for a registration link.' }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { inviteUser as GET };
