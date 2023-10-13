// THIS IS NOT BEING USED...

// import db from '@/sequelize/models';
// import { LumError } from '@/utilities/models/LumError';

// export const foreignKeysExists = async (reqBody: any) => {
//    const userExists = await db.users.findByPk(reqBody?.createdById).catch((err: any) => {
//       throw new LumError(400, `Error finding user: createdById`);
//    });
//    if (!userExists) throw new LumError(400, `createdById: ${reqBody?.createdById} doesn't exist.`);

//    if (reqBody?.updatedById && reqBody?.updatedById !== reqBody?.createdById) {
//       const userExists = await db.users.findByPk(reqBody.updatedById).catch((err: any) => {
//          throw new LumError(400, `Error finding user: updatedById`);
//       });
//       if (!userExists) throw new LumError(400, `updatedById: ${reqBody.updatedById} doesn't exist.`);
//    }
// };

export {};
