import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { getObjectProp } from '@/utilities/helpers';

export async function GET(request: NextRequest, params: { params: { id: string } }) {
   try {
      if (!params.params.id) throw new LumError(400, `Invalid Id in params.`);

      const callRoute = await db.callRoutes
         .findByPk(params.params.id, {
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
               {
                  model: db.actionsOnCallRoutes,
                  as: 'actionsOnCallRoute',
                  required: false,
                  include: { model: db.callRouteActionTypesLookup, as: 'type', required: false },
               },
            ],
         })
         .catch((err: any) => {
            console.log('err:', err);
            throw new LumError(400, err);
         });

      if (!callRoute) throw new LumError(404, `Call Route with id: '${params.params.id}' could not be found`);

      return NextResponse.json(callRoute, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function PUT(request: NextRequest, options: { params: { id: string } }) {
   try {
      const callRouteId = options?.params?.id;
      if (!callRouteId) throw new LumError(400, `Must provide valid Call Route ID`);

      const reqBody = await request.json();

      const callRouteExists = await db.callRoutes.findByPk(callRouteId).catch((err: any) => {
         throw new LumError(400, err);
      });

      if (!callRouteExists) throw new LumError(400, `Call Route with id: '${callRouteId}', does not exist`);

      const callRouteTypeId = getObjectProp(reqBody, ['type', 'id']);

      const updatedCallRoute = await db.callRoutes
         .update({ ...reqBody, typeId: callRouteTypeId }, { where: { id: callRouteId }, returning: true })
         .then((res: any) => res[1][0] || res[1] || res)
         .catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

      if (callRouteTypeId === 'effeae2e-b875-4508-b7c4-41a390c8d85f') {
         // PHONE NUMBER TYPE ID
         await handleDestroyStatusesOnCallRoutes(reqBody);
         await handleCreatePhoneNumbersOnCallRoutes(reqBody, callRouteId);
      } else if (callRouteTypeId === 'aa8deed6-1bb5-4de1-b387-033e68c34c49') {
         // STATUS TYPE ID
         await handleDestroyPhoneNumbersOnCallRoutes(reqBody);
         await handleCreateStatusesOnCallRoutes(reqBody, callRouteId);
      }

      if (!!reqBody?.actionsOnCallRoute?.length) {
         for (const action of reqBody?.actionsOnCallRoute) {
            if (action?.tempId) {
               db.actionsOnCallRoutes.create({
                  ...action,
                  callRouteId: callRouteId,
                  actionTypeId: action.type?.id,
                  userIdsToDial: !!action.userIdsToDial?.length ? action.userIdsToDial : [],
                  roleIdsToDial: !!action.roleIdsToDial?.length ? action.roleIdsToDial : [],
               });
            } else {
               const actionTypeId = getObjectProp(action, ['type', 'id']);
               db.actionsOnCallRoutes.update({ ...action, actionTypeId }, { where: { id: action?.id } });
            }
         }
      }
      return NextResponse.json(updatedCallRoute, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function DELETE(request: NextRequest, options: { params: { id: string } }) {
   try {
      const callRouteId = options?.params?.id;
      if (!callRouteId) throw new LumError(400, `Invalid Call Route Id provided.`);

      await db.callRoutes.destroy({ where: { id: callRouteId }, individualHooks: true });

      return NextResponse.json({ success: true, message: 'Call Route successfully deleted.' }, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function handleCreatePhoneNumbersOnCallRoutes(reqBody: any, callRouteId: string) {
   try {
      if (!reqBody?.phoneNumbersOnCallRoute?.length) return;
      for (const numberOnRoute of reqBody?.phoneNumbersOnCallRoute) {
         if (numberOnRoute?.tempId) {
            await db.phoneNumbersOnCallRoutes.create({
               callRouteId: callRouteId,
               phoneNumberId: numberOnRoute?.phoneNumber?.id,
            });
         } else {
            if (numberOnRoute?.id && numberOnRoute?.archived) {
               await db.phoneNumbersOnCallRoutes.destroy({ where: { id: numberOnRoute?.id } });
            }
         }
      }
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function handleDestroyPhoneNumbersOnCallRoutes(reqBody: any) {
   try {
      if (!reqBody?.phoneNumbersOnCallRoute?.length) return;
      for (const numberOnRoute of reqBody.phoneNumbersOnCallRoute) {
         if (!numberOnRoute?.id) continue;
         await db.phoneNumbersOnCallRoutes.destroy({ where: { id: numberOnRoute.id } });
      }
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function handleCreateStatusesOnCallRoutes(reqBody: any, callRouteId: string) {
   try {
      if (!reqBody?.statusesOnCallRoute?.length) return;
      for (const statusOnRoute of reqBody?.statusesOnCallRoute) {
         if (statusOnRoute?.tempId) {
            await db.statusesOnCallRoutes.create({
               callRouteId: callRouteId,
               statusId: statusOnRoute?.status?.id,
            });
         } else {
            if (statusOnRoute?.id && statusOnRoute?.archived) {
               await db.statusesOnCallRoutes.destroy({ where: { id: statusOnRoute?.id } });
            }
         }
      }
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
async function handleDestroyStatusesOnCallRoutes(reqBody: any) {
   try {
      if (!reqBody?.statusesOnCallRoute?.length) return;
      for (const statusOnRoute of reqBody.statusesOnCallRoute) {
         if (!statusOnRoute?.id) continue;
         await db.statusesOnCallRoutes.destroy({ where: { id: statusOnRoute.id } });
      }
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
