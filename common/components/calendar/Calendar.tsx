'use client';
import { useCallback, ReactNode, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import DateSelector from './(partials)/DateSelector/DateSelector';
import ViewSelector from './(partials)/ViewSelector/ViewSelector';
import styles from './Calendar.module.css';
import DailyViewPlugin from './(partials)/DailyView/DailyViewPlugin';
import { useCalendar } from '@/common/hooks/useCalendar';
import EventContent from './(partials)/EventContent/EventContent';
import DayCellContent from './(partials)/DayCellContent/DayCellContent';
import DayHeaderContent from './(partials)/DayHeaderContent/DayHeaderContent';
import PageContainer from '../page-container/PageContainer';
import FilterButton from './(partials)/FilterButton/FilterButton';
import { getCurrentTimeZone } from '@/utilities/calendar/helpers';
import { CalendarContext } from './CalendarContext';
import Tooltip from '../tooltip/Tooltip';
import Icon from '../Icon';
import { useFetchEvents } from './useFetchEvents';

import { ActionsType } from '../table/tableTypes';
import { CachedEventsType, LuminaryCalendarEvent, LuminaryCalendarEventContent } from './calendarTypes';
import { MoreLinkArg, MoreLinkContentArg } from '@fullcalendar/core';


type Props = {
   columns?: any;
   children?: ReactNode;
   onClickFilter?: () => void;
   showFilterButton?: boolean;
   onClickEventContent?:(eventData: React.SetStateAction<Partial<LuminaryCalendarEventContent> | null>) => void;
   actions?: ActionsType[];
   eventContentIcon: string;
   hideView?: 'daily';
   eventsFetchUrl: string;
   secondEventsFetchUrl?: string;
   filterValue?: string;
   defaultClickChangeView?: string;
   CustomWeekEventContent?: React.ComponentType<{ event: LuminaryCalendarEventContent; startTime: string; onClickEventContent?: (event: LuminaryCalendarEventContent) => void; handleViewChange: (view: string, date: Date) => void }>;
};
const Calendar = ({ columns, children, onClickFilter, onClickEventContent, actions, filterValue, defaultClickChangeView, eventContentIcon, hideView, eventsFetchUrl, secondEventsFetchUrl, CustomWeekEventContent, showFilterButton = true }: Props) => {
   const [cachedEvents, setCachedEvents] = useState<CachedEventsType>({});
   const [fetchedEvents, setFetchedEvents] = useState<LuminaryCalendarEvent[]>([]);

   const { calendarRef, selectedView, currentDate, setCurrentDate, handleViewChange } = useCalendar();

   const fetchEvents = useFetchEvents({cachedEvents, setCachedEvents, setFetchedEvents, eventsFetchUrl, secondEventsFetchUrl, filterValue});

   const timeZone = getCurrentTimeZone();

   const handleMoreLinkClick = useCallback(
      (args: MoreLinkArg | MoreLinkContentArg) => {
        
        let clickedDate: Date;
        if ('date' in args) {
          clickedDate = new Date(args.date);
        } else {
          clickedDate = new Date(); // Placeholder
        }
        clickedDate.setDate(clickedDate.getDate() + 1);
        setCurrentDate(clickedDate);
        handleViewChange(defaultClickChangeView ?? 'dailyView', clickedDate);
      },
      [handleViewChange, setCurrentDate]
    );
   return (
      <CalendarContext.Provider value={{ columns, actions, currentDate}}>
         <PageContainer>
            <div className='relative'>
               <div className=' flex absolute -top-12 right-2'>
                  <ViewSelector
                     selectedView={selectedView}
                     handleViewChange={handleViewChange}
                     currentDate={currentDate}
                     hideView={hideView}
                  />
                  {showFilterButton && <FilterButton onClick={onClickFilter} />}
                  {children}
               </div>
            </div>
            <div className='relative'>
               <div className='flex justify-center my-5'>
                  <DateSelector
                     ref={calendarRef}
                     selectedView={selectedView}
                     currentDate={currentDate}
                     setCurrentDate={setCurrentDate}
                  />
               </div>
               <Tooltip content={timeZone}>
                  <div className='absolute top-3.5 right-2 flex cursor-default'>
                     <Icon name='MapPin' color='gray' width={16} />
                     <p className='text-sm ml-1'>Time Zone</p>
                  </div>
               </Tooltip>
            </div>
            <div className={`${styles.fullCalendar} ${selectedView} ${styles.hideScrollbar} pb-2`}>
               <FullCalendar
                  plugins={[dayGridPlugin, DailyViewPlugin]}
                  dayHeaderFormat={{ weekday: 'long' }}
                  initialView='dayGridMonth'
                  eventOrder={'start'}
                  timeZone='local'
                  headerToolbar={false}
                  fixedWeekCount={false}
                  moreLinkClick={(args) => handleMoreLinkClick(args)}
                  expandRows={false}
                  height={1200}
                  events={(info, successCallback, failureCallback) => fetchEvents(info, successCallback, failureCallback)}
                  views={{
                     dayGridMonth: {
                        dayMaxEventRows: 5,
                     },
                     dayGridWeek:{
                        dayMaxEventRows: 20,
                     }
                  }}
                  moreLinkContent={(args) => {
                     return (
                        <div 
                        onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           handleMoreLinkClick(args);
                         }} 
                        className='w-full bg-lum-white dark:bg-lum-gray-675 p-0.5 rounded shadow-012 text-center text-lum-gray-400 text-sm'
                        >
                           View {args.num} More
                        </div>
                     );
                  }}
                  dayCellContent={(args) => <DayCellContent {...args} events={fetchedEvents} />}
                  dayHeaderContent={(args) => <DayHeaderContent {...args} />}
                  eventContent={(args) => <EventContent handleViewChange={handleViewChange} key={args.view.type} defaultClickChangeView={defaultClickChangeView} CustomWeekEventContent={CustomWeekEventContent} event={args.event} view={args.view} eventIcon={eventContentIcon} onClickEventContent={onClickEventContent} />}
                  ref={calendarRef}
                  showNonCurrentDates={false}
               />
            </div>
         </PageContainer>
      </CalendarContext.Provider>
   );
};

export default Calendar;
