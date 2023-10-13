import React from 'react';
import DayGridMonthView from './DayGridMonthEventContent/DayGridMonthEventContent';
import DayGridWeekView from './DayGridWeekEventContent/DayGridWeekEventContent';
import { LuminaryCalendarEventContent } from '../../calendarTypes';

interface EventContentProps {
    event: LuminaryCalendarEventContent;
    view: { type: string };
    onClickEventContent?: (event: LuminaryCalendarEventContent) => void;
    eventIcon?: string;
    handleViewChange: (view: string, date: Date) => void;
    defaultClickChangeView?: string;
    CustomWeekEventContent?: React.ComponentType<{ event: LuminaryCalendarEventContent; startTime: string; eventIcon?: string, onClickEventContent?: (event: LuminaryCalendarEventContent) => void; handleViewChange: (view: string, date: Date) => void}>;
}

const EventContent: React.FC<EventContentProps> = ({ event, view, onClickEventContent, defaultClickChangeView,  eventIcon, CustomWeekEventContent, handleViewChange }) => {
    const startTime = `${event?.start?.getHours().toString().padStart(2, '0')}:${event?.start?.getMinutes().toString().padStart(2, '0')}`;

   //There is no custom DayEventContent becuase the whole Dayview is customized
   switch (view.type) {
       case 'dayGridMonth':
           return <DayGridMonthView handleViewChange={handleViewChange} defaultClickChangeView={defaultClickChangeView} event={event} startTime={startTime} onClickEventContent={onClickEventContent} />;
       case 'dayGridWeek':
           return CustomWeekEventContent 
               ? <CustomWeekEventContent handleViewChange={handleViewChange} event={event} startTime={startTime} eventIcon={eventIcon} onClickEventContent={onClickEventContent} />
               : <DayGridWeekView handleViewChange={handleViewChange} event={event} startTime={startTime} eventIcon={eventIcon} onClickEventContent={onClickEventContent} />;
       default:
           return null;
   }
};

export default EventContent;