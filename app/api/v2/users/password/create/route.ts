import { NextResponse, NextRequest } from 'next/server';
import * as Yup from 'yup';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import argon2 from 'argon2';
import db from '@/sequelize/models';

async function createPassword(request: NextRequest) {
   try {
      const reqBody = await request.json();
      const createPwSchema: any = Yup.object({
         emailAddress: Yup.string().email().required('Email address is required.'),
         password: Yup.string().required('Password is required.'),
         tokenId: Yup.string().required('Token Id is required.'),
         userId: Yup.string().required('User Id is required.'),
      });
      await createPwSchema.validate(reqBody);

      let foundUser = await db.users.findByPk(reqBody.userId).then(deepCopy);

      if (!foundUser) throw new LumError(401, `User not found with email address: ${reqBody.emailAddress}`);

      // hashing the password stuff
      const passwordHash = await argon2.hash(reqBody.password);

      const updateUserRes = await db.users.update({ passwordHash: passwordHash }, { where: { id: foundUser.id } });

      // archive userKey...
      await db.usersKeys.update({ archived: true }, { where: { id: reqBody.tokenId } });

      return NextResponse.json({ id: updateUserRes.id, email: updateUserRes.emailAddress }, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createPassword as POST };
