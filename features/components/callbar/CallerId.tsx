'use client';

import LoadingSpinner from '@/common/components/loaders/loading-spinner/LoadingSpinner';
import { getFormattedPhoneNumber } from '@/utilities/helpers';
import React, { useEffect, useState } from 'react';
import Icon from '../../../common/components/Icon';

interface Props {
   leadName: string | null;
   isMuted: boolean;
   isOnHold: boolean;
   phoneNumber?: string;
   startTimer?: boolean;
   callBarStatus?: 'connecting' | 'connected' | null;
   isMakingTransfer: boolean;
   transferNumber: string;
}

const CallerId = ({
   leadName,
   isMuted,
   isOnHold,
   phoneNumber,
   startTimer,
   callBarStatus,
   isMakingTransfer,
   transferNumber,
}: Props) => {
   let [timeDisplay, setTimeDisplay] = useState('');
   let [seconds, setSeconds] = useState<number>(0);
   let [upSecond, setUpSecond] = useState<number>(0);
   let [minutes, setMinutes] = useState<number>(0);
   let [hours, setHours] = useState<number>(0);
   // let [isCounterOn, setIsCounterOn] = useState<boolean>(false);

   //
   useEffect(() => {
      function upTimer() {
         let sec: number = ++seconds;
         setSeconds(sec);

         let hr: number = +Math.floor(sec / 3600);
         setHours(hr);

         let min: number = Math.floor((sec - hr * 3600) / 60);
         setMinutes(min);

         let upSec: number = sec - (hr * 3600 + min * 60);
         setUpSecond(upSec);
      }
      let timer: any;
      if (callBarStatus === 'connected') {
         timer = setInterval(upTimer, 1000);
      }

      return () => clearInterval(timer);
   }, [seconds, callBarStatus]);

   useEffect(() => {
      if (callBarStatus === 'connected') {
         // Pad with zero if needed and update state
         let padMinute = minutes > 9 ? minutes : `0${minutes}`;
         let padUpSecond = upSecond > 9 ? upSecond : `0${upSecond}`;
         setTimeDisplay(`${padMinute}:${padUpSecond}`);
      } else {
         setTimeDisplay(`--:--`);
      }
   }, [callBarStatus, seconds, minutes, upSecond]);

   /**
    * @param seconds is incremented each second using
    */

   return (
      <div className='flex w-full'>
         <div className='flex flex-col items-center justify-between min-w-[75px] py-[10px]' onClick={stop}>
            <Icon name='PhoneAngled' color='white' height='20' width='20' />
            {startTimer && <div className='text-[14px] leading-[14px] text-lum-white'>{timeDisplay}</div>}
         </div>

         <div
            className={`flex flex-col justify-between h-full pl-[14px] py-[10px] border-l-[1px]
            ${isMuted ? 'border-lum-gray-200' : isOnHold ? 'border-lum-yellow-400' : 'border-lum-green-400'}
            ${callBarStatus === 'connecting' && 'border-lum-blue-400'}
         `}>
            <span className='text-[22px] leading-[22px] text-lum-white font-medium'>
               {leadName || getFormattedPhoneNumber(phoneNumber) || 'Unknown'}
            </span>
            <div className='flex items-center'>
               {callBarStatus === 'connected' ? (
                  <>
                     <span
                        className={`min-w-[8px] min-h-[8px] rounded-full animate-pulse
                  ${isMuted ? 'bg-lum-gray-100' : isOnHold ? 'bg-lum-yellow-300' : 'bg-lum-green-400'}
               `}
                     />
                     <span
                        className={`ml-[5px] text-[14px] leading-[14px]
                  ${isMuted ? 'text-lum-gray-700' : isOnHold ? 'text-lum-yellow-800' : 'text-lum-green-800'}
               `}>
                        Call Recording
                     </span>
                  </>
               ) : (
                  <>
                     <LoadingSpinner isOpen={true} size={16} theme='light' />
                     <span
                        className={`ml-[5px] text-[14px] leading-[14px] text-lum-gray-200
                     `}>
                        Connecting
                     </span>
                  </>
               )}
            </div>
         </div>
         {isMakingTransfer && (
            <div className='flex items-center ml-[10px] text-[14px] leading-[14px]'>
               <LoadingSpinner isOpen={true} size={16} theme='light' />

               <span className='ml-[5px]'>Warm Transfer to {getFormattedPhoneNumber(transferNumber)}</span>
            </div>
         )}
      </div>
   );
};
export default CallerId;
