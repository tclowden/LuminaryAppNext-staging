import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function GET(request: NextRequest) {
   try {
      let products = await db.productsLookup
         .findAll({
            where: {
               proposalSupported: true,
            },
         })
         .catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

      let productsSorted = [] as string[];
      // I just want them in order. Otherwise it's EE first, which looks bad.
      const order = ['Solar', 'Energy Efficiency', 'HVAC', 'Battery'];
      order.forEach((e) => {
         const found = products.find((i: any) => {
            return i.name == e;
         });
         productsSorted.push(found);
      });

      const types = await db.proposalSystemTypesLookup.findAll().catch((err: any) => {
         console.log(err);
         throw new LumError(400, err);
      });

      // Got to add this one proposalProductOptions
      const productOptions = await db.proposalProductsConfig
         .findAll({
            include: {
               model: db.productsLookup,
               as: 'product',
            },
         })
         .catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

      const results = {
         success: true,
         products: productsSorted,
         types: types,
         productOptions: productOptions,
      };

      return NextResponse.json(results, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
