// 'use server';
import * as Jose from 'jose';
import { LumError } from '../models/LumError';
import Sequelize from 'sequelize';
import { randomBytes } from 'crypto';
import axios from 'axios';

const isClient = () => typeof window === 'object';

export const getUserDataFromHeaders = async (headers: Headers) => {
   const userOnClient = isClient();
   if (userOnClient) throw new LumError(304, `Can't get user data with token on the client...`);

   const token = headers.get('authorization')?.split(`Bearer `)[1];
   if (!token) return { errorMessage: 'Token not in headers...' };
   const result = await verifyToken(token);
   if (!result) return { errorMessage: 'Not getting user data from token... so token is invalid!' };
   return result;
};

export const verifyToken = async (token: string) => {
   if (!token) return;

   const userOnClient = isClient();
   if (userOnClient) throw new LumError(304, `Can't verify token on the client...`);

   const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
   const { payload } = await Jose.jwtVerify(token, secret);
   return payload;
};

export const generateToken = async (payload: object) => {
   const userOnClient = isClient();
   if (userOnClient) throw new LumError(304, `Can't generate token from the client...`);

   const alg = 'HS256';
   const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
   const token = await new Jose.SignJWT({ ...payload }).setProtectedHeader({ alg }).sign(secret);
   return token;
};

export const queryObjFormatter = (bodyObj: any, sequelizeConn: any) => {
   const isObject = (objValue: any) => objValue && typeof objValue === 'object' && objValue.constructor === Object;
   const isArray = (objValue: any) => Array.isArray(objValue);
   const isOperator = (objKey: any) => objKey.includes('Op.');

   const convertToSequelizeInclude = (obj: any) => {
      const include = { ...(obj.model && { model: sequelizeConn[obj.model] }) };
      if (obj.attributes) include.attributes = obj.attributes;
      if (obj.where) include.where = convertToSequelizeCondition(obj.where);
      if (obj.include) include.include = obj.include.map(convertToSequelizeInclude);
      if (obj.as) include.as = obj.as;
      if (typeof obj.required !== 'undefined') include.required = obj.required;
      // else { include = { ...include, ...obj } }
      return include;
   };

   const convertToSequelizeCondition = (obj: any) => {
      const newObj: any = {};

      // check to see if obj key:value is array type
      Object.entries(obj).forEach((tup) => {
         const [key, value] = tup;

         // check to see if value is an object type
         if (isObject(value) && !isArray(value)) {
            // @ts-ignore
            if (key === 'include') newObj[key] = convertToSequelizeInclude(value);
            // @ts-ignore
            else newObj[key] = convertToSequelizeCondition(value);
         }

         // check to see if value is an array type & the key is equal to include
         else if (isArray(value) && key === 'include') {
            // @ts-ignore
            newObj[key] = value.map(convertToSequelizeInclude);
         }

         // handle order key
         // just comment out if for some reason it stops working...
         // haven't tested much, but seems to work thus far
         // handles two formats of ordering from the query requests:
         // -- [[ 'createdAt', 'ASC' ]]
         // -- [[ { model: 'statuses', as: 'status' }, 'name', 'ASC' ]]
         else if (isArray(value) && key === 'order') {
            // defualt to empty array
            if (!Array.isArray(obj?.order[0])) newObj[key] = [];
            else {
               const [firstItem, secondItem, thirdItem] = obj.order[0];

               const cond1 = firstItem && typeof firstItem === 'string' && secondItem && typeof secondItem === 'string';
               const cond2 =
                  firstItem &&
                  typeof firstItem === 'object' &&
                  secondItem &&
                  typeof secondItem === 'string' &&
                  thirdItem &&
                  (thirdItem === 'ASC' || thirdItem === 'DESC');

               if (cond1) newObj[key] = value;
               else if (cond2) {
                  const orderModelConfig: { model: any; as?: string } = { model: null };
                  for (const key in firstItem) {
                     if (key === 'model') orderModelConfig['model'] = sequelizeConn[firstItem[key]];
                     else if (key === 'as') orderModelConfig['as'] = firstItem[key];
                  }
                  newObj[key] = [[orderModelConfig, secondItem, thirdItem]];
               } else newObj[key] = [];
            }
         }

         // check to see if key is an operator
         else if (isOperator(key)) {
            // split by the period, take the operator action (2nd value) & remove the ending ']'
            let operator = key.split('.')[1].slice(0, -1);
            // @ts-ignore
            let newKey = Sequelize.Op[operator];
            // @ts-ignore
            newObj[newKey] = value;
         }

         //
         else {
            // @ts-ignore
            newObj[key] = value;
         }
      });

      return newObj;
   };

   return convertToSequelizeCondition({ ...bodyObj });
};

export async function upsert(obj: any, tableName: string, dbConn: any) {
   // return back the id of the row destroyed, updated, or created
   let id = obj?.id || null;
   let rowAction: 'created' | 'updated' | 'deleted' | null = null;
   if (obj?.archived && obj?.id) {
      // soft delete the user on role
      // await dbConn[tableName].update({ deletedAt: new Date() }, { where: { id: obj?.id }, individualHooks: true });
      await dbConn[tableName].destroy({ where: { id: obj?.id }, individualHooks: true });
      rowAction = 'deleted';
   } else if (!obj?.archived && obj?.id) {
      // delete the archived key then update by id
      // delete obj['archived'];
      // set deleteAt to null... same as unarchiving a row
      obj['deletedAt'] = null;
      await dbConn[tableName].update(obj, { where: { id: obj?.id }, individualHooks: true, paranoid: false });
      rowAction = 'updated';
   } else if (!obj?.archived && !obj?.id) {
      // delete the archived & id key then create
      // delete obj['archived'];
      delete obj['id'];
      const createdRow = await dbConn[tableName].create(obj);
      id = createdRow?.id;
      rowAction = 'created';
   }

   return { id, rowAction };
}

export const generateRandomToken = () => randomBytes(64).toString('hex');

type BasicUser = { userId: string; firstName: string; emailAddress: string };
type KeyTypes = 'forgot_password' | 'register';
export async function sendEmailInvite(
   { userId, firstName, emailAddress }: BasicUser,
   keyTypeName: KeyTypes,
   dbConn: any
) {
   // create a hash/secret_key that will be the register key
   const randomGeneratedToken = generateRandomToken();

   // get 'register' key type from the db
   const keyType = await dbConn.keyTypesLookup.findOne({ where: { name: keyTypeName } });
   // get an expiration date for the token... 3 days
   const todayDate = new Date();
   const expirationDate = todayDate.setDate(todayDate.getDate() + 3);

   await dbConn.usersKeys.create({
      userId: userId,
      value: randomGeneratedToken,
      keyTypeId: keyType.id,
      archived: false,
      expiration: new Date(expirationDate),
   });

   // ZAP: 'Send Email to Set Up Password'
   await axios.post(`https://hooks.zapier.com/hooks/catch/1681335/bjstsat/`, {
      firstName: firstName,
      emailAddress: emailAddress,
      url: `${process.env.CLIENT_SITE}/create-password?token=${randomGeneratedToken}`,
   });
}
