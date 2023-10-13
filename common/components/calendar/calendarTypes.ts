import { ViewApi } from "@fullcalendar/core";
import { EventImpl } from "@fullcalendar/core/internal";

export interface LuminaryCalendarEvent extends EventImpl {
    start: Date ;
    end: Date ;
    extendedProps:{
        [key: string]: any;
    }
}

export type CachedEventsType = {
    [key: string]: LuminaryCalendarEvent[];
  };

export interface LuminaryCalendarEventContent extends EventImpl {
    start: Date | null;
    end: Date | null;
    extendedProps:{
        [key: string]: any;
    }
}

export type EventContentArg = {
    event: Partial<LuminaryCalendarEvent>;
    view: ViewApi;
    eventIcon: string;
    onClickEventContent?: (eventData: React.SetStateAction<Partial<LuminaryCalendarEvent> | null>) => void
 };

export type ViewComponentsType = {
    dayGridMonth: (event: Partial<LuminaryCalendarEvent>, startTime: string, eventIcon?: string, onClickEventContent?:  (eventData: React.SetStateAction<Partial<LuminaryCalendarEvent | null>>) => void) => JSX.Element | null;
    dayGridWeek: (event: Partial<LuminaryCalendarEvent>, startTime: string, eventIcon?: string, onClickEventContent?: (eventData: React.SetStateAction<Partial<LuminaryCalendarEvent | null>>) => void) => JSX.Element | null;
    default: () => null;
    [key: string]: (event: Partial<LuminaryCalendarEvent>, startTime: string, eventIcon?: string,  onClickEventContent?:  (eventData: React.SetStateAction<Partial<LuminaryCalendarEvent | null>>) => void) => JSX.Element | null;
};

export type ViewDayCellComponentsType = {
    dayGridMonth: (date: Date, events: Partial<LuminaryCalendarEvent>[], isToday: boolean) => JSX.Element;
    dayGridWeek: (date: Date, events: Partial<LuminaryCalendarEvent>[], isToday: boolean) => JSX.Element;
    default: (date: Date, events: Partial<LuminaryCalendarEvent>[], isToday: boolean) => JSX.Element;
    [key: string]: (date: Date, events: Partial<LuminaryCalendarEvent>[], isToday: boolean) => JSX.Element;
 };