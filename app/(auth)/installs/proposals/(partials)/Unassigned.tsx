'use client';

import Button from '@/common/components/button/Button';
import Checkbox from '@/common/components/checkbox/Checkbox';
import Input from '@/common/components/input/Input';
import Modal from '@/common/components/modal/Modal';
import Textarea from '@/common/components/textarea/Textarea';
import useForm from '@/common/hooks/useForm';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';

import React, { useEffect, useState } from 'react';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';
import Assign from './Assign';

type Props = { unassigned: []; proposalTechs: []; updateProposalQueue: any };

const columns: ColumnType[] = [
   { keyPath: ['name'], title: 'Lead Name', colSpan: 1 },
   { keyPath: ['consultant'], title: 'Consultant', colSpan: 1 },
   { keyPath: ['proposalType'], title: 'Proposal Type', colSpan: 1 },
   { keyPath: ['dateDue'], title: 'Date Due', colSpan: 1 },
   { keyPath: ['dueIn'], title: 'Due In', colSpan: 1 },
];

const Unassigned = ({ unassigned, proposalTechs, updateProposalQueue }: Props) => {
   const [data, setData] = useState([]);
   const [showReportModal, setShowReportModal] = useState<boolean>(false);
   const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
   const [reportChecks, setReportChecks] = useState<any>({});
   const [modalTargetProposalQueueId, setModalTargetProposalQueueId] = useState<string>();

   const user = useAppSelector(selectUser);

   useEffect(() => {
      const dataToStore: any = unassigned
         .map((u: any, i: number) => ({
            ...u,
            // NOTICE HERE, WE ADD THE ACTIONS CONFIG
            actionsConfig: { edit: true, duplicate: true, delete: true },
         }))
         .sort((a: any, b: any) => {
            // @ts-ignore
            const valueA = columns[0].keyPath.reduce((acc: any, curr: any) => acc[curr as any], a);
            // @ts-ignore
            const valueB = columns[0].keyPath.reduce((acc: any, curr: any) => acc[curr as any], b);
            return valueA > valueB ? 1 : -1;
         });
      setData(dataToStore);
   }, [unassigned]);

   const handleActionClick = ({ event, actionKey, item }: { event: Event; actionKey: string; item: any }) => {
      console.log('EVENT', event);
      console.log('ACTION KEY', actionKey);
      console.log('ITEM RETURNED', item);
      switch (actionKey) {
         case 'report':
            // Actions Unassigned
            // report missing info
            // Report missing information : What information is missing: Energy Usage, Sq Footage, Roof confirmation, Electric Company, Other missing info, "report missing info"

            setModalTargetProposalQueueId(item.id);
            setShowReportModal(true);
            const clear = {
               energyUsage: false,
               sqFtRoof: false,
               electricCompany: false,
               other: false,
               note: '',
            };
            setMultiValues(clear);

            break;
         case 'assign':
            // Assign to specialist
            // A popup with a select field with all proposal specialists, assign now and cancel
            setModalTargetProposalQueueId(item.id);
            setShowAssignModal(true);
            break;
         default:
            break;
      }
   };

   const reportMissingInfo = () => {
      const axios = require('axios');
      let data = JSON.stringify({
         ...values,
         proposalQueueId: modalTargetProposalQueueId,
         newStage: 'Missing Info',
      });

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
               setShowReportModal(false);
               updateProposalQueue();
               //empty values
            }
         })
         .catch((error: any) => {
            console.log(error);
         });
   };

   const hasTrueValue = (obj: any) => {
      // Check if the object has any keys
      if (Object.keys(obj).length === 0) {
         return false;
      }

      // Check for true values among the keys
      for (let key in obj) {
         if (obj[key] === true) {
            return true;
         }
      }

      return false;
   };

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
      onSubmit: reportMissingInfo,
   });

   return (
      <>
         <Table
            actions={[
               {
                  icon: 'Edit',
                  actionKey: 'report',
                  toolTip: 'Report Missing Info',
                  callback: handleActionClick,
               },
               {
                  icon: 'Tools',
                  actionKey: 'assign',
                  toolTip: 'Assign To Specialist',
                  callback: handleActionClick,
               },
            ]}
            columns={columns}
            data={data}
            onCellEvent={({ event }) => {
               console.log('Checkbox', event);
            }}
         />

         <Modal
            title='Select Missing Information'
            isOpen={showReportModal}
            closeOnBackdropClick
            onClose={(e: any) => {
               setShowReportModal(false);
            }}
            secondaryButtonText='Cancel'
            primaryButtonText='Report'
            disablePrimaryButton={!hasTrueValue(values)}
            primaryButtonCallback={reportMissingInfo}
            children={
               <>
                  <Checkbox
                     checked={!!values['energyUsage' as keyof Object]}
                     onChange={handleChange}
                     label={'Energy Usage'}
                     name={'energyUsage'}
                  />
                  <Checkbox
                     checked={!!values['sqFtRoof' as keyof Object]}
                     onChange={handleChange}
                     label={'Sq Footage Roof confirmation'}
                     name={'sqFtRoof'}
                  />
                  <Checkbox
                     checked={!!values['electricCompany' as keyof Object]}
                     onChange={handleChange}
                     label={'Electric Company'}
                     name={'electricCompany'}
                  />
                  <Checkbox
                     checked={!!values['other' as keyof Object]}
                     onChange={handleChange}
                     label={'Other missing info'}
                     name={'other'}
                  />
                  <Textarea name={'note'} label={'Missing info'} onChange={handleChange} value={values['note']} />
               </>
            }
         />

         <Assign
            showAssignModal={showAssignModal}
            setShowAssignModal={setShowAssignModal}
            proposalTechs={proposalTechs}
            modalTargetProposalQueueId={modalTargetProposalQueueId}
         />
      </>
   );
};

export default Unassigned;
