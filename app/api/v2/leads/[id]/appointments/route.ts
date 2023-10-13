import db from '@/sequelize/models';
// import { Op } from 'sequelize';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, params: { params: { id: string } }) {
   try {
      const leadAppointments = await db.appointments
         .findAll({
            where: {
               leadId: params.params.id,
            },
            include: [
               {
                  model: db.appointmentTypesLookup,
                  as: 'appointmentType',
               },
            ],
         })
         .catch((err: any) => console.log(err));

      return NextResponse.json(leadAppointments, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

/**
 * Appointment Cannot be set for past date
 */

export async function PUT(request: NextRequest, params: { params: { id: string } }) {
   try {
      const allowedAppointmentTypes = ['Lead Scheduled', 'User Scheduled'];

      let body = await request.json();

      if (!!body.appointmentType) {
         const appointmentType = await db.appointmentTypesLookup.findOne({
            where: {
               name: 'User Scheduled',
            },
         });
      }
      const appointment = await db.appointments.create({ ...body });

      return NextResponse.json(appointment, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
