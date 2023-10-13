import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';
import { foreignKeysExists, validateNotificationsArr } from './validators';
import Ably from 'ably/promises';
import { upsert } from '@/utilities/api/helpers';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, params: { params: { id: string } }) {
   try {
      const notes = await db.notes
         .findAll({
            order: [['createdAt', 'DESC']],
         })
         .catch((err: any) => console.log('err: ', err));
      return NextResponse.json(notes, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createNote(request: NextRequest) {
   try {
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

      if (!!reqBody?.notifications?.length) await validateNotificationsArr(reqBody);

      const createdNote = await db.notes.create(reqBody).catch((err: any) => {
         throw new LumError(400, err);
      });

      if (!!reqBody?.notifications?.length) {
         const client = new Ably.Realtime(`${process.env.ABLY_ROOT_KEY}`);
         for (const noti of reqBody?.notifications) {
            const notiId = await upsert({ ...noti, noteId: createdNote?.id }, 'notifications', db);

            const channel = client.channels.get(noti?.taggedUserId);
            const message = 'You have a new notification!';

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

      const newNoteWithAssociations = await db.notes
         .findByPk(createdNote.id, {
            include: [{ model: db.users, as: 'createdBy', attributes: { exclude: ['passwordHash'] } }],
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      return NextResponse.json(newNoteWithAssociations, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createNote as POST };
