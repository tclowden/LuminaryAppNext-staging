import db from '@/sequelize/models';
import { NextResponse, NextRequest } from 'next/server';
import { Op, fn, col } from 'sequelize'; // Import Sequelize operators and functions
import { getYear, startOfMonth, subDays, subMonths, subWeeks } from 'date-fns';

export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
   try {
      // Get the interval from the searchParam string
      const interval = request.nextUrl.searchParams.get('interval') || 'sixWeeks';

      // Get the interval from the intervalMap
      const apiInterval = intervalMap[interval as PrettyInterval];

      // Get all the userIds that are in the sales team
      const salesUsers = await getUserIdsByTeamType();

      // Get an array of userIds to query
      const userIdsToQuery = salesUsers.map((user: any) => user.userId);

      // Get the orderData and callLogsData for the userIds
      const orderData = await getOrderDataByUserIds(userIdsToQuery, apiInterval);
      const teamCallLogsData = await callLogsStats(userIdsToQuery, apiInterval);

      // Combine orderData and callLogsData and salesUser where orderData.createdById === callLogsData.userId
      const combinedData = salesUsers.map((user: any) => {
         const userOrderData = orderData.find((order: any) => {
            return order.createdById === user?.userId;
         });
         const userCallLogsData = teamCallLogsData.find((callLog: any) => {
            return callLog?.userId === user?.userId;
         });
         return {
            userId: user?.userId,
            office: user?.officeName,
            firstName: user?.firstName,
            lastName: user?.lastName,
            fullName: user?.fullName,
            totalRevenue: userOrderData?.dataValues?.total || 0,
            totalContracts: userOrderData?.dataValues?.totalOrders || 0,
            talkTime: userCallLogsData?.dataValues?.duration || 0,
            totalCalls: userCallLogsData?.dataValues?.totalCalls || 0,
         };
      });

      return NextResponse.json(combinedData);
   } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err });
   }
}

async function getUserIdsByTeamType() {
   const salesTeamId = await db.teamTypesLookup.findOne({
      where: {
         name: 'Sales',
      },
   });

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
            required: false,
            include: [
               {
                  model: db.users,
                  as: 'user',
                  attributes: ['id', 'firstName', 'lastName', 'fullName', 'officeId'],
                  required: false,
                  include: [
                     {
                        model: db.offices,
                        required: false,
                        as: 'office',
                     },
                  ],
               },
            ],
         },
      ],
   });

   const formattedUsers = users.map((teamUsers: any) => {
      return teamUsers?.teamUsers.map((teamUser: any) => {
         return {
            userId: teamUser.user.id,
            firstName: teamUser.user.firstName,
            lastName: teamUser.user.lastName,
            fullName: teamUser.user.fullName,
            officeName: teamUser.user?.offices?.name || 'N/A',
         };
      });
   });

   return formattedUsers.flat();
}

async function getOrderDataByUserIds(userIds: any, apiInterval: ApiIntervals) {
   const { startDate, endDate } = dateCalculation(apiInterval);
   // sum the total for each order the user has, and count the distinct orders
   const orderData = await db.orders.findAll({
      model: db.orders,
      attributes: [[fn('sum', col('total')), 'total'], 'createdById', [fn('count', col('id')), 'totalOrders']],
      where: {
         installSignedDate: {
            [Op.between]: [startDate, endDate],
         },
         createdById: {
            [Op.in]: userIds,
         },
      },
      group: ['createdById'],
   });

   return orderData;
}

// Gets the dials, Daily Average Talk Time, and Total Talk Time
async function callLogsStats(salesUserIds: any, apiInterval: ApiIntervals) {
   const { startDate, endDate } = dateCalculation(apiInterval);
   const dials = await db.callLogs.findAll({
      attributes: ['userId', [fn('sum', col('duration')), 'duration'], [fn('count', col('id')), 'totalCalls']],
      where: {
         userId: {
            [Op.in]: salesUserIds,
         },
         createdAt: {
            [Op.between]: [startDate, endDate],
         },
         direction: 'outbound',
      },
      group: ['userId'],
   });

   return dials;
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
