import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
   try {
      const modalConfigs = await db.statusTypes.findAll({
         include: [
            {
               model: db.statuses,
               as: 'statuses',
               attributes: [
                  [db.Sequelize.fn('COUNT', db.Sequelize.col('statuses.leads.id')), 'leadCount'],
                  'id',
                  'name',
                  'typeId',
               ],
               include: [
                  {
                     model: db.rulesOnStatuses,
                     as: 'rulesOnStatuses',
                     required: false,
                     include: [
                        {
                           model: db.statusRulesTypes,
                           as: 'statusRulesType',
                           required: false,
                        },
                     ],
                  },
                  {
                     model: db.leads,
                     as: 'leads',
                     required: false,
                     attributes: [], // Important! Ensures we don't fetch all the lead columns, just use it for the count.
                  },
               ],
            },
         ],
         order: [[{ model: db.statuses, as: 'statuses' }, 'name', 'ASC']],
         group: [
            'statusTypes.id',
            'statuses.id',
            'statuses->rulesOnStatuses.id',
            'statuses->rulesOnStatuses->statusRulesType.id',
         ],
      });

      return NextResponse.json(modalConfigs, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
