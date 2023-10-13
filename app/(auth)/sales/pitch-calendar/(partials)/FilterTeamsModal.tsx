import { useState } from 'react';

import Grid from '@/common/components/grid/Grid';
import Modal from '@/common/components/modal/Modal';
import Radio from '@/common/components/radio/Radio';
import { LUMINARY_SALES_TEAMS } from '@/utilities/luminaryConstants';

type Props = {
   isOpen: boolean,
   onClose: (value: React.SetStateAction<boolean>) => void,
   selectedTeamName: string,
   setSelectedTeamName: (React.Dispatch<React.SetStateAction<string>>) | ((teamName: string) => void);
};

function FilterTeamsModal({isOpen, onClose, setSelectedTeamName, selectedTeamName}: Props) {
   const [tempSelectedTeam, setTempSelectedTeam] = useState(selectedTeamName);

   const handleRadioToggle = (teamName:string) => {
      setTempSelectedTeam(teamName);
   };

   const handleFilter = () => {
      setSelectedTeamName(tempSelectedTeam); 
      onClose(false);
   };

   const handleResetFilter = () => {
      setSelectedTeamName(''); 
      onClose(false);
   }

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         size={'small'}
         primaryButtonText={'Filter'}
         secondaryButtonText={'Reset Filter'}
         secondaryButtonCallback={handleResetFilter}
         title='Filter Events by Team'
         primaryButtonCallback={()=> handleFilter()} 
         >
         
         <Grid responsive columnCount={3} className='justify-items-start'>
         {LUMINARY_SALES_TEAMS.map((team) => (
                  <Radio
                     key={team.name}
                     checked={team.name === tempSelectedTeam}
                     name='luminary sales teams'
                     label={team.name}
                     value={team.name}
                     onChange={() => handleRadioToggle(team.name)}
                  />
               ))}
               
         </Grid>
      </Modal>
   );
}

export default FilterTeamsModal;