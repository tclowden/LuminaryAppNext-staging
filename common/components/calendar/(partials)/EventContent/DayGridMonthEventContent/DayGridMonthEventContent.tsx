import { LuminaryCalendarEventContent } from '../../../calendarTypes';

interface DayGridMonthEventContentProps {
    event: LuminaryCalendarEventContent;
    startTime: string;
    onClickEventContent?: (event: LuminaryCalendarEventContent) => void;
    handleViewChange: (view: string, date: Date) => void;
    defaultClickChangeView?: string;
}

const DayGridMonthEventContent: React.FC<DayGridMonthEventContentProps> = ({ event, startTime, onClickEventContent, handleViewChange, defaultClickChangeView }) => {
   const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      onClickEventContent?.(event) ?? handleViewChange( defaultClickChangeView ?? 'dailyView', new Date(event.start ?? ''));
   };

   return (
      <div 
         className='bg-lum-white dark:bg-lum-gray-700 grid grid-cols-2 flex-wrap items-center justify-between w-full text-[12px] hover:cursor-pointer'
         onClick={handleClick}
      >
         <div className=' text-lum-blue-500 text-center font-medium ml-1 whitespace-nowrap overflow-hidden overflow-ellipsis w-[50%] md:w-[80%] xl:w-[90%]'>
            {event?.extendedProps?.customerName}
         </div>
         <div className='text-lum-gray-600 flex justify-end dark:text-lum-white pr-1'>{startTime}</div>
      </div>
   );
};

export default DayGridMonthEventContent;