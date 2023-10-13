import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { Op } from 'sequelize';

// Gets the starting data for segments page
export async function GET(request: NextRequest) {
   try {
      const startingData = await getFilterColumns();
      return NextResponse.json(startingData, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function getFilterColumns() {
   try {
      const queries = [
         db.leadSources.findAll({
            attributes: ['id', ['name', 'columnValue']],
            order: [['name', 'ASC']],
         }),
         db.leadSourceTypes.findAll({
            attributes: ['id', ['typeName', 'columnValue']],
            order: [['typeName', 'ASC']],
         }),
         db.statuses.findAll({
            attributes: ['id', ['name', 'columnValue']],
            order: [['name', 'ASC']],
         }),
         db.statusTypes.findAll({
            attributes: ['id', ['name', 'columnValue']],
            order: [['name', 'ASC']],
         }),
      ];

      const results = await Promise.allSettled(queries);

      const startingColumnsWithValues = [
         {
            columnDisplayName: 'Lead Source',
            valueOptions: results[0].status === 'fulfilled' ? results[0].value : [],
         },
         {
            columnDisplayName: 'Lead Source Type',
            valueOptions: results[1].status === 'fulfilled' ? results[1].value : [],
         },
         {
            columnDisplayName: 'Status',
            valueOptions: results[2].status === 'fulfilled' ? results[2].value : [],
         },
         {
            columnDisplayName: 'Status Type',
            valueOptions: results[3].status === 'fulfilled' ? results[3].value : [],
         },
      ];

      // Handling the errors from the settled promises
      results.forEach((result, index) => {
         if (result.status === 'rejected') {
            console.error(`Query ${index} failed with reason: ${result.reason}`);
         }
      });

      return startingColumnsWithValues;
   } catch (err: any) {
      console.log('err:', err);
      throw new LumError(400, err);
   }
}
