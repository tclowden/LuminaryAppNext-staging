'use client';
import Calendar from '@/common/components/calendar/Calendar';
import MyCalendarEventContent from './(partials)/MyCalendarEventContent';

const MyCalendar = () => {
   return (
      <>
         <Calendar eventsFetchUrl='/api/v2/appointments' showFilterButton={false} secondEventsFetchUrl='/api/v2/install-appointments' CustomWeekEventContent={MyCalendarEventContent} defaultClickChangeView={'dayGridWeek'} eventContentIcon='Users' hideView='daily'/>
      </>
   );
};

export default MyCalendar;