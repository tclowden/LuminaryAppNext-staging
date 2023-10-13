import db from '@/sequelize/models';
import { NextResponse } from 'next/server';
import { Op, fn, col, literal } from 'sequelize'; // Import Sequelize operators and functions
import { getYear, startOfMonth, subDays, subMonths, subWeeks } from 'date-fns';

/**
 * This endpoint is specific stats for sales reps.
 * Default the time range to be from cur date to six weeks in the past
 */
type dateInterval = { startDate: Date; endDate: Date };
type intervalLookup = {
   [key: string]: dateInterval;
};

const dateCalculation = (interval: string, start?: string, end?: string): dateInterval => {
   const now = new Date();
   const intervalLookup: intervalLookup = {
      today: {
         startDate: new Date(), //add hours
         endDate: now,
      },
      yesterday: {
         startDate: subDays(now, 1),
         endDate: now,
      },
      lastFullWeek: {
         startDate: subWeeks(now, 1),
         endDate: now,
      },
      monthToDate: {
         startDate: startOfMonth(now),
         endDate: now,
      },
      lastFullMonth: {
         startDate: subMonths(now, 1),
         endDate: now,
      },
      sixWeeks: {
         startDate: subWeeks(now, 6),
         endDate: now,
      },
      custom: {
         startDate: start ? new Date(start) : subWeeks(now, 6),
         endDate: end ? new Date(end) : now,
      },
   };

   return intervalLookup[interval] || { startDate: subWeeks(now, 6), endDate: now };
};

export async function POST(
   request: Request,
   params: { id: string; interval: string; startDate?: string; endDate?: string }
) {
   //Today, Yesterday, Week to Date, Last Full Week, Month to Date, Last Full Month, 6 week rolling (CURDATE() - INTERVAL 6 WEEK), custom (Takes in a start date and end date)
   const currentYear = getYear(new Date());
   const intervalDates = dateCalculation(params.interval, params.startDate, params.endDate);

   const appointmentsSet = await db.appointments.count({
      distinct: true,
      col: 'leadId',
      where: {
         createdById: params.id,
         appointmentTypeId: '28687c40-6880-4717-837a-03961ce47f21',
         createdAt: {
            [Op.between]: [intervalDates.startDate, intervalDates.endDate],
         },
      },
   });
   const appointmentsKept = await db.appointments.count({
      distinct: true,
      col: 'leadId',
      where: {
         createdById: params.id,
         kept: true,
         appointmentTypeId: '28687c40-6880-4717-837a-03961ce47f21', //make it dynamic from user scheduled
         createdAt: {
            [Op.between]: [intervalDates.startDate, intervalDates.endDate],
         },
      },
   });
   const leadsInPipe = await db.statusHistory.findAll({
      attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('leadId')), 'leadId']],
      include: [
         {
            model: db.statuses,
            as: 'status',
            where: {
               dplStatus: true,
            },
            attributes: [],
         },
      ],
      where: {
         userId: params.id,
         updatedAt: {
            [Op.between]: [intervalDates.startDate, intervalDates.endDate],
         },
      },
   });
   const yearEndRevenue = await db.orders.sum('total', {
      include: [
         {
            model: db.leads,
            as: 'lead',
            where: {
               statusId: 'c6be565a-49e4-4b94-9f2b-dd0a5a5b3a64', // join status table
            },
         },
      ],
      where: {
         ownerId: params.id,
         installSignedDate: {
            [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`],
         },
      },
   });
   const orderIntervalAvg = await db.orders.findAll({
      attributes: [
         [fn('SUM', col('total')), 'totalAmount'],
         [fn('DATE_TRUNC', 'week', col('"installSignedDate"')), 'week'],
      ],
      where: {
         installSignedDate: {
            [Op.between]: [intervalDates.startDate, intervalDates.endDate],
         },
      },
      include: [
         {
            model: db.leads,
            as: 'lead',
            attributes: [],
            where: {
               ownerId: params.id,
            },
            include: [
               {
                  model: db.statuses,
                  as: 'status',
                  where: { name: 'Customer' },
                  attributes: [],
               },
            ],
         },
      ],
      group: [literal('DATE_TRUNC(\'week\', "installSignedDate")'), col('lead.id')],
      order: [literal('DATE_TRUNC(\'week\', "installSignedDate")')],
   });

   const body = await request.json();
   const data = {
      params: params,
   };
   return NextResponse.json(data);
}

// TODO: Convert the sql to sequelize
// TODO: Make a filter for the date ranges,
//  Today, Yesterday, Week to Date, Last Full Week, Month to Date, Last Full Month, 6 week rolling (CURDATE() - INTERVAL 6 WEEK), custom (Takes in a start date and end date)

// Appointments SET
//  select
//   COUNT(DISTINCT "leadId") AS "apSet"
//   from appointments
//   WHERE "createdById" = ?
//   AND "appointmentTypeId" = '28687c40-6880-4717-837a-03961ce47f21'
//  AND DATE(o."createdAt") BETWEEN CURRENT_DATE - INTERVAL '42 DAYS' AND CURRENT_DATE;

//DONE

// Appointments Kept
// select
// COUNT(DISTINCT "leadId") AS "apSet"
// from appointments
// WHERE "createdById" = ?
// AND kept = 'true'
// AND "appointmentTypeId" = '28687c40-6880-4717-837a-03961ce47f21'
// AND DATE(o."createdAt") BETWEEN CURRENT_DATE - INTERVAL '42 DAYS' AND CURRENT_DATE;

//DONE

// Leads in pipe
// select distinct "leadId"
// FROM "statusHistory" sh
// JOIN statuses s ON s.id = sh."statusId"
// WHERE s."dplStatus" = 'true' /* Count Towards DPL */
// AND sh."userId" = ? /* ADD IN THE VARIABLE */
// AND sh."updatedAt" BETWEEN CURRENT_DATE - INTERVAL '42 DAYS' AND CURRENT_DATE

//DONE

// Score Year End Revenue
// SELECT
// 	SUM(o.total) as "yearWrap"
// FROM
// 	orders o
// JOIN
// 	leads l on o."leadId" = l.id
// WHERE
// 	o."ownerId" = ? /* NEED TO INSERT VARIABLE */
// 	AND l."statusId" = 'c6be565a-49e4-4b94-9f2b-dd0a5a5b3a64' /* CUSTOMER */
// 	AND EXTRACT(YEAR FROM o."installSignedDate") = EXTRACT(YEAR FROM CURRENT_DATE);

//DONE

// 6 week average total sales
