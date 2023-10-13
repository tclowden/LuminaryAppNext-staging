import db from '@/sequelize/models';
import { Op } from 'sequelize'; 
import { transformToLuminaryCalendarEvent } from '@/utilities/calendar/helpers';
import { NextResponse, NextRequest } from 'next/server';

type AppointmentsWhereConditionsType = {
  startTime?: { [Op.gte]: Date };
  endTime?: { [Op.lte]: Date };
  [key: string]: any;
};

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
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

  const localStartDate = new Date(start);
  const localEndDate = new Date(end);

  // Convert local time to UTC
  const utcStartDate = new Date(localStartDate.getTime() + localStartDate.getTimezoneOffset() * 60000);
  const utcEndDate = new Date(localEndDate.getTime() + localEndDate.getTimezoneOffset() * 60000);

  // Extend the UTC date range to capture all relevant local dates
  const extendedUtcStartDate = new Date(utcStartDate.getTime() - 24 * 60 * 60 * 1000); // 1 day before
  const extendedUtcEndDate = new Date(utcEndDate.getTime() + 24 * 60 * 60 * 1000); // 1 day after


  let whereConditions: AppointmentsWhereConditionsType = {
    startTime: {
      [Op.gte]: extendedUtcStartDate
    },
    endTime: {
      [Op.lte]: extendedUtcEndDate
    }
  };

  try {
    const data = await db.installAppointments.findAll({
      where: whereConditions,
      subQuery: false,
      include: [
        {
          model: db.productsLookup,
          as: 'productsLookup',
          attributes: ['name'],
          where: filterValue ? { name: filterValue } : undefined
        },
        {
          model: db.leads,
          as: 'lead',
          attributes: ['firstName', 'lastName', 'streetAddress']
        },
        {
          model: db.teams,
          as: 'team',
          attributes: ['name']
        },
      ],
      order: [
        ['startTime', 'ASC']
      ]
    });

    const transformedData = data.map((item: any) => {
      if (item && item.lead && item.team && item.productsLookup) {
        return transformToLuminaryCalendarEvent(item, 'install');
      } else {
        return null;
      }
    }).filter((item: any) => item !== null);

    return NextResponse.json(transformedData);

  } catch (err) {
    console.error('Error fetching install appointments:', err);
    return NextResponse.json({ error: 'Error fetching install appointments' });
  }
}

//  export async function POST(request: NextRequest) {
//    const body = await request.json();

//    const newAppointment = {
//       startTime: new Date(body.startDate),
//       endTime: new Date(body.endDate),
//       teamId: body.team,
//       productId: body.product,
//       leadId: body.leadId,  // ??
//       orderId: body.orderId,   // ??
//       additionalUserIds: body.additionalUserIds || null,  
//    };

//    // let leadId = body.leadId;
//    // if (!leadId) {
//    //    const newLead = {
//    //    };
//    //    const createdLead = await db.leads.create(newLead).catch((err: any) => {
//    //       console.log('ERR: ', err);
//    //       return NextResponse.json({ error: 'Failed to create lead' });
//    //    });
//    //    leadId = createdLead.id;
//    // }
//    // newAppointment.leadId = leadId;

//    const appointment = await db.installAppointments
//       .create(newAppointment)
//       .catch((err: any) => {
//          console.log('ERR: ', err);
//          return NextResponse.json({ error: 'Failed to create appointment' });
//       });

//    return NextResponse.json(appointment);
// }

// export async function PUT(request: Request) {
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
