'use client';

import Button from '@/common/components/button/Button';
import Checkbox from '@/common/components/checkbox/Checkbox';
import DropDown from '@/common/components/drop-down/DropDown';
import Input from '@/common/components/input/Input';
import Modal from '@/common/components/modal/Modal';
import Textarea from '@/common/components/textarea/Textarea';
import useForm from '@/common/hooks/useForm';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import axios from 'axios';

import React, { useEffect, useState } from 'react';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';

type Props = {
   showAssignModal: any;
   setShowAssignModal: any;
   proposalTechs: any;
   modalTargetProposalQueueId: any;
};

const Assigned = ({ showAssignModal, setShowAssignModal, proposalTechs, modalTargetProposalQueueId }: Props) => {
   const user = useAppSelector(selectUser);

   useEffect(() => {
      // call to get users that could be assigned
   }, []);

   const assign = () => {};

   const {
      handleSubmit,
      handleChange,
      setMultiValues,
      handleBlur,
      setErrorAfterSubmit,
      values,
      errors,
      errorAfterSubmit,
   } = useForm({
      initialValues: {},
      // validationSchema: ProposalFormValidationSchema,
      onSubmit: assign,
   });

   const assignProposalTech = () => {
      console.log('Report baby!');

      console.log('meowth');
      // modalTargetProposalQueueId
      const data = {
         proposalQueueId: modalTargetProposalQueueId,
         newStage: 'In Progress',
         userId: values['userId'],
      };

      let config = {
         method: 'post',
         maxBodyLength: Infinity,
         url: '/api/v2/proposal-queue/queue',
         headers: { Authorization: `Bearer ${user.token}` },
         data: data,
      };

      axios
         .request(config)
         .then((response: any) => {
            console.log(JSON.stringify(response.data));
            if (response.data.success) {
               setShowAssignModal(false);
               //empty values
            }
         })
         .catch((error: any) => {
            console.log(error);
         });

      // call out
   };

   return (
      <>
         <Modal
            title='Assign to Proposal Specialist'
            isOpen={showAssignModal}
            closeOnBackdropClick
            onClose={(e: any) => {
               setShowAssignModal(false);
            }}
            secondaryButtonText='Cancel'
            primaryButtonText='Assign'
            primaryButtonCallback={assignProposalTech}
            children={
               <>
                  <DropDown
                     keyPath={['user', 'fullName']}
                     options={proposalTechs}
                     selectedValues={values?.userId ? [proposalTechs.find((i: any) => i.userId == values.userId)] : []}
                     onOptionSelect={(e: any, options: any) => {
                        handleChange({ target: { name: 'userId', type: 'text', value: options.userId } });
                     }}
                     placeholder='Select Proposal team member'
                     required
                  />

                  <p className='mt-[10px] mb-[200px]'>Select the Proposal team member</p>
               </>
            }
         />
      </>
   );
};

export default Assigned;
