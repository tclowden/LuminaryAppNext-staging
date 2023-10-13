// THIS IS NOT BEING USED!

// import db from '@/sequelize/models';
// import { LumError } from '@/utilities/models/LumError';
// import { NextRequest, NextResponse } from 'next/server';
// import * as Yup from 'yup';
// import { foreignKeysExists } from '../validators';

// export const dynamic = 'force-dynamic';

// async function updateNoteOnOrder(request: NextRequest, options: any) {
//    try {
//       if (!options?.params?.id || !options?.params?.noteOnOrderId) throw new LumError(400, `Invalid id in params`);
//       const { id, noteOnOrderId } = options?.params;

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

//       // validate the order exists by the id
//       const orderExists = await db.orders.findByPk(id);
//       if (!orderExists) throw new LumError(400, `Order with id: ${id} doesn't exist.`);

//       // validate the note exists by the id
//       const noteExists = await db.notes.findByPk(noteOnOrderId);
//       if (!noteExists) throw new LumError(400, `Note with id: ${noteOnOrderId} doesn't exist.`);

//       // MAKE SURE ALL FOREIGN KEYS CHECK OUT
//       await foreignKeysExists(reqBody);

//       // delete virtual fields
//       delete reqBody['createdAtPretty'];
//       delete reqBody['updatedAtPretty'];

//       // create the note
//       const updatedNote = await db.notes
//          .update(reqBody, { where: { id: noteOnOrderId }, returning: true })
//          .then((res: any) => res[1][0] || res[1] || res)
//          .catch((err: any) => {
//             console.log('err in catch:', err);
//          });

//       return NextResponse.json(updatedNote, { status: 200 });
//    } catch (err: any) {
//       console.log('err:', err);
//       return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
//    }
// }

// export { updateNoteOnOrder as PUT };

export async function GET() {}
