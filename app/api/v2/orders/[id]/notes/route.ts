// THIS IS NOT BEING USED!

// import db from '@/sequelize/models';
// import { LumError } from '@/utilities/models/LumError';
// import { NextRequest, NextResponse } from 'next/server';
// import * as Yup from 'yup';
// import { foreignKeysExists } from './validators';

// export const dynamic = 'force-dynamic';

// async function createNoteOnOrder(request: NextRequest, options: any) {
//    try {
//       if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
//       const { id } = options?.params;

//       const reqBody = await request.json();
//       const schema = Yup.object({
//          createdById: Yup.string().required(),
//          updatedById: Yup.string().nullable(),
//          pinned: Yup.boolean().required(),
//          content: Yup.string()
//             .required()
//             .when({
//                is: (value: any) => typeof value === 'string',
//                then: (schema: any) => {
//                   return Yup.string().test(
//                      'non-empty-string',
//                      'Content must be greater than 0 characters',
//                      (value: any) => {
//                         if (value?.length > 0) return true;
//                         else return false;
//                      }
//                   );
//                },
//             }),
//       });
//       await schema.validate(reqBody);

//       // validate the product exists by the id
//       const orderExists = await db.orders.findByPk(id);
//       if (!orderExists) throw new LumError(400, `Order with id: ${id} doesn't exist.`);

//       // MAKE SURE ALL FOREIGN KEYS CHECK OUT
//       await foreignKeysExists(reqBody);

//       // create the note
//       const createdNote = await db.notes.create({
//          ...reqBody,
//          orderId: id,
//       });

//       return NextResponse.json(createdNote, { status: 200 });
//    } catch (err: any) {
//       console.log('err:', err);
//       return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
//    }
// }

// export { createNoteOnOrder as POST };

export async function GET() {}
