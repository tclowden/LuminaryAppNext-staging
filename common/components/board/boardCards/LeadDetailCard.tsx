import React from 'react';
import Icon from '../../Icon';
import Tooltip from '../../tooltip/Tooltip';

interface Props {
   item: any;
   callback: (e: any) => void;
}

const LeadDetailCard = ({ item, callback }: Props) => {
   const leadHasAppts =
      item?.appointments?.length &&
      item?.appointments?.some((appt: any) => {
         const now = new Date();
         const apptTime = new Date(appt?.appointmentTime);
         if (apptTime > now) return true;
         else return false;
      });

   return (
      <div
         onClick={callback}
         className={
            'justify-between flex flex-col bg-lum-white dark:bg-lum-gray-650 rounded shadow p-2 gap-y-2 w-full mx-auto  cursor-pointer'
         }>
         <div className='flex flex-row items-center justify-between'>
            <div className='text-lum-gray-700 dark:text-lum-white text-[16px]'>{item?.fullName || 'Default Title'}</div>
            {!!leadHasAppts && (
               <Tooltip content={'Appt Scheduled'}>
                  <div className='flex flex-row items-center justify-center gap-x-1 bg-transparent text-lum-white rounded p-1'>
                     <Icon name='CalendarScheduled' color='white' width={16} />
                     {/* <span className='text-[12px]'>{item?.appointments?.length}</span> */}
                  </div>
               </Tooltip>
            )}
         </div>
         <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col'>
               <div className='text-lum-gray-450 text-[10px]'>Last Called</div>
               <div className='text-lum-gray-550 dark:text-lum-gray-300 text-[12px]'>{item?.lastCalled || 'N/A'}</div>
            </div>
            <div className='flex flex-row gap-x-1'>
               <Tooltip content={'Your Outbound Calls'}>
                  <div className='flex flex-row items-center justify-center gap-x-1 bg-lum-green-500 text-lum-white rounded p-1'>
                     <Icon name='PhoneAngled' color='white' width={12} />
                     <span className='text-[12px]'>{item?.callLogs?.length ?? '0'}</span>
                  </div>
               </Tooltip>
               <Tooltip content={'Your Outbound Sms'}>
                  <div className='flex flex-row items-center justify-center gap-x-1 bg-lum-blue-500 text-lum-white rounded p-1'>
                     <Icon name='MessageBubbleLines' color='white' width={12} />
                     <span className='text-[12px]'>{item?.smsLogs?.length ?? '0'}</span>
                  </div>
               </Tooltip>
            </div>
         </div>
      </div>
   );
};

export default LeadDetailCard;
