import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { getObjectProp } from '@/utilities/helpers';

export async function GET(request: NextRequest) {
   try {
      const callRoutes = await db.callRoutes
         .findAll({
            include: [
               {
                  model: db.callRouteTypesLookup,
                  as: 'type',
                  required: false,
                  attributes: ['id', 'name'],
               },
               {
                  model: db.phoneNumbersOnCallRoutes,
                  as: 'phoneNumbersOnCallRoute',
                  required: false,
                  include: { model: db.phoneNumbers, required: false },
               },
               {
                  model: db.statusesOnCallRoutes,
                  as: 'statusesOnCallRoute',
                  required: false,
                  include: { model: db.statuses, required: false },
               },
            ],
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });
      return NextResponse.json(callRoutes, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function POST(request: NextRequest) {
   try {
      const reqBody = await request.json();

      const callRouteTypeId = getObjectProp(reqBody, ['type', 'id']);

      if (!callRouteTypeId) throw new LumError(400, `Invalid Call Route Type provided`);

      const createdCallRoute = await db.callRoutes.create({ ...reqBody, typeId: callRouteTypeId }).catch((err: any) => {
         throw new LumError(400, err);
      });

      if (callRouteTypeId === 'effeae2e-b875-4508-b7c4-41a390c8d85f') {
         // PHONE NUMBER TYPE ID
         if (!!reqBody?.phoneNumbersOnCallRoute?.length) {
            for (const numberOnRoute of reqBody?.phoneNumbersOnCallRoute) {
               if (numberOnRoute?.archived) continue;
               db.phoneNumbersOnCallRoutes.create({
                  callRouteId: createdCallRoute.id,
                  phoneNumberId: numberOnRoute?.phoneNumber?.id,
               });
            }
         }
      } else if (callRouteTypeId === 'aa8deed6-1bb5-4de1-b387-033e68c34c49') {
         // STATUS TYPE ID
         if (!!reqBody?.statusesOnCallRoute?.length) {
            for (const statusOnRoute of reqBody?.statusesOnCallRoute) {
               if (statusOnRoute?.archived) continue;
               db.statusesOnCallRoutes.create({
                  callRouteId: createdCallRoute.id,
                  statusId: statusOnRoute?.status?.id,
               });
            }
         }
      }

      if (!!reqBody?.actionsOnCallRoute?.length) {
         for (const action of reqBody?.actionsOnCallRoute) {
            if (!action?.type || action?.archived) continue;
            db.actionsOnCallRoutes.create({
               ...action,
               callRouteId: createdCallRoute.id,
               actionTypeId: action.type?.id,
               userIdsToDial: !!action.userIdsToDial?.length ? action.userIdsToDial : [],
               roleIdsToDial: !!action.roleIdsToDial?.length ? action.roleIdsToDial : [],
            });
         }
      }

      return NextResponse.json(createdCallRoute, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
