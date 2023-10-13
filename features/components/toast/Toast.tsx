'use client';

import { TwilioContext } from '@/providers/TwilioProvider';
// import { useAppDispatch } from '@/store/hooks';
// import { connectQueueCall } from '@/store/slices/twilio';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { twMerge } from 'tailwind-merge';
import Button from '../../../common/components/button/Button';
import Icon from '../../../common/components/Icon';
import { setRemoveToast, ToastWithId as ToastType } from '../../../store/slices/toast';

// Not really dynamic, but the most dynamic way I've found for dispatching thunks onToastClick
// const THUNKS: any = {
//    'twilio/connectQueueCall': connectQueueCall,
// };

const Toast = ({
   id,
   title,
   iconName,
   details,
   autoCloseDelay,
   onToastClick,
   onCloseToast,
   destinationRoute,
   disableCloseButton,
   variant,
   styles,
   animate,
   audio,
   loopAudio = false,
}: ToastType & { styles: any }) => {
   const dispatch = useDispatch();
   // const appDispatch = useAppDispatch();
   const { acceptCall } = useContext(TwilioContext);
   const router = useRouter();

   const [toastAudio, setToastAudio] = useState<any>(null);
   const [intervalTime, setIntervalTime] = useState<number>(0);

   const handleStopAudio = useCallback(() => {
      if (toastAudio) {
         toastAudio.pause();
         toastAudio.currentTime = 0;
      }
   }, [toastAudio]);

   useEffect(() => {
      if (!audio) return;
      setToastAudio(new Audio(audio));
   }, [audio]);

   useEffect(() => {
      if (!toastAudio) return;
      toastAudio.currentTime = 0;
      toastAudio.loop = !!loopAudio;
      toastAudio.play();

      return () => {
         if (toastAudio) {
            handleStopAudio();
         }
      };
   }, [toastAudio, loopAudio, handleStopAudio]);

   useEffect(() => {
      if (!autoCloseDelay) return;
      const timeoutId = setTimeout(() => dispatch(setRemoveToast({ id })), autoCloseDelay * 1000);
      const intervalId = setInterval(() => setIntervalTime((prevState) => prevState + 100), 100);

      return () => {
         clearTimeout(timeoutId);
         clearInterval(intervalId);
      };
   }, [id, autoCloseDelay, dispatch]);

   const handleRemoveToast = (id: string) => {
      dispatch(setRemoveToast({ id }));
      handleStopAudio();
   };

   const handleToastClick = async ({ actionType, actionPayload }: { actionType: string; actionPayload?: any }) => {
      if (!actionType) return;
      if (actionType === 'twilio/connectQueueCall') {
         if (actionPayload) {
            acceptCall(actionPayload);
         } else {
            acceptCall();
         }
      }
      // const thunkToDispatch = THUNKS[actionType];
      // if (thunkToDispatch) {
      //    await appDispatch(thunkToDispatch(actionPayload));
      // } else {
      //    dispatch({ type: actionType, payload: actionPayload });
      // }
   };

   const handleToastRouting = (destinationRoute: string) => {
      router.push(destinationRoute);
   };

   return (
      <div
         key={id}
         className={twMerge(`absolute z-[1000] grid grid-cols-[65px_165px] min-h-[50px] cursor-pointer transition-all
            ${animate ? 'animate-shakeToast' : 'animate-fadeIn'}
         `)}
         onClick={() => {
            onToastClick && handleToastClick(onToastClick);
            destinationRoute && handleToastRouting(destinationRoute);
            handleRemoveToast(id);
         }}
         style={{ ...styles }}>
         <div
            className={`h-full flex flex-col justify-center items-center px-[12px] rounded-l-md 
            ${variant === 'primary' && 'bg-lum-primary'}
            ${variant === 'success' && 'bg-lum-success'}
            ${variant === 'info' && 'bg-lum-info'}
            ${variant === 'warning' && 'bg-lum-warning'}
            ${variant === 'danger' && 'bg-lum-danger'}
            ${variant === 'secondary' || (!variant && 'bg-lum-secondary')}
         `}>
            <Icon name={iconName || 'Bell'} height='24' width='24' className='fill-lum-white' />
            {title && <span className='text-center text-[12px] leading-[14px] text-lum-white'>{title}</span>}
         </div>
         <div className='relative h-full py-[11px] px-[9px] grid grid-flow-row gap-[5px] rounded-r bg-lum-white dark:bg-lum-gray-650'>
            {details.map((detail, index) => (
               <div key={index} className='grid grid-flow-row'>
                  <span className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>{detail.label}</span>
                  <span className='pr-[5px] text-[12px] text-lum-gray-700 dark:text-lum-white truncate'>
                     {detail.text}
                  </span>
               </div>
            ))}
            {!disableCloseButton && (
               <Button
                  iconName='XCross'
                  color='transparent'
                  onClick={(e) => {
                     e.stopPropagation();
                     onCloseToast && handleToastClick(onCloseToast);
                     handleRemoveToast(id);
                  }}
                  style={{ position: 'absolute', top: '2px', right: '2px' }}
               />
            )}
            {autoCloseDelay && (
               <div className='absolute h-[4px] w-[90%] bottom-[5px] left-1/2 rounded-full transform -translate-x-1/2 bg-lum-gray-100 dark:bg-lum-gray-600'>
                  <div
                     className='h-full rounded-full bg-lum-gray-250 dark:bg-lum-gray-500 transition-[width]'
                     style={{ width: `${(1 - intervalTime / (autoCloseDelay * 1000)) * 100}%` }}></div>
               </div>
            )}
         </div>
      </div>
   );
};

export default Toast;
