import Icon from '@/common/components/Icon';

import { LuminaryCalendarEventContent } from '@/common/components/calendar/calendarTypes';

interface MyCalendarEventContentProps {
    event: LuminaryCalendarEventContent;
    startTime: string;
    eventIcon?: string;
    onClickEventContent?: (event: LuminaryCalendarEventContent) => void;
}

const MyCalendarEventContent: React.FC<MyCalendarEventContentProps> = ({ event, startTime, eventIcon = '', onClickEventContent }) => {
   let isMultiDayEvent = false;
   let currentDate = null;
   let today = new Date().getDate();

   // Check if the event is a multi-day event
   if (event.start && event.end) {
      isMultiDayEvent = new Date(event.start).getDate() !== new Date(event.end).getDate();
      currentDate = new Date(event.start).getDate();
   }

   // Condition to check if the event should be rendered
   const shouldRenderEvent = !isMultiDayEvent || (isMultiDayEvent && currentDate === today);

   if (!shouldRenderEvent) {
      return null;
   }
   return (
      <div 
         className={`bg-lum-white dark:bg-lum-gray-700 grid py-1 w-full text-[12px] ${onClickEventContent && 'hover:cursor-pointer'}`}
         onClick={(e) => {
            if (onClickEventContent) {
               e.preventDefault();
               onClickEventContent(event);
            }
         }}
      >
         <div className='ml-1 xl:ml-2 my-1 font-bold'>
            {event?.extendedProps?.appointmentType}
         </div>
         <div className='text-lum-blue-500 text-center font-medium flex ml-2'>
            <Icon name={eventIcon} width={16} height={16} color='gray:300' />
            <span className='ml-1 xl:ml-2 text-start font-medium truncate w-[50%] lg:w-[80%] xl:w-full'>
               {event?.extendedProps?.customerName}
            </span>
         </div>
         <div className='text-lum-gray-600 ml-2 flex my-1 items-center'>
            <Icon name={'Clock'} width={16} height={16} color='gray:300' />
            <span className='ml-1 xl:ml-2 dark:text-lum-white truncate w-[50%] lg:w-[70%] xl:w-[90%]'>{startTime} - {event.end?.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
               })} 
            </span>
         </div>
      </div>
   );
};

export default MyCalendarEventContent;