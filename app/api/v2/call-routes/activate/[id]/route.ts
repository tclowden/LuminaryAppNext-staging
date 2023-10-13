import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function PUT(request: NextRequest, params: { params: { id: string } }) {
   try {
      if (!params.params.id) throw new LumError(400, `Invalid Id in params.`);

      const reqBody = await request.json();

      const callRouteExists = await db.callRoutes.findByPk(params.params.id).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!callRouteExists) throw new LumError(400, `Call Route with id: "${params.params.id}" doesn't exist.`);

      const updatedCallRoute = await db.callRoutes
         .update({ active: reqBody?.active }, { where: { id: params.params.id }, returning: true })
         .then((res: any) => res[1][0] || res[1] || res)
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      return NextResponse.json(updatedCallRoute, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
