import { useEffect, useState } from 'react';

import DatePicker from '@/common/components/date-picker/DatePicker';
import DropDown from '@/common/components/drop-down/DropDown';
import Grid from '@/common/components/grid/Grid';
import Modal from '@/common/components/modal/Modal';

import { LuminaryCalendarEventContent } from '@/common/components/calendar/calendarTypes';
import { PRODUCTS, TEAMS } from '@/utilities/luminaryConstants';

type Props = {
   isOpen: boolean;
   onClose: (value: React.SetStateAction<boolean>) => void;
   eventData?: Partial<LuminaryCalendarEventContent> | null;
};

function InstallEventModal({isOpen, onClose, eventData}: Props) {
   const [startDate, setStartDate] = useState<Date>(new Date());
   const [endDate, setEndDate] = useState<Date>(new Date());
   const [selectedTeam, setSelectedTeam] = useState<{ name: string } | null>(null);
   const [selectedProduct, setSelectedProduct] = useState<{ name: string } | null>(null);

   const handleTeamSelect = (e: any, selectedTeam: { name: string }) => {
      setSelectedTeam(selectedTeam);
   };

   const handleSelectedProduct = (e: any, selectedProduct: { name: string }) => {
      setSelectedProduct(selectedProduct);
   };

   useEffect(() => {
      if (eventData) {
         setStartDate(eventData.start || new Date());
         setEndDate(eventData.end || new Date());
         setSelectedTeam(eventData?.extendedProps?.team || null);
      }
   }, [eventData]);

   const handleSave = async () => {
      const eventToSave = {
         startDate,
         endDate,
         team: selectedTeam,
         product: selectedProduct
      };

      try {
         const response = await fetch('/appointments', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventToSave),
         });

         if (response.ok) {
            console.log("Event created successfully");
            onClose(false);
         } else {
            console.error("Failed to create the event");
         }
      } catch (error) {
         console.error("Error creating the event: ", error);
      }
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         primaryButtonText={`${eventData ? 'Update Appointment' : 'Create Appointment'}`}
         title='Schedule Install'
         primaryButtonCallback={handleSave}
         >
         
         <Grid columnCount={2} columnMinWidth={`250px`} className='py-6' responsive>
            <Grid>
               <span>Install Start Date & Time</span>
               <Grid>
                  <DatePicker
                     date={startDate}
                     inputStyles='w-full bg-lum-gray-50 p-2 focus:border-lum-gray-150 rounded dark:bg-lum-gray-700 dark:hover:bg-lum-gray-750 dark:border-lum-gray-500 border-[1px] cursor-pointer'
                     dateFormat='M j Y H:i'
                     placeholder={'Select a date'}
                     enableTime={true}
                     minDate={'today'}
                     // onChange={(e) => {
                     //    console.log(e)
                     //    console.log('startDate',startDate.toISOString())
                     //    setStartDate(startDate)}}
                  />
               </Grid>
            </Grid>
            <Grid>
               <span>Anticipated End Date & Time</span>
               <Grid>
                  <DatePicker
                     date={endDate}
                     inputStyles='w-full bg-lum-gray-50 p-2 focus:border-lum-gray-150 rounded dark:bg-lum-gray-700 dark:hover:bg-lum-gray-750 dark:border-lum-gray-500 border-[1px] cursor-pointer'
                     dateFormat='M j Y H:i'
                     placeholder={'Select a date'}
                     enableTime={true}
                     minDate={'today'}
                     // onChange={() => setEndDate(endDate)}
                  />
               </Grid>
            </Grid>
         </Grid>
         <hr className='my-[15px] border-lum-gray-100 dark:border-lum-gray-600' />
         <Grid columnCount={2} columnMinWidth={`250px`} className='py-6' responsive>
            <Grid>
               <span>Install Team</span>
               <Grid>
                  <DropDown 
                     selectedValues={selectedProduct ? [selectedProduct] : []} 
                     options={TEAMS} 
                     onOptionSelect={handleSelectedProduct} 
                     keyPath={["name"]}
                     placeholder='Select a Product'
                  />
               </Grid>
            </Grid>
            <Grid>
               <span>Product</span>
               <Grid>
                  <DropDown 
                     selectedValues={selectedTeam ? [selectedTeam] : []} 
                     options={PRODUCTS} 
                     onOptionSelect={handleTeamSelect} 
                     keyPath={["name"]}
                     placeholder='Select a Product'
                  />
               </Grid>
            </Grid>
         </Grid>
      </Modal>
   );
}

export default InstallEventModal;
