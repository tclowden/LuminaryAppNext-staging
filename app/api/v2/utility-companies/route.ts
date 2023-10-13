import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';

async function getUtilCompanies(request: NextRequest, options: any) {
   try {
      const utilCompanies = await db.utilityCompaniesLookup.findAll({
         include: [{ model: db.statesLookup, as: 'state', required: false }],
         order: [['name', 'ASC']],
      });
      return NextResponse.json(utilCompanies, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function createUtilCompany(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required(),
         stateId: Yup.string().required(),
         netMeter: Yup.boolean().required(),
         netMeteringTypeId: Yup.string().required(),
         connectionFee: Yup.string().required(),
         additionalCost: Yup.string().nullable(),
         specialNotes: Yup.string().nullable(),
      });
      await schema.validate(reqBody);

      // check to see if state exists... will return null if not there
      const stateIdExists = await db.statesLookup.findByPk(reqBody.stateId);
      if (!stateIdExists) throw new LumError(400, `State with id: ${reqBody.stateId} doesn't exist.`);

      // check to see if netMeteringType exists... will return null if not there
      const netMeteringTypeIdExists = await db.netMeteringTypesLookup.findByPk(reqBody.netMeteringTypeId);
      if (!netMeteringTypeIdExists)
         throw new LumError(400, `Net metering type with id: ${reqBody.netMeteringTypeId} doesn't exist.`);

      const createdElectricCompany = await db.utilityCompaniesLookup.create(reqBody);
      return NextResponse.json(createdElectricCompany, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getUtilCompanies as GET };
export { createUtilCompany as POST };
