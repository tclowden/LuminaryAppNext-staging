'use client';
import { MutableRefObject, forwardRef, useCallback, useEffect, useState } from 'react';

import FullCalendar from '@fullcalendar/react';
import Icon from '@/common/components/Icon';
import DatePicker from '@/common/components/date-picker/DatePicker';
import { getPlaceholder, isToday } from '@/utilities/calendar/helpers';

type Props = {
   selectedView: string;
   currentDate: Date;
   setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
};

const DateSelector = forwardRef<FullCalendar, Props>((props, ref) => {
  const [placeholder, setPlaceholder] = useState('');

  const { selectedView, currentDate, setCurrentDate } = props;

   const updatePlaceholder = useCallback(() => {
      let calendarApi = (ref as MutableRefObject<FullCalendar>).current?.getApi();
      if (calendarApi) {
         setPlaceholder(getPlaceholder(selectedView, currentDate, ref as MutableRefObject<FullCalendar>));
      }
   }, [ref, selectedView, currentDate]);

   useEffect(() => {
      updatePlaceholder();
   }, [currentDate, updatePlaceholder]);

   const handleNextDate = () => {
    let calendarApi = (ref as MutableRefObject<FullCalendar>).current?.getApi();
    if (calendarApi) {
       if (selectedView === 'dailyView') {
          setCurrentDate((prevDate) => {
             const newDate = new Date(prevDate);
             newDate.setDate(newDate.getDate() + 1);
             calendarApi.gotoDate(newDate);
             return newDate;
          });
       } else {
          calendarApi.next();
          const newDate = calendarApi.getDate();
          setCurrentDate(newDate);
       }
    }
  };
 
  const handlePrevDate = () => {
      let calendarApi = (ref as MutableRefObject<FullCalendar>).current?.getApi();
      if (calendarApi) {
        if (selectedView === 'dailyView') {
            setCurrentDate((prevDate) => {
              const newDate = new Date(prevDate);
              newDate.setDate(newDate.getDate() - 1);
              calendarApi.gotoDate(newDate);
              return newDate;
            });
        } else {
            calendarApi.prev();
            const newDate = calendarApi.getDate();
            setCurrentDate(newDate);
        }
      }
  };
    
  const handleDateChange = (view: string, selectedDate: Date) => {
    const newDate = new Date(selectedDate);
    let calendarApi = (ref as MutableRefObject<FullCalendar>).current?.getApi();
 
    switch (view) {
       case 'dayGridMonth':
          setCurrentDate(newDate);
          break;
       case 'dayGridWeek':
          setCurrentDate(newDate);
          break;
       case 'dailyView':
          if (newDate.getDate() !== currentDate.getDate()) {
             setCurrentDate(newDate);
          }
          break;
       default:
          break;
    }
 
    if (calendarApi) {
       calendarApi.gotoDate(newDate); // Update the view of the calendar
    }
 };

    const handleOnDateSelect = (selectedDate: Date, _formattedDateString: string) => {
      handleDateChange(selectedView, selectedDate);
    };

   return (
      <div className={`flex justify-center items-center w-[360px]`}>
         <Icon
            name={'ChevronLeft'}
            color={'gray:400'}
            height='20'
            width='20'
            style={{ marginRight: '8px', cursor: 'pointer' }}
            onClick={handlePrevDate}
         />
         <div className='relative w-full'>
            <Icon
               name={'Calendar'}
               color={'gray'}
               height='20'
               width='20'
               style={{ position: 'absolute', top: '8px', left: '10px', pointerEvents: 'none', zIndex: 1000 }}
               onClick={handlePrevDate}
            />
            <div>
               <DatePicker
                  date={currentDate}
                  inputStyles={`${
                     selectedView === 'dailyView' && isToday(currentDate)
                        ? 'flatpickr-input-today'
                        : 'placeholder:text-center flatpickr-input'
                  } w-full rounded bg-lum-gray-50 dark:bg-lum-gray-700 dark:hover:bg-lum-gray-650 hover:bg-lum-gray-100 py-2 placeholder:text-lum-black placeholder:text-xl placeholder:font-bold dark:placeholder:text-lum-white cursor-pointer`}
                  dateFormat={''}
                  placeholder={placeholder}
                  enableTime={false}
                  onDateSelect={handleOnDateSelect}
                  minDate={'2022-01-01'}
                  iconName='ChevronDown'
                  iconHeigth='20'
                  iconWidth='18'
                  iconStyles={'absolute right-[10px] top-4 fill-none h-[9px] stroke-lum-gray-400 stroke-2 pointer-events-none'}
               />
            </div>
            <div
               className={`bg-lum-cyan-500 w-16 text-lum-white rounded text-center py-1 text-sm ml-3 ${
                  selectedView === 'dailyView' && isToday(currentDate) ? 'absolute right-12 top-1.5' : 'hidden'
               } `}>
               TODAY
            </div>
         </div>
         <Icon
            name={'ChevronRight'}
            color={'gray:400'}
            height='20'
            width='20'
            style={{ marginLeft: '8px', cursor: 'pointer' }}
            onClick={handleNextDate}
         />
      </div>
   );
});

DateSelector.displayName = 'DateSelector';

export default DateSelector;
