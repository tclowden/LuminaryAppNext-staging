'use client';

import React, { useEffect, useState } from 'react';
import Icon from '../../../common/components/Icon';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { answerCall } from '../../../store/slices/twilio';

interface Props {
   IconName?: string;
   callerId?: string;
}
const InboundCall = () => {
   let { incomingCall } = useAppSelector((store) => store.twilio);
   let dispatch = useAppDispatch();

   function handleCall() {
      dispatch(answerCall(true));
      console.log('answering call');
   }

   if (incomingCall) {
      return (
         <div
            className='absolute w-[160px] h-[60px] bg-lum-white left-[30px] bottom-[20px] animate-bounce'
            onClick={handleCall}>
            Inbound call
         </div>
      );
   } else {
      return null;
   }
};

export default InboundCall;
