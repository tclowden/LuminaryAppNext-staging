'use client';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import Button from '../../../common/components/button/Button';
import { selectUser } from '../../../store/slices/user';
import { BucketResponse, Lead } from './types';
import { useEffect, useState } from 'react';
import DialerModal from './DialerModal';
import { useRouter } from 'next/navigation';
import ClickToCallModal from './ClickToCallModal';
import LeadStatusModal from '@/app/(auth)/marketing/leads/[id]/(partials)/LeadStatusModal';
import { makeOutboundCall } from '@/store/slices/twilio';

type Props = {
   selectedBucket: BucketResponse | null;
};

const GetNextLeadButton = ({ selectedBucket }: Props) => {
   let dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const authToken: string | null = user.token;
   const router = useRouter();
   const userId = user?.id;
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [nextLead, setNextLead] = useState<Lead>();
   const [isClickToCallModalOpen, setIsClickToCallModalOpen] = useState<boolean>(false);

   const handleOnCloseModal = () => {
      setIsModalOpen(!isModalOpen);
   };

   const handleClickToCallModalClose = () => {
      setIsClickToCallModalOpen(!isClickToCallModalOpen);
   };

   const requestOptions = {
      userId: userId,
      bucketId: selectedBucket?.id,
      bucketType: selectedBucket?.bucketType.typeName,
      authToken: authToken,
   };

   const fetchNextLead = async (requestOptions: any) => {
      let response = await fetch(`/api/v2/buckets/get-next-lead`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${requestOptions.authToken}` },
         cache: 'no-store',
         body: JSON.stringify(requestOptions),
      });

      if (response.ok) {
         const lead = await response.json();
         console.log('lead: ', lead);
         setNextLead(lead);
         setIsClickToCallModalOpen(true);
      } else {
         console.log('No leads found', response);
      }
   };

   return (
      <>
         <Button color='green' iconName='PhoneAngled' iconColor='white' onClick={() => fetchNextLead(requestOptions)}>
            Get Next Lead
         </Button>
         {/* <DialerModal isModalOpen={isModalOpen} leadsData={nextLead} handleOnCloseModal={handleOnCloseModal} /> */}
         {nextLead && (
            <ClickToCallModal
               isClickToCallModalOpen={isClickToCallModalOpen}
               onClickToCallModalClose={handleClickToCallModalClose}
               nextLead={nextLead}
            />
         )}
         {/* {showLeadStatusModal && (
            <LeadStatusModal
               isOpen={showLeadStatusModal}
               onClose={(e) => handleShowLeadStatusModal(false)}
               leadId={nextLead?.id as string}
               currentStatus={nextLead?.status}
               onLeadStatusUpdate={function (status: any): void {
                  // handleShowLeadStatusModal(false);
               }}
            />
         )} */}
      </>
   );
};

export default GetNextLeadButton;
