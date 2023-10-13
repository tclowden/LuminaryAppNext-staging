import { createContext } from 'react';

import { ActionsType } from '../table/tableTypes';

interface CalendarContextType {
   columns: any;
   actions?: ActionsType[];
   currentDate: Date;
}

export const CalendarContext = createContext<CalendarContextType>({
   columns: undefined,
   actions: undefined,
   currentDate: new Date(),
});