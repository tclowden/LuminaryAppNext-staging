'use client';
import { useContext } from 'react';

import { CalendarContext } from '../../CalendarContext';
import { EventRenderRange } from '@fullcalendar/core';
import Table from '@/common/components/table/Table';

interface dailyViewProps {
   events: EventRenderRange[];
}

export const DailyView = ({ events }: dailyViewProps) => {

   const { columns, actions, currentDate } = useContext(CalendarContext);

   const startOfDay = new Date(currentDate);
   startOfDay.setHours(0, 0, 0, 0);
 
   const endOfDay = new Date(currentDate);
   endOfDay.setHours(23, 59, 59, 999);
 
   const filteredEvents = events.filter(event => {
      const eventStart = new Date(event.range.start);
      return eventStart >= startOfDay && eventStart <= endOfDay;
    });
  
   const tableEvents = filteredEvents.map((u: any, _: number) => ({
      ...u,
      actionsConfig: { edit: true, duplicate: false, delete: true },
    }));

   return (
      <div>
         <Table
            data={tableEvents}
            columns={columns}
            actions={actions}
            pagination={true}
         />
      </div>
   );
};
