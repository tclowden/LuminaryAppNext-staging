import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';

async function getTeamTypes(request: NextRequest, options: any) {
   try {
      const teamTypes = await db.teamTypesLookup.findAll({});
      return NextResponse.json(teamTypes, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createTeamType(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
      });
      await schema.validate(reqBody);

      // double check for duplications
      const teamTypeExists = await db.teamTypesLookup.findOne({ where: { name: reqBody.name } });
      if (teamTypeExists) throw new LumError(400, `Team type with name: '${reqBody.name}' already exists.`);

      const createTeamType = await db.teamTypesLookup.create(reqBody);

      return NextResponse.json(createTeamType, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { createTeamType as POST };
export { getTeamTypes as GET };
