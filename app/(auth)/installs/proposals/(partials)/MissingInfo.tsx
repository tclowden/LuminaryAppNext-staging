'use client';

import React, { useEffect, useState } from 'react';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import ConfirmModal from '@/common/components/confirm-modal/ConfirmModal';

type Props = { missing: any; updateProposalQueue: any };

const columns: ColumnType[] = [
   { keyPath: ['name'], title: 'Lead Name', colSpan: 1 },
   { keyPath: ['consultant'], title: 'Consultant', colSpan: 1 },
   { keyPath: ['proposal_type'], title: 'Proposal Type', colSpan: 1 },
   { keyPath: ['date_due'], title: 'Date Due', colSpan: 1 },
   { keyPath: ['due_in'], title: 'Due In', colSpan: 1 },
];

// Actions Missing info
// Notify consultant
// Return to unassigned

const MissingInfo = ({ missing, updateProposalQueue }: Props) => {
   const [data, setData] = useState([]);
   const [openRevert, setOpenRevert] = useState<boolean>(false);
   const [modalTargetProposalQueueId, setModalTargetProposalQueueId] = useState<string>();

   const user = useAppSelector(selectUser);

   useEffect(() => {
      const dataToStore: any = missing
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
   }, []);

   const handleActionClick = ({ event, actionKey, item }: { event: Event; actionKey: string; item: any }) => {
      console.log('EVENT', event);
      console.log('ACTION KEY', actionKey);
      console.log('ITEM RETURNED', item);
      switch (actionKey) {
         case 'revert':
            setModalTargetProposalQueueId(item.id);
            setOpenRevert(true);
            break;
         default:
            break;
      }
   };

   const revert = () => {
      console.log('call out to move back');

      const axios = require('axios');
      let data = JSON.stringify({
         proposalQueueId: modalTargetProposalQueueId,
         newStage: 'Unassigned',
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
               setOpenRevert(false);
               updateProposalQueue();
            }
         })
         .catch((error: any) => {
            console.log(error);
         });
   };

   return (
      <div>
         <Table
            actions={[
               { icon: 'Edit', actionKey: 'revert', toolTip: 'Revert to unassigned', callback: handleActionClick },
            ]}
            columns={columns}
            data={data}
            onCellEvent={({ event }) => {
               console.log('Checkbox', event);
            }}
         />

         <ConfirmModal
            open={openRevert}
            handleOnClose={(e: any) => {
               setOpenRevert(!openRevert);
            }}
            handleOnConfirm={() => revert()}
            confirmationText={'Send proposal to unassigned?'}
         />
      </div>
   );
};

export default MissingInfo;
