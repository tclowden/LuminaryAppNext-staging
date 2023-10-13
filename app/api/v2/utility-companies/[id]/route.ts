import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';

async function getUtilCompanyById(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const utilityCompany = await db.utilityCompaniesLookup.findByPk(id, {
         include: [
            { model: db.statesLookup, as: 'state', required: false },
            { model: db.netMeteringTypesLookup, as: 'netMeteringType', required: false },
         ],
      });

      return NextResponse.json(utilityCompany, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function updateUtilCompany(request: NextRequest, options: any) {
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

      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      // validate that the utility company exists
      const utilityCompanyIdExists = await db.utilityCompaniesLookup.findByPk(id);
      if (!utilityCompanyIdExists) throw new LumError(400, `Utility company with id: '${id}' doesn't exist.`);

      // check to see if state exists... will return null if not there
      const stateIdExists = await db.statesLookup.findByPk(reqBody.stateId);
      if (!stateIdExists) throw new LumError(400, `State with id: ${reqBody.stateId} doesn't exist.`);

      // check to see if netMeteringType exists... will return null if not there
      const netMeteringTypeIdExists = await db.netMeteringTypesLookup.findByPk(reqBody.netMeteringTypeId);
      if (!netMeteringTypeIdExists)
         throw new LumError(400, `Net metering type with id: ${reqBody.netMeteringTypeId} doesn't exist.`);

      // delete the id out of the obj, don't want to rewrite the id...
      if (reqBody?.id) delete reqBody['id'];

      const updatedUtilityCompany = await db.utilityCompaniesLookup
         .update(reqBody, { where: { id: id }, returning: true })
         .then((res: any) => res[1][0] || res[1] || res);

      return NextResponse.json(updatedUtilityCompany, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function deleteUtilCompany(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      // validate that the utility company exists
      const utilityCompanyIdExists = await db.utilityCompaniesLookup.findByPk(id);
      if (!utilityCompanyIdExists) throw new LumError(400, `Utility company with id: '${id}' doesn't exist.`);

      await db.utilityCompaniesLookup.destroy({ where: { id: id }, individualHooks: true });

      return NextResponse.json(`Utility company successfully deleted.`, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getUtilCompanyById as GET };
export { updateUtilCompany as PUT };
export { deleteUtilCompany as DELETE };
