import { useCallback } from 'react';
import { EventInput, EventSourceFuncArg } from '@fullcalendar/core';
import { useAppDispatch } from '@/store/hooks';
import { setAddToast } from '@/store/slices/toast';
import { CachedEventsType, LuminaryCalendarEvent } from './calendarTypes';

interface UseFetchEventsProps {
   cachedEvents: CachedEventsType;
   setCachedEvents: React.Dispatch<React.SetStateAction<CachedEventsType>>;
   setFetchedEvents: React.Dispatch<React.SetStateAction<LuminaryCalendarEvent[]>>;
   eventsFetchUrl: string;
   secondEventsFetchUrl?: string;
   filterValue?: string;
}

export const useFetchEvents = ({cachedEvents, setCachedEvents, setFetchedEvents, eventsFetchUrl, secondEventsFetchUrl, filterValue}: UseFetchEventsProps) => {

  const dispatch = useAppDispatch();

  const fetchEvents = useCallback((info: EventSourceFuncArg, successCallback: (eventInputs: EventInput[]) => void, failureCallback: (error: Error) => void) => {
   let localStartDate = new Date(info.startStr);
   let localEndDate = new Date(info.endStr);
   let localStartStr = `${localStartDate.getFullYear()}-${String(localStartDate.getMonth() + 1).padStart(2, '0')}-${String(localStartDate.getDate()).padStart(2, '0')}T${String(localStartDate.getHours()).padStart(2, '0')}:${String(localStartDate.getMinutes()).padStart(2, '0')}:${String(localStartDate.getSeconds()).padStart(2, '0')}`;
   let localEndStr = `${localEndDate.getFullYear()}-${String(localEndDate.getMonth() + 1).padStart(2, '0')}-${String(localEndDate.getDate()).padStart(2, '0')}T${String(localEndDate.getHours()).padStart(2, '0')}:${String(localEndDate.getMinutes()).padStart(2, '0')}:${String(localEndDate.getSeconds()).padStart(2, '0')}`;
   
   let cacheKey = `${localStartStr}-${localEndStr}`;
 
   if (filterValue) {
     cacheKey += `-${filterValue}`;
   }
   
   // Generate cache key based on start and end dates, and filter value
   if (cachedEvents[cacheKey]) {
     setFetchedEvents(cachedEvents[cacheKey]);
     successCallback(cachedEvents[cacheKey]);
     return;
   }
   
   // Construct URLs for fetching events
   let fetchUrl1 = `${eventsFetchUrl}?start=${localStartStr}&end=${localEndStr}`;
   let fetchUrl2 = secondEventsFetchUrl ? `${secondEventsFetchUrl}?start=${localStartStr}&end=${localEndStr}` : null;

   if (filterValue) {
      fetchUrl1 += `&filterValue=${filterValue}`;
      if (fetchUrl2) {
         fetchUrl2 += `&filterValue=${filterValue}`;
      }
   }

   const fetchPromise1 = fetch(fetchUrl1).then(response => response.json());
   const fetchPromises = [fetchPromise1];

   if (fetchUrl2) {
      const fetchPromise2 = fetch(fetchUrl2).then(response => response.json());
      fetchPromises.push(fetchPromise2);
   }

   Promise.all(fetchPromises)
         .then((dataArr) => {
            const combinedData = dataArr.flat().map(event => {
               if (event.start && event.end && new Date(event.start).getDate() !== new Date(event.end).getDate()) {
                  event.display = 'list-item'; // Set display to 'list-item' for multi-day events
               }
               return event;
            });
            setCachedEvents({
               ...cachedEvents,
               [cacheKey]: combinedData
            });
            setFetchedEvents(combinedData);
            successCallback(combinedData);
      })
      .catch(error => {
         dispatch(
            setAddToast({
               iconName: 'XMarkCircle',
               details: [{ label: 'Error', text: 'Error fetching appointments' }],
               variant: 'danger',
            })
         );
         failureCallback(error);
      });
}, [filterValue, cachedEvents, eventsFetchUrl, secondEventsFetchUrl, dispatch]);

  return fetchEvents;
};