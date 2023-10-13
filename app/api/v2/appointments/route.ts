import db from '@/sequelize/models';
import { Op } from 'sequelize'; 
import { transformToLuminaryCalendarEvent } from '@/utilities/calendar/helpers';
import { NextResponse, NextRequest } from 'next/server';

const MILLISECONDS_IN_A_MINUTE = 60000;

// Validate date string
const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

type WhereConditionsType = {
  appointmentTime?: {
    [Op.gte]?: Date;
    [Op.lte]?: Date;
  };
  [key: string]: any;
};

export async function GET(request: NextRequest) {
  const url = new URL(request.nextUrl);
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');
  const filterValue = url.searchParams.get('filterValue');

  // Validate 'start' and 'end' query parameters
  if (!start || !end || !isValidDate(start) || !isValidDate(end)) {
    return NextResponse.json({ error: 'Invalid start or end date' }, { status: 400 });
  }

  const localStartDate = new Date(start as string);
  const localEndDate = new Date(end as string);
  const utcStartDate = new Date(localStartDate.getTime() + localStartDate.getTimezoneOffset() * MILLISECONDS_IN_A_MINUTE);
  const utcEndDate = new Date(localEndDate.getTime() + localEndDate.getTimezoneOffset() * MILLISECONDS_IN_A_MINUTE);

  // Extend the UTC date range to capture all relevant local dates
  const extendedUtcStartDate = new Date(utcStartDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before
  const extendedUtcEndDate = new Date(utcEndDate.getTime() + 24 * 60 * 60 * 1000); // 1 day after

  let whereConditions: WhereConditionsType  = {
    appointmentTime: {
      [Op.gte]: extendedUtcStartDate,
      [Op.lte]: extendedUtcEndDate
    },
  };

  if (filterValue) {
    whereConditions['$createdBy.teamUsers.team.name$'] = filterValue;
  }

  try {
    const data = await db.appointments.findAll({
      where: whereConditions,
      subQuery: false,
      include: [
        {
          model: db.appointmentTypesLookup,
          as: 'appointmentType',
        },
        {
          model: db.leads,
          as: 'lead',
          attributes: ['firstName', 'lastName']
        },
        {
          model: db.users,
          as: 'createdBy',
          attributes: ['firstName', 'lastName'],
          include: [
            {
              model: db.teamsUsers,
              as: 'teamUsers',
              include: [
                {
                  model: db.teams,
                  as: 'team',
                  attributes: ['name'],
                }
              ]
            }
          ]
        }
      ],
      order: [
        ['appointmentTime', 'ASC']
      ]
    });

    const transformedData = data.map((item: any) => {
      if (item && item.lead && item.createdBy && item.appointmentType) {
        return transformToLuminaryCalendarEvent(item, item.appointmentType.name);
      } else {
        return null;
      }
    }).filter((item: any) => item !== null);
    return NextResponse.json(transformedData);
  } catch (err) {
    console.error('Error fetching Pitch appointments:', err);
    return NextResponse.json({ error: 'Error fetching Pitch appointments' });
  }
}

// export async function POST(request: Request) {
//    const body = await request.json();

//    const appointments = await db.appointments
//       .create({
//          ...body,
//       })
//       .catch((err: any) => {
//          console.log('ERR: ', err);
//       });

//    return NextResponse.json(appointments);
// }
