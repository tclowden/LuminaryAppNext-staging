import db from '@/sequelize/models';
import { NextResponse } from 'next/server';
import { Op, fn, col, literal } from 'sequelize'; // Import Sequelize operators and functions

// This is currently for a single rep, we want these analytics for the entire sales floor also.
export async function POST(request: Request) {
   const body = await request.json();

   // Calculate the date range
   const curDate = new Date();
   const sixWeeksAgo = new Date(curDate);
   sixWeeksAgo.setDate(curDate.getDate() - 200); // 42 days = 6 weeks

   const data = await db.orders
      .findAll({
         attributes: [
            [fn('SUM', col('total')), 'totalAmount'],
            [fn('DATE_TRUNC', 'week', col('"installSignedDate"')), 'week'],
         ],
         where: {
            installSignedDate: {
               [Op.between]: [sixWeeksAgo, curDate],
            },
         },
         include: [
            {
               model: db.leads,
               as: 'lead',
               attributes: [],
               where: {
                  ownerId: body.repId,
               },
               include: [
                  {
                     model: db.statuses,
                     as: 'status',
                     where: { name: 'Customer' }, // Move your status filtering here
                     attributes: [],
                  },
                  {
                     model: db.rulesOnStatuses,
                     as: 'rulesOnStatuses',
                     include: [
                        {
                           model: db.statusRuleType,
                           as: 'statusRuleType',
                           where: { name: 'Count as revenue' },
                        },
                     ],
                  },
               ],
            },
         ],
         group: [literal('DATE_TRUNC(\'week\', "installSignedDate")'), col('lead.id')],
         order: [literal('DATE_TRUNC(\'week\', "installSignedDate")')],
      })
      .catch((err: any) => {
         console.log(err);
      });

   return NextResponse.json(data);
}
