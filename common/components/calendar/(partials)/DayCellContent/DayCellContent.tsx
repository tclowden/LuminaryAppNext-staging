import { DayCellContentArg } from '@fullcalendar/core';
import { LuminaryCalendarEvent, ViewDayCellComponentsType } from '../../calendarTypes';

type DayCellContentProps = DayCellContentArg & { events: Partial<LuminaryCalendarEvent>[] };

const viewComponents: ViewDayCellComponentsType = {
   dayGridMonth: (date, _events, isToday) => {
      return(
         <div className={`px-2 h-full ${isToday ? 'bg-lum-cyan-500 text-lum-white grid grid-cols-2 ' : ''} rounded-sm`}>
         {isToday && <div>Today</div>}
         <div className='flex justify-end w-full'>{date.getDate()}</div>
      </div>
      )}
   ,
   dayGridWeek: (date, events, _isToday) => {
      const currentDateStr = date.toISOString().split('T')[0];
      const eventsOnCurrentDate = events.filter((event) => {
         const eventDateStr = event?.extendedProps?.start?.split('T')[0];
         return eventDateStr === currentDateStr;
      });

      return (
         <div>
            <div className='p-2 flex justify-end'> {date.getDate()}</div>
            {eventsOnCurrentDate.length === 0 && (
               <div
                  className='text-center mt-10 z-20 text-sm'
                  style={{
                     color: '#A1ADB6',
                     opacity: 1,
                     position: 'relative',
                  }}>
                  No Appointments
               </div>
            )}
         </div>
      );
   },
   default: (date: Date, _events: Partial<LuminaryCalendarEvent>[], isToday: boolean) => (
      <div className={`${isToday ? 'bg-lum-cyan-500 text-lum-white' : ''}`}>{date.getDate()}</div>
   ),
};

const DayCellContent: React.FC<DayCellContentProps> = ({ isToday, date, view, events}) => {
   const ViewComponent = viewComponents[view.type] || viewComponents.default;
   return ViewComponent(date, events, isToday);
};

export default DayCellContent;