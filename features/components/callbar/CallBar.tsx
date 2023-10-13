'use client';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { endCall, mute, placeOnHold, setTransfer } from '../../../store/slices/twilio';
import CallerId from './CallerId';
// import useTwilio from '../../../common/hooks/useTwilio';
import Button from '../../../common/components/button/Button';
import { twMerge } from 'tailwind-merge';
import { useContext, useState } from 'react';
import KeyPad from '../../../common/components/manual-dialer/KeyPad';
import { createPortal } from 'react-dom';
import { selectUser } from '@/store/slices/user';
import OptionSelector from '@/common/components/option-selector/OptionSelector';
import { getObjectProp } from '@/utilities/helpers';
import { TwilioContext } from '@/providers/TwilioProvider';

const hotTransferNumbers = [
   { name: 'Safe Streets', number: '+16282042921' },
   { name: 'Developer (testing)', number: '+14804146685' },
   // { name: 'East Desk', number: '+14803828992' },
];

const CallBar = () => {
   // TODO: setup Twiml hooks
   // useTwilio();
   const user = useAppSelector(selectUser);
   const {
      isCallBarShowing,
      callBarStatus,
      currentCallSid,
      isOnHold,
      isMuted,
      lead,
      toNumber,
      fromNumber,
      isMakingTransfer,
      transferNumber,
      conferenceId,
   } = useAppSelector((store) => store.twilio);
   const dispatch = useAppDispatch();
   const { endCall, muteCall } = useContext(TwilioContext);
   const [isKeypadOpen, setIsKeypadOpen] = useState<boolean>(false);
   const [isTransferSelected, setIsTransferSelected] = useState<boolean>(false);
   const [optionSearchVal, setOptionSearchVal] = useState<string>('');

   const handleCallAction = (action: string) => {
      switch (action) {
         default:
            console.log('handleCallAction:', action);
            break;
      }
   };

   const optionSearchResults = hotTransferNumbers.filter((option: any) => {
      return getObjectProp(option, ['name'])?.toLowerCase().includes(optionSearchVal?.toLowerCase());
   });

   const handleTransferCall = (selectedHotTransfer: any) => {
      if (!selectedHotTransfer) return;
      const transferNumber = getObjectProp(selectedHotTransfer, ['number']);
      fetch(`/api/v2/twilio/transfer`, {
         method: 'POST',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user?.token}` },
         body: JSON.stringify({
            callSid: currentCallSid,
            userId: user.id,
            userNumber: user.phoneNumbers[0].phoneNumber,
            transferNumber,
            toNumber,
            fromNumber,
            conferenceId,
         }),
      });
      dispatch(setTransfer({ isMakingTransfer: true, transferNumber }));
   };

   if (isCallBarShowing) {
      return (
         <>
            <div
               className={twMerge(`flex w-full h-[60px] bg-lum-green-550
               ${isOnHold && 'bg-lum-yellow-500'}
               ${isMuted && 'bg-lum-gray-300'}
               ${callBarStatus === 'connecting' && 'bg-lum-blue-500'}
            `)}>
               <CallerId
                  leadName={
                     [lead?.firstName, lead?.lastName].some((val: any) => !!val)
                        ? `${lead?.firstName || ''} ${lead?.lastName || ''}`.trim()
                        : null
                  }
                  phoneNumber={lead?.phoneNumber || toNumber}
                  startTimer={true}
                  isMuted={!!isMuted}
                  isOnHold={!!isOnHold}
                  callBarStatus={callBarStatus}
                  isMakingTransfer={isMakingTransfer}
                  transferNumber={transferNumber}
               />
               <div
                  className={`flex gap-x-[10px] border-l-[1px] items-center p-[10px]
                  ${isMuted ? 'border-lum-gray-200' : isOnHold ? 'border-lum-yellow-400' : 'border-lum-green-400'}
                  ${callBarStatus === 'connecting' && 'border-lum-blue-400'}
               `}>
                  <Button
                     iconName={'PhoneKeys'}
                     iconColor={isKeypadOpen ? (isMuted ? 'gray:300' : isOnHold ? 'yellow' : 'green:550') : 'white'}
                     color={isKeypadOpen ? 'white' : isMuted ? 'gray:300' : isOnHold ? 'yellow' : 'green:550'}
                     size='md'
                     tooltipContent={isKeypadOpen ? 'Close Dial Keypad' : 'Dial Keypad'}
                     onClick={() => {
                        handleCallAction('keyPad');
                        setIsKeypadOpen(!isKeypadOpen);
                        if (isTransferSelected) setIsTransferSelected(false);
                     }}
                     disabled={callBarStatus === 'connecting'}
                  />
                  {/* <Button
                     iconName={'PhoneMerge'}
                     iconColor='white'
                     color={isMuted ? 'gray:300' : isOnHold ? 'yellow' : 'green:550'}
                     size='md'
                     tooltipContent={'Merge Call'}
                     onClick={() => {
                        handleCallAction('merge');
                     }}
                     disabled={callBarStatus === 'connecting'}
                  /> */}
                  <Button
                     iconName={'PhoneForward'}
                     iconColor='white'
                     color={isMuted ? 'gray:300' : isOnHold ? 'yellow' : 'green:550'}
                     size='md'
                     tooltipContent={'Transfer Call'}
                     onClick={() => {
                        setIsTransferSelected(!isTransferSelected);
                        if (isKeypadOpen) setIsKeypadOpen(false);
                     }}
                     disabled={callBarStatus === 'connecting'}
                  />
               </div>
               <div
                  className={twMerge(`flex gap-x-[10px] border-l-[1px] items-center p-[10px]
                  ${isMuted ? 'border-lum-gray-200' : isOnHold ? 'border-lum-yellow-400' : 'border-lum-green-400'}
                  ${callBarStatus === 'connecting' && 'border-lum-blue-400'}
               `)}>
                  <Button
                     iconName={'PhoneMute'}
                     iconColor={isMuted ? 'gray:300' : 'white'}
                     color={isMuted ? 'white' : isOnHold ? 'yellow' : 'green:550'}
                     size='md'
                     tooltipContent={isMuted ? 'Unmute' : 'Mute'}
                     tooltipOpenDelay={0}
                     onClick={() => {
                        // dispatch(mute(!isMuted));
                        muteCall(!isMuted);
                     }}
                     disabled={callBarStatus === 'connecting'}
                  />
                  <Button
                     iconName={'PhoneAnswer'}
                     iconColor={isOnHold ? (isMuted ? 'gray:300' : 'yellow') : 'white'}
                     color={isOnHold ? (isMuted ? 'white' : 'white') : isMuted ? 'gray:300' : 'green:550'}
                     size='md'
                     tooltipContent={isOnHold ? 'Remove Hold' : 'Place on Hold'}
                     tooltipOpenDelay={0}
                     onClick={() => {
                        dispatch(placeOnHold(!isOnHold));
                     }}
                     disabled={callBarStatus === 'connecting'}
                  />
                  <Button
                     iconName={'PhoneEnd'}
                     iconColor='white'
                     color={isMuted ? 'gray:300' : isOnHold ? 'yellow' : 'green:550'}
                     size='md'
                     tooltipContent={'End Call'}
                     tooltipOpenDelay={0}
                     onClick={() => {
                        // dispatch(endCall());
                        endCall();
                     }}
                     disabled={callBarStatus === 'connecting'}
                  />
               </div>
            </div>
            {isKeypadOpen &&
               createPortal(
                  <div
                     className='absolute z-10 top-[60px] right-[220px] px-[20px] py-[10px] rounded bg-lum-white dark:bg-lum-gray-700'
                     style={{ boxShadow: '0px 2px 5px rgba(16, 24, 30, 0.3)' }}>
                     <KeyPad handleKeyClick={(digit) => console.log('digit', digit)} />
                  </div>,
                  document.body
               )}
            {isTransferSelected &&
               createPortal(
                  <div className='absolute z-10 top-[60px] right-[385px]'>
                     <OptionSelector
                        options={optionSearchResults}
                        textKeyPath={['name']}
                        onOptionSelect={(e: any, option: any) => {
                           console.log('e, option:', e, option);
                           handleTransferCall(option);
                           // searchable && setOptionSearchVal('');
                           // onOptionSelect(e, option);
                        }}
                        showOptions={isTransferSelected}
                        setShowOptions={setIsTransferSelected}
                        // siblingRef={buttonRef}
                        searchable={true}
                        searchConfig={{
                           placeholder: 'Search',
                           searchValue: optionSearchVal,
                           handleChange: (e: any) => {
                              setOptionSearchVal(e.target.value);
                           },
                        }}
                        autoFocus={false}
                     />
                  </div>,
                  document.body
               )}
         </>
      );
   } else {
      return null;
   }
};
export default CallBar;
