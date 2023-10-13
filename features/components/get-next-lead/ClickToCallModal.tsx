import Button from '@/common/components/button/Button';
import Grid from '@/common/components/grid/Grid';
import Modal from '@/common/components/modal/Modal';
import { TwilioContext } from '@/providers/TwilioProvider';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ActiveCall, selectActiveCall } from '@/store/slices/twilio';
import Link from 'next/link';
import { useEffect, useReducer, useContext } from 'react';

type Props = {
   nextLead: any;
   isClickToCallModalOpen: boolean;
   onClickToCallModalClose: () => void;
};

const initialState = {
   countdown: 3,
   callInitiated: false,
   canNavigateToLeadRecord: false,
};

function reducer(state: any, action: any) {
   switch (action.type) {
      case 'DECREMENT_COUNTDOWN':
         return { ...state, countdown: state.countdown - 1 };
      case 'INITIATE_CALL':
         return { ...state, callInitiated: true };
      case 'RESET_COUNTDOWN_AND_CALL':
         return { ...state, countdown: 3, callInitiated: false };
      case 'ALLOW_NAVIGATION':
         return { ...state, canNavigateToLeadRecord: true };
      default:
         throw new Error();
   }
}

const ClickToCallModal = ({ nextLead, isClickToCallModalOpen, onClickToCallModalClose }: Props) => {
   const activeCall: ActiveCall = useAppSelector(selectActiveCall);
   const { makeOutboundCall } = useContext(TwilioContext);

   const [state, dispatch] = useReducer(reducer, initialState);
   const { countdown, callInitiated, canNavigateToLeadRecord } = state;

   useEffect(() => {
      let timer: NodeJS.Timeout;

      if (isClickToCallModalOpen && countdown > 0 && !callInitiated) {
         timer = setTimeout(() => {
            dispatch({ type: 'DECREMENT_COUNTDOWN' });
         }, 1000);
      } else if (countdown === 0 && !callInitiated) {
         dispatch({ type: 'INITIATE_CALL' });
         makeOutboundCall(nextLead?.phoneNumber);
      }

      return () => timer && clearTimeout(timer);
   }, [isClickToCallModalOpen, countdown, callInitiated, makeOutboundCall, nextLead]);

   useEffect(() => {
      if (isClickToCallModalOpen) {
         dispatch({ type: 'RESET_COUNTDOWN_AND_CALL' });
      }
   }, [isClickToCallModalOpen]);

   useEffect(() => {
      if (activeCall.twilioCallEventStatus === 'accept') {
         dispatch({ type: 'ALLOW_NAVIGATION' });
      }
   }, [activeCall]);

   return (
      <Modal
         isOpen={isClickToCallModalOpen}
         onClose={onClickToCallModalClose}
         customHeader={
            <div className='mr-auto color:lum-gray:500 text-[11px]'>
               Call Status: {activeCall.twilioCallEventStatus}
            </div>
         }>
         <Grid>
            {`Calling ${nextLead.firstName} ${nextLead.lastName}`}
            <h6>Calling in {countdown}... </h6>

            {canNavigateToLeadRecord && (
               <Link
                  href={`/marketing/leads/${nextLead.id}`}
                  style={{
                     textDecoration: 'underline',
                     color: 'lum-primary:700',
                     fontSize: 14,
                  }}>
                  Go to Lead Record
               </Link>
            )}
         </Grid>
      </Modal>
   );
};

export default ClickToCallModal;
