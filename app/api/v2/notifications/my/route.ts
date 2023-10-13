import db from '@/sequelize/models';
import { getUserDataFromHeaders, queryObjFormatter } from '@/utilities/api/helpers';
import { LumError } from '@/utilities/models/LumError';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

async function getCurrUserNotifications(request: NextRequest, options: any) {
   try {
      const nextHeaders = headers();
      const { id } = await getUserDataFromHeaders(nextHeaders);
      if (!id) throw new LumError(401, `Error getting user data from headers!`);

      const userNotificiations = await db.notifications.findAll({
         where: { taggedUserId: id, complete: false },
         include: [
            { model: db.notes, as: 'note', required: false },
            { model: db.notificationTypesLookup, as: 'notificationType', required: false },
            { model: db.users, as: 'taggedByUser', required: false, attributes: { exclude: ['passwordHash'] } },
         ],
      });
      return NextResponse.json(userNotificiations, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getCurrUserNotifications as GET };
