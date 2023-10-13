import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';
import { foreignKeysExists, validateNotificationsArr } from '../validators';
import { upsert } from '@/utilities/api/helpers';
import Ably from 'ably/promises';
export const dynamic = 'force-dynamic';

async function getNote(request: NextRequest, params: { params: { id: string } }) {
   try {
      const notes = await db.notes.findByPk(params.params.id, { order: [['createdAt', 'DESC']] }).catch((err: any) => {
         console.log('ERR: ', err);
      });

      return NextResponse.json(notes, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateNote(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id: noteId } = options?.params;

      const reqBody = await request.json();
      const schema = Yup.object({
         createdById: Yup.string().required(),
         updatedById: Yup.string().nullable(),
         pinned: Yup.boolean().required(),
         content: Yup.string()
            .required()
            .when({
               is: (value: any) => typeof value === 'string',
               then: (schema: any) => {
                  return Yup.string().test(
                     'non-empty-string',
                     'Content must be greater than 0 characters',
                     (value: any) => {
                        if (value?.length > 0) return true;
                        else return false;
                     }
                  );
               },
            }),
         leadId: Yup.string().nullable(),
         orderId: Yup.string().nullable(),
         notifications: Yup.array().required(),
      });
      await schema.validate(reqBody);

      await foreignKeysExists(reqBody);

      if (!!reqBody?.notifications?.length) await validateNotificationsArr(reqBody, noteId);

      // update the note
      const updatedNote = await db.notes
         .update(reqBody, { where: { id: noteId }, returning: true })
         .then((res: any) => res[1][0] || res[1] || res)
         .catch((err: any) => {
            console.log('err in catch:', err);
         });

      if (!!reqBody?.notifications?.length) {
         const client = new Ably.Realtime(`${process.env.ABLY_ROOT_KEY}`);
         for (const noti of reqBody?.notifications) {
            const { id: notiId, rowAction } = await upsert({ ...noti, noteId: noteId }, 'notifications', db);

            const channel = client.channels.get(noti?.taggedUserId);
            let message = null;
            switch (rowAction) {
               case 'created':
                  message = 'You have a new notification!';
                  break;
               case 'updated':
                  message = 'Updated notification!';
                  break;
               default:
                  break;
            }
            if (message) {
               const path = reqBody?.orderId
                  ? `/installs/work-orders/${reqBody?.orderId}`
                  : `/marketing/leads/${reqBody?.leadId}`;

               await channel.publish({
                  name: 'notification',
                  data: {
                     message: message,
                     notificationId: notiId,
                     orderId: reqBody?.orderId,
                     leadId: reqBody?.leadId,
                     path: path,
                  },
               });
            }
         }
      }

      // const newNoteWithAssociations = await db.notes
      //    .findByPk(noteId, {
      //       include: [{ model: db.users, as: 'createdBy', attributes: { exclude: ['passwordHash'] } }],
      //    })
      //    .catch((err: any) => {
      //       throw new LumError(400, err);
      //    });

      return NextResponse.json(updatedNote, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function deleteNote(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const noteIdExists = await db.notes.findByPk(id);
      if (!noteIdExists) throw new LumError(400, `Note with id: ${id} doesn't exist...`);

      await db.notes.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json({ success: true, message: `Note successfully deleted.` }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getNote as GET };
export { updateNote as PUT };
export { deleteNote as DELETE };
