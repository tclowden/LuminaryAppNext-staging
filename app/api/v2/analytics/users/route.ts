import db from '@/sequelize/models';
import { NextResponse } from 'next/server';
import { Op, fn, col, literal } from 'sequelize'; // Import Sequelize operators and functions

// This endpoint needs to grab the same data in the users/${id} endpoint but for all sales roles users
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
