import { NextRequest, NextResponse } from 'next/server';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import * as Yup from 'yup';
import { randomBytes } from 'crypto';
import axios from 'axios';
import db from '@/sequelize/models';
import { generateRandomToken } from '@/utilities/api/helpers';

export async function POST(request: NextRequest) {
   try {
      // const res = await fetch('https://data.mongodb-api.com/...', {
      //    method: 'POST',
      //    headers: {
      //       'Content-Type': 'application/json',
      //    },
      //    body: JSON.stringify({ time: new Date().toISOString() }),
      // });
      const reqBody = await request.json();
      const createUserSchema: any = Yup.object({
         emailAddress: Yup.string().email().required('Email Address is required'),
      });
      await createUserSchema.validate(reqBody);

      const userExists = await db.users.findOne({ where: { emailAddress: reqBody?.emailAddress } }).then(deepCopy);
      if (!userExists) throw new LumError(304, `User not found with email: ${reqBody?.emailAddress}.`);

      // create a hash/secret_key that will be the register key
      const randomGeneratedToken = generateRandomToken();

      // get 'register' key type from the db
      const keyType = await db.keyTypesLookup.findOne({ where: { name: 'forgot_password' } });
      if (!keyType) throw new LumError(400, `Keytype not found... please contact HR.`);

      // get an expiration date for the token... 3 days
      const todayDate = new Date();
      const expirationDate = todayDate.setDate(todayDate.getDate() + 3);
      const userKeyToWrite = {
         userId: userExists?.id,
         value: randomGeneratedToken,
         keyTypeId: keyType.id,
         archived: false,
         expiration: new Date(expirationDate),
         createdAt: new Date(),
      };

      // store the random token in the db
      await db.usersKeys.create(userKeyToWrite);

      // ZAP: 'Send Email to Reset Password'
      await axios
         .post(`https://hooks.zapier.com/hooks/catch/1681335/bvb4v1k/`, {
            firstName: userExists?.firstName,
            emailAddress: userExists?.emailAddress,
            url: `${process.env.CLIENT_SITE}/reset-password?token=${randomGeneratedToken}`,
         })
         .catch((err) => {
            throw new LumError(500, err);
         });

      return NextResponse.json({ ...userExists }, { status: 200 });
   } catch (err: any) {
      console.log('err', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
