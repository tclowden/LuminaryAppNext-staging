import { NextResponse, NextRequest } from 'next/server';
import * as Yup from 'yup';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import argon2 from 'argon2';
import db from '@/sequelize/models';

async function resetPassword(request: NextRequest) {
   try {
      const reqBody = await request.json();
      const createPwSchema: any = Yup.object({
         emailAddress: Yup.string().email().required('Email address is required.'),
         password: Yup.string().required('Password is required.'),
         tokenId: Yup.string().required('Token Id is required.'),
         userId: Yup.string().required('User Id is required.'),
      });
      await createPwSchema.validate(reqBody);

      let foundUser = await db.users.unscoped().findByPk(reqBody.userId).then(deepCopy);
      if (!foundUser) throw new LumError(401, `User not found with email address: ${reqBody.emailAddress}`);

      // checking for duplicate pws
      if (foundUser.passwordHash) {
         const passwordsMatch = await argon2.verify(foundUser.passwordHash, reqBody.password);
         if (passwordsMatch) throw new LumError(404, `User cannot use the same password as before.`);
      }

      // hashing the password stuff
      const passwordHash = await argon2.hash(reqBody.password);

      const updateUserRes = await db.users
         .update(
            { passwordHash: passwordHash },
            { where: { id: foundUser.id, emailAddress: foundUser.emailAddress }, returning: true }
         )
         .then((res: any) => res[1][0] || res[1] || res);

      // archive userKey...
      await db.usersKeys.update({ archived: true }, { where: { id: reqBody.tokenId } });

      return NextResponse.json({ id: updateUserRes.id, email: updateUserRes.emailAddress }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { resetPassword as POST };
