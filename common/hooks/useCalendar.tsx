import { useState, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';

export const useCalendar = () => {
   const calendarRef = useRef<FullCalendar>(null);
   const [selectedView, setSelectedView] = useState<string>('dayGridMonth');
   const [currentDate, setCurrentDate] = useState(new Date());

   const handleViewChange = useCallback((view: string, date: Date) => {
      let calendarApi = calendarRef?.current?.getApi();

      if (calendarApi) {
         calendarApi.changeView(view, date);
      }
      setSelectedView(view);
      setCurrentDate(date);
   }, []);

   return {
      calendarRef,
      selectedView,
      currentDate,
      handleViewChange,
      setSelectedView,
      setCurrentDate,
   };
};
