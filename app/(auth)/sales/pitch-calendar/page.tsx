'use client'
import { useState } from 'react';

import Calendar from '@/common/components/calendar/Calendar';
import FilterTeamsModal from './(partials)/FilterTeamsModal';
import { PitchDayViewColumns } from './(partials)/PitchDayViewColumns';
import { useAppDispatch } from '@/store/hooks';
import { setAddToast } from '@/store/slices/toast';

const PitchCalendar = () => {

   const [filtermodalOpen, setFilterModalOpen] = useState(false);
   const [selectedTeamName, setSelectedTeamName] = useState('');

   const dispatch = useAppDispatch();

   const handleFilterOpenModal = () => {
      setFilterModalOpen(true);
   };

   const handleTeamSelection = (teamName: string) => {
      setSelectedTeamName(teamName);
      setFilterModalOpen(false);
      dispatch(
         setAddToast({
            iconName: 'CheckMarkCircle',
            details: [{ label: 'Success', text: teamName === '' ? 'Filters cleared' : `Showing events for ${teamName}` }],
            variant: 'success',
         })
      );
   };

   return (
   <>
      <Calendar eventsFetchUrl='/api/v2/appointments' filterValue={selectedTeamName} eventContentIcon='HeadphoneRep' columns={PitchDayViewColumns} onClickFilter={handleFilterOpenModal} />
      <FilterTeamsModal isOpen={filtermodalOpen} onClose={() => setFilterModalOpen(false)} selectedTeamName={selectedTeamName} setSelectedTeamName={handleTeamSelection}  />
   </>
   )
};

export default PitchCalendar;