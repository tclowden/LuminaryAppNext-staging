import db from '@/sequelize/models';
import { NextResponse, NextRequest } from 'next/server';
import { Op } from 'sequelize'; // Import Sequelize operators and functions
import { getYear, startOfMonth, subDays, subMonths, subWeeks } from 'date-fns';

type PrettyInterval =
   | 'Today'
   | 'Yesterday'
   | 'Last Full Week'
   | 'Month To Date'
   | 'Last Full Month'
   | 'Year To Date'
   | 'Six Week Rolling';

type dateInterval = { startDate: Date; endDate: Date };

type intervalLookup = {
   [key: string]: dateInterval;
};

type ApiIntervals =
   | 'today'
   | 'yesterday'
   | 'lastFullWeek'
   | 'yearToDate'
   | 'monthToDate'
   | 'lastFullMonth'
   | 'sixWeeks';

// Create a map to turn the pretty interval into the api interval
const intervalMap: { [key in PrettyInterval]: ApiIntervals } = {
   Today: 'today',
   Yesterday: 'yesterday',
   'Last Full Week': 'lastFullWeek',
   'Month To Date': 'monthToDate',
   'Last Full Month': 'lastFullMonth',
   'Year To Date': 'yearToDate',
   'Six Week Rolling': 'sixWeeks',
};

const COUNT_AS_REVENUE = 'Count As Revenue';

export async function GET(request: NextRequest) {
   try {
      // these are all the statuses that will be included in revenue calculations
      const ids = await getCountAsRevenueStatusIds();

      // Reports will only count if the user is in the sales team
      const salesTeamId = await db.teamTypesLookup.findOne({
         where: {
            name: 'Sales',
         },
      });

      // Get all the userIds that are in the sales team
      const salesUsers = await getUserIdsByTeamType(salesTeamId);

      const [
         ytdRev,
         todayRev,
         weekToDateRev,
         monthToDateRev,
         sixWeeksRev,
         talkTimeToday,
         setAppointments,
         signedContractsToday,
         sixWeekRevGroupedByWeek,
         dashboardGoals,
      ] = await Promise.all([
         getYearToDateRevenue(ids),
         getTodayRevenue(ids),
         getWeekToDateRevenue(ids),
         getMonthToDateRevenue(ids),
         getSixWeeksRevenue(ids),
         getGlobalTalkTimeToday(salesUsers),
         getSetAppointments(salesUsers),
         getSignedContractsToday(salesUsers),
         getSixWeeksRevenueGroupedByWeeks(ids, salesUsers),
         getDashboardGoals(),
      ]);

      return NextResponse.json({
         ytdRev: ytdRev[0].totalSum,
         todayRev: todayRev[0].totalSum,
         weekToDateRev: weekToDateRev[0].totalSum,
         monthToDateRev: monthToDateRev[0].totalSum,
         sixWeeksRev: sixWeeksRev[0].totalSum,
         talkTimeToday: talkTimeToday[0]?.totalSum || 0,
         setAppointments: setAppointments[0]?.totalSum || 0,
         signedContractsToday: signedContractsToday[0]?.totalSum || 0,
         sixWeekRevGroupedByWeek: sixWeekRevGroupedByWeek,
         dashboardGoals: dashboardGoals,
      });
   } catch (err: any) {
      return NextResponse.json({ error: err.message });
   }
}

async function getDashboardGoals() {
   return await db.orgSettings.findOne();
}

async function getSixWeeksRevenueGroupedByWeeks(ids: string[], salesUsers: any[]) {
   const { startDate, endDate } = dateCalculation('sixWeeks');

   return await db.orders.findAll({
      attributes: [
         [db.sequelize.fn('SUM', db.sequelize.col('orders.total')), 'totalSum'],
         [db.sequelize.fn('date_trunc', 'week', db.sequelize.col('orders.installSignedDate')), 'week'],
      ],
      include: [
         {
            model: db.leads,
            as: 'lead',
            attributes: [],
            where: {
               statusId: {
                  [Op.in]: ids,
               },
            },
         },
      ],
      where: {
         installSignedDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
         },
         createdById: {
            [Op.in]: salesUsers,
         },
      },
      group: [db.sequelize.fn('date_trunc', 'week', db.sequelize.col('orders.installSignedDate'))],
      raw: true,
   });
}
async function getSignedContractsToday(salesUsers: any[]) {
   const { startDate, endDate } = dateCalculation('today');

   return await db.orders.findAll({
      attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('orders.id')), 'totalSum']],
      where: {
         createdById: {
            [Op.in]: salesUsers,
         },
         installSignedDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
         },
      },
      raw: true,
   });
}

async function getSetAppointments(salesUsers: any[]) {
   const { startDate, endDate } = dateCalculation('today');

   return await db.appointments.findAll({
      attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('appointments.leadId')), 'totalSum']],
      where: {
         createdById: {
            [Op.in]: salesUsers,
         },
         createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
         },
      },
      raw: true,
   });
}

async function getGlobalTalkTimeToday(salesUsers: any[]) {
   const { startDate, endDate } = dateCalculation('today');

   return await db.callLogs.findAll({
      attributes: [[db.sequelize.fn('SUM', db.sequelize.col('callLogs.duration')), 'totalSum']],
      where: {
         direction: 'outbound',
         userId: {
            [Op.in]: salesUsers,
         },
         createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
         },
      },
      raw: true,
   });
}

async function getUserIdsByTeamType(salesTeamId: any) {
   const users = await db.teams.findAll({
      attributes: ['id', 'name'],
      where: {
         teamTypeId: salesTeamId.id,
      },
      include: [
         {
            model: db.teamsUsers,
            as: 'teamUsers',
            attributes: ['id'],
            include: [
               {
                  model: db.users,
                  as: 'user',
                  attributes: ['id'],
                  required: false,
               },
            ],
         },
      ],
   });

   const formattedUsers = users.map((teamUsers: any) => {
      return teamUsers?.teamUsers.map((teamUser: any) => teamUser.user.id);
   });
   return formattedUsers.flat();
}

async function getYearToDateRevenue(ids: string[]) {
   const { startDate, endDate } = dateCalculation('yearToDate');

   return await db.orders.findAll({
      attributes: [[db.sequelize.fn('SUM', db.sequelize.col('orders.total')), 'totalSum']],
      include: [
         {
            model: db.leads,
            as: 'lead',
            attributes: [],
            where: {
               statusId: {
                  [Op.in]: ids,
               },
            },
         },
      ],
      where: {
         installSignedDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
         },
      },
      raw: true,
   });
}

async function getTodayRevenue(ids: string[]) {
   const { startDate, endDate } = dateCalculation('today');

   return await db.orders.findAll({
      attributes: [[db.sequelize.fn('SUM', db.sequelize.col('orders.total')), 'totalSum']],
      include: [
         {
            model: db.leads,
            as: 'lead',
            attributes: [],
            where: {
               statusId: {
                  [Op.in]: ids,
               },
            },
         },
      ],
      where: {
         installSignedDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
         },
      },
      raw: true,
   });
}

async function getWeekToDateRevenue(ids: string[]) {
   const { startDate, endDate } = dateCalculation('lastFullWeek');

   return await db.orders.findAll({
      attributes: [[db.sequelize.fn('SUM', db.sequelize.col('orders.total')), 'totalSum']],
      include: [
         {
            model: db.leads,
            as: 'lead',
            attributes: [],
            where: {
               statusId: {
                  [Op.in]: ids,
               },
            },
         },
      ],
      where: {
         installSignedDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
         },
      },
      raw: true,
   });
}

async function getMonthToDateRevenue(ids: string[]) {
   const { startDate, endDate } = dateCalculation('monthToDate');

   return await db.orders.findAll({
      attributes: [[db.sequelize.fn('SUM', db.sequelize.col('orders.total')), 'totalSum']],
      include: [
         {
            model: db.leads,
            as: 'lead',
            attributes: [],
            where: {
               statusId: {
                  [Op.in]: ids,
               },
            },
         },
      ],
      where: {
         installSignedDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
         },
      },
      raw: true,
   });
}
async function getSixWeeksRevenue(ids: string[]) {
   const { startDate, endDate } = dateCalculation('sixWeeks');

   return await db.orders.findAll({
      attributes: [[db.sequelize.fn('SUM', db.sequelize.col('orders.total')), 'totalSum']],
      include: [
         {
            model: db.leads,
            as: 'lead',
            attributes: [],
            where: {
               statusId: {
                  [Op.in]: ids,
               },
            },
         },
      ],
      where: {
         installSignedDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
         },
      },
      raw: true,
   });
}
/**
 * HELPERS
 * @returns statusIds that are included in revenue calculations
 */
async function getCountAsRevenueStatusIds() {
   return await db.rulesOnStatuses
      .findAll({
         attributes: ['statusId'],
         include: [
            {
               model: db.statusRulesTypes,
               as: 'statusRulesType',
               attributes: [],
               where: {
                  name: COUNT_AS_REVENUE,
               },
            },
         ],
         raw: true,
      })
      .then((ids: any) => ids.map((id: any) => id.statusId));
}

const dateCalculation = (interval: ApiIntervals): dateInterval => {
   const now = new Date();

   const intervalLookup: intervalLookup = {
      today: {
         startDate: new Date(),
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
      yearToDate: {
         startDate: new Date(`${getYear(now)}-01-01`),
         endDate: now,
      },
   };

   return intervalLookup[interval] || { startDate: subWeeks(now, 6), endDate: now };
};
