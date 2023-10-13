'use client';
import { useState } from 'react';

import Calendar from '@/common/components/calendar/Calendar';
import { InstallDayViewColumns } from './(partials)/InstallDayViewColumns';
import AddEventButton from './(partials)/AddEventButton';
import InstallEventModal from './(partials)/AddInstallEventModal';
import FilterEventsModal from './(partials)/FilterEventsModal';
import { useAppDispatch } from '@/store/hooks';
import { setAddToast } from '@/store/slices/toast';

import { LuminaryCalendarEventContent } from '@/common/components/calendar/calendarTypes';

const InstallCalendar = () => {
   const [addEventModalOpen, setAddEventModalOpen] = useState(false);
   const [filterModalOpen, setFilterModalOpen] = useState(false);
   const [selectedProductName, setSelectedProductName] = useState('');
   const [selectedEvent, setSelectedEvent] = useState<Partial<LuminaryCalendarEventContent> | null>(null);

   const dispatch = useAppDispatch();

   //add event button hidden for now
   const handleEventOpenModal = () => {
      setAddEventModalOpen(true);
   };

   const handleFilterOpenModal = () => {
      setFilterModalOpen(true);
   };

   const handleCloseEventModal = () => {
      setAddEventModalOpen(false)
      setSelectedEvent(null)
   }

   const handleProductSelection = (productName: string) => {
      setSelectedProductName(productName);
      setFilterModalOpen(false);
      dispatch(
         setAddToast({
            iconName: 'CheckMarkCircle',
            details: [{ label: 'Success', text: productName === '' ? 'Filters cleared' : `Showing events for ${productName}` }],
            variant: 'success',
         })
      );
   };

   return (
      <>
         <Calendar eventsFetchUrl='/api/v2/install-appointments' filterValue={selectedProductName} eventContentIcon='Tools' columns={InstallDayViewColumns} onClickFilter={handleFilterOpenModal}>
         </Calendar>
         <InstallEventModal isOpen={addEventModalOpen} onClose={handleCloseEventModal} eventData={selectedEvent}/>
         <FilterEventsModal isOpen={filterModalOpen} onClose={() => setFilterModalOpen(false) } selectedProductName={selectedProductName} setSelectedProductName={handleProductSelection} />
      </>
   );
};

export default InstallCalendar;