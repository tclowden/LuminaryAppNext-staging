import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { foreignKeysExists } from './validators';

async function updateNotification(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id: notificationId } = options?.params;

      const reqBody = await request.json();

      const schema = Yup.object({
         // id: Yup.string().required(),
         notificationTypeId: Yup.string().required(),
         // notificationType: Yup.object({ id: Yup.string().required(), name: Yup.string().required() }).required(),
         taggedByUserId: Yup.string().required(),
         // could be a user tagged or a team tagged
         taggedUserId: Yup.string().required(),
         taggedTeamId: Yup.string().nullable(),
         complete: Yup.boolean().required(),
      });
      await schema.validate(reqBody);

      // validate the product exists by the id
      const notiExists = await db.notifications.findByPk(notificationId);
      if (!notiExists) throw new LumError(400, `Notification with id: ${notificationId} doesn't exist.`);

      await foreignKeysExists(reqBody);

      // delete the id out of the obj, don't want to rewrite the id...
      if (reqBody?.id) delete reqBody['id'];

      await db.notifications.update(reqBody, { where: { id: notificationId } }).catch((err: any) => {
         throw new LumError(400, err);
      });

      return NextResponse.json(`Notification with id: ${notificationId} successfully updated!`, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { updateNotification as PUT };
