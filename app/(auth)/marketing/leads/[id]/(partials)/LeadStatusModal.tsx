'use client';
import React, { useEffect, useState } from 'react';
import Grid from '../../../../../../common/components/grid/Grid';
import Modal from '../../../../../../common/components/modal/Modal';
import Radio from '../../../../../../common/components/radio/Radio';
import DatePicker from '../../../../../../common/components/date-picker/DatePicker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { Status } from '../../types';
import Input from '@/common/components/input/Input';
import { fetchDbApi, triggerAutomation } from '@/serverActions';
import { setAddToast } from '@/store/slices/toast';
import { RulesOnStatus } from '@/app/api/v2/leads/[id]/status/types';

type Props = {
   isOpen: boolean;
   onClose: (e: any) => void;
   leadId: string;
   currentStatus: any;
   onLeadStatusUpdate: (status: Status) => void;
};

const pitchOrSetOptions = ['Pitch', 'Set', 'Neither'];

const LeadStatusModal = ({ isOpen, onClose, leadId, currentStatus, onLeadStatusUpdate }: Props) => {
   console.log('currentStatus: ', currentStatus);
   const [pitchOrSet, setPitchOrSet] = useState<string>('');
   const [updatedLeadStatus, setUpdatedLeadStatus] = useState<Status>(currentStatus);
   const [statusConfigs, setStatusConfigs] = useState<any>([]);
   const [rulesOnStatus, setRulesOnStatus] = useState<RulesOnStatus[] | null>(null);
   const user = useAppSelector(selectUser);
   const [scheduledStatusDate, setScheduledStatusDate] = useState<Date>(new Date());
   const [appointmentOutcome, setAppointmentOutcome] = useState<string>('N/A');
   const [note, setNote] = useState<string>('');

   const dispatch = useAppDispatch();
   const isValid = !!pitchOrSet && !!updatedLeadStatus;

   useEffect(() => {
      async function getStatusConfigs() {
         await fetch(`/api/v2/statuses/status-modal-configs`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` },
            cache: 'no-store',
         }).then(async (res: any) => {
            const data = await res.json();
            console.log(data);
            setStatusConfigs(data);
         });
      }
      getStatusConfigs();
   }, []);

   const handleRadioChange = (status: any) => {
      console.log('status: ', status);
      const rules = status?.rulesOnStatuses.map((rule: any) => rule.statusRulesType.name);
      setRulesOnStatus(rules);
      setUpdatedLeadStatus(status);
   };

   const handleSubmit = async (e: any) => {
      e.preventDefault();
      const statusUpdatePayload = {
         userId: user.id,
         newStatus: updatedLeadStatus,
         leadId: leadId,
         rulesOnStatus: rulesOnStatus,
         scheduledStatusDate: scheduledStatusDate?.toISOString(),
         note: note,
         appointmentOutcome: appointmentOutcome,
      };
      await fetch(`/api/v2/leads/${leadId}/status/`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
         body: JSON.stringify(statusUpdatePayload),
      }).then(async (res) => {
         if (res.status === 200) {
            const data = await res.json();

            onClose(true);
            onLeadStatusUpdate(updatedLeadStatus);

            dispatch(
               setAddToast({
                  iconName: 'AlarmClock',
                  autoCloseDelay: 1.5,
                  details: [
                     {
                        label: 'Success',
                        text: 'Status Updated!',
                     },
                  ],
                  variant: 'success',
                  animate: true,
               })
            );
            console.log('leadData: ', {
               leadId: leadId,
               executorId: user.id,
               newValue: updatedLeadStatus,
               oldValue: currentStatus,
               orderId: null,
            });

            // Fire the Assigned a status trigger
            triggerAutomation.fire('assigned_status', {
               leadId: leadId,
               executorId: user.id,
               newValue: updatedLeadStatus.id,
               prevValue: currentStatus.id,
               orderId: null,
            });

            // Checking for change in statusType
            if (currentStatus?.typeId !== updatedLeadStatus?.typeId) {
               triggerAutomation.fire('assigned_status_type', {
                  leadId: leadId,
                  executorId: user.id,
                  newValue: updatedLeadStatus?.typeId,
                  prevValue: currentStatus.typeId,
                  orderId: null,
               });
            }
         }
      });
   };

   return (
      <Modal
         isOpen={isOpen}
         title='Set Status'
         hidePrimaryCloseButton
         onClose={(e: any) => onClose(e)}
         closeOnBackdropClick
         hideCloseButton
         primaryButtonText='Save'
         primaryButtonCallback={(e: any) => handleSubmit(e)}
         disablePrimaryButton={!isValid}>
         <Grid>
            <Grid>
               <span>Was a Pitch or Set Made in this call?</span>
               <Grid>
                  {pitchOrSetOptions.map((option: string, index: number) => (
                     <Radio
                        key={index}
                        checked={option === pitchOrSet}
                        name={'pitchOrSet'}
                        label={option}
                        value={option}
                        onChange={() => setPitchOrSet(option)}
                     />
                  ))}
               </Grid>
            </Grid>
            <hr className='my-[15px] border-lum-gray-100 dark:border-lum-gray-600' />
            {statusConfigs.map((statusType: any, index: any) => (
               <React.Fragment key={index}>
                  <Grid>
                     <span>{statusType?.name}</span>
                     <Grid columnCount={3}>
                        {statusType?.statuses.map((status: any, index: any) => {
                           return (
                              <Radio
                                 key={index}
                                 checked={status.id === updatedLeadStatus?.id}
                                 name={'name'}
                                 label={status?.name}
                                 value={status?.name}
                                 onChange={(e) => handleRadioChange(status)}
                              />
                           );
                        })}
                     </Grid>
                  </Grid>
                  {index !== statusConfigs.length - 1 && (
                     <hr className='my-[15px] border-lum-gray-100 dark:border-lum-gray-600' />
                  )}
               </React.Fragment>
            ))}
         </Grid>
         {rulesOnStatus && rulesOnStatus.includes('Scheduled Status') && (
            <ScheduledStatusComponent
               scheduledStatusDate={scheduledStatusDate}
               setScheduledStatusDate={setScheduledStatusDate}
            />
         )}
         {rulesOnStatus && rulesOnStatus.includes('Ask Appointment Outcome') && (
            <AskAppointmentOutcomeComponent
               appointmentOutcome={appointmentOutcome}
               setAppointmentOutcome={setAppointmentOutcome}
            />
         )}
         {rulesOnStatus && rulesOnStatus.includes('Require Note') && (
            <RequireNoteComponent note={note} setNote={setNote} />
         )}
      </Modal>
   );
};

type ScheduledStatusProps = {
   scheduledStatusDate: Date;
   setScheduledStatusDate: React.Dispatch<React.SetStateAction<Date>>;
};

const ScheduledStatusComponent: React.FC<ScheduledStatusProps> = ({ scheduledStatusDate, setScheduledStatusDate }) => {
   return (
      <Grid>
         <hr className='my-[15px] border-lum-gray-100 dark:border-lum-gray-600' />
         <span>Select A Date</span>
         <Grid className='w-1/2'>
            <DatePicker
               date={scheduledStatusDate}
               inputStyles='bg-lum-gray-50 p-2 focus:border-lum-red-500 rounded dark:bg-lum-gray-800 dark:hover:bg-lum-gray-750 dark:hover:border-lum-gray-650'
               dateFormat='M j Y H:i'
               placeholder={'Select a date'}
               enableTime={true}
               minDate={'today'}
            // onChange={(e: any) => setScheduledStatusDate(e[0])}
            />
         </Grid>
      </Grid>
   );
};

type AskAppointmentOutcomeProps = {
   appointmentOutcome: string;
   setAppointmentOutcome: React.Dispatch<React.SetStateAction<string>>;
};

const AskAppointmentOutcomeComponent: React.FC<AskAppointmentOutcomeProps> = ({
   appointmentOutcome,
   setAppointmentOutcome,
}) => {
   return (
      <Grid>
         <hr className='my-[15px] border-lum-gray-100 dark:border-lum-gray-600' />
         <span>Was the appointment Kept?</span>
         <Grid className='w-1/2'>
            {['Yes', 'No', 'N/A'].map((option: string, index: number) => {
               return (
                  <Radio
                     key={index}
                     name={'outcomeName'}
                     value={option}
                     label={option}
                     onChange={() => setAppointmentOutcome(option)}
                  />
               );
            })}
         </Grid>
      </Grid>
   );
};

type RequireNoteProps = {
   note: string;
   setNote: React.Dispatch<React.SetStateAction<string>>;
};

const RequireNoteComponent: React.FC<RequireNoteProps> = ({ note, setNote }) => {
   return (
      <Grid>
         <hr className='my-[15px] border-lum-gray-100 dark:border-lum-gray-600' />
         <span>Note Required</span>
         <Grid className='w-1/2'>
            <Input value={note} onInput={(e: any) => setNote(e.target.value)}></Input>
         </Grid>
      </Grid>
   );
};

export default LeadStatusModal;
