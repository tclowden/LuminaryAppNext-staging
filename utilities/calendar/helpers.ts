import { MutableRefObject } from 'react';
import FullCalendar from '@fullcalendar/react';

export const getPlaceholder = (selectedView: string, date: Date, ref: MutableRefObject<FullCalendar>) => {
  let calendarApi = ref?.current?.getApi();

  if (!calendarApi || !calendarApi.view) {
    return '';
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  switch (selectedView) {
    case 'dayGridMonth':
      const monthStart = new Date(calendarApi.view.currentStart);
      return `${monthNames[monthStart.getMonth()]} ${monthStart.getFullYear()}`;
    case 'dayGridWeek':
      const weekStart = new Date(calendarApi.view.currentStart);
      const weekEnd = new Date(calendarApi.view.currentEnd);
      weekEnd.setDate(weekEnd.getDate() - 1);
      return `${monthShortNames[weekStart.getMonth()]} ${weekStart.getDate()} – ${monthShortNames[weekEnd.getMonth()]} ${weekEnd.getDate()}  ${weekEnd.getFullYear()}`;
    case 'dailyView':
      return `${monthShortNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
    default:
      return '';
  }
};

export const isToday = (date: Date) => {
   const today = new Date();
   return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
   );
};

export const getCurrentTimeZone = () => {
  // Get the IANA time zone name (e.g., "America/New_York")
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Get the time zone offset in minutes (e.g., -240 for Eastern Daylight Time)
  const offsetMinutes = new Date().getTimezoneOffset();

  // Get the absolute value of the time zone offset in minutes (e.g., 240)
  const absoluteOffsetMinutes = Math.abs(offsetMinutes);

  // Calculate the time zone offset in hours (e.g., 4)
  const offsetHours = Math.floor(absoluteOffsetMinutes / 60);

  // Calculate the remaining minutes after extracting the hours (e.g., 0)
  const remainingMinutes = absoluteOffsetMinutes % 60;

  // Determine the sign of the time zone offset (e.g., "-" for Eastern Daylight Time)
  const offsetSign = offsetMinutes > 0 ? "-" : "+";

  // Format the time zone offset as a string (e.g., "-04:00")
  const formattedOffset = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;

  return `${timeZone} (UTC${formattedOffset})`;
};

export function transformToLuminaryCalendarEvent(data: any, type: string) {
  let result;

  switch (type) {
    case 'Lead Scheduled':
    case 'User Scheduled': {
      const startDate = new Date(data.appointmentTime);
      const endDate = new Date(startDate.getTime());
      endDate.setHours(endDate.getHours() + 1);
      result = {
        start: startDate,
        end: endDate,
        allDay: false,
        extendedProps: {
          start: startDate,
          end: endDate,
          customerName: `${data.lead.firstName} ${data.lead.lastName}`,
          consultant: `${data.createdBy.firstName} ${data.createdBy.lastName}`,
          kept: data.kept,
          teamName: data.createdBy.teamUsers[0].team.name,
          appointmentID: data.id,
          appointmentType: data.appointmentType.name.toUpperCase()
        },
      };
      break;
    }
    case 'install': {
      const startDate = new Date(data.startTime);
      const endDate = new Date(data.endTime);
      result = {
        start: startDate,
        end: endDate,
        allDay: false,
        extendedProps: {
          customerName: `${data.lead.firstName} ${data.lead.lastName}`,
          installTeam: data.team.name,
          start: startDate,
          end: endDate,
          installAddress: data.lead.streetAddress,
          product: data.productsLookup.name,
          appointmentID: data.id,
          appointmentType: 'JOB'
        },
      };
      break;
    }
    default:
      throw new Error(`Unsupported type: ${type}`);
  }

  return result;
}