'use client';

import React, { useEffect, useState } from 'react';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';

type Props = {};

const all_data = [
   {
      file: '9.12kw EE St4orz 10k',
      proposal_tech: 'Zachary Wilson',
      date_created: '12/20/2022  7:48 PM',
      solar: true,
      hvac: false,
      ee: true,
      battery: true,
      // actionsConfig: { edit: true, duplicate: true, delete: true },
   },
   {
      file: '9.12kw EE Storz 10k',
      proposal_tech: 'Zachary Wilson',
      date_created: '12/20/2022  7:48 PM',
      solar: false,
      hvac: true,
      ee: true,
      battery: true,
      // actionsConfig: { edit: true, duplicate: true, delete: true },
   },
];

const columns: ColumnType[] = [
   { keyPath: ['name'], title: 'Lead Name', colSpan: 1 },
   { keyPath: ['consultant'], title: 'Consultant', colSpan: 1 },
   { keyPath: ['proposal_type'], title: 'Proposal Type', colSpan: 1 },
   { keyPath: ['date_due'], title: 'Date Due', colSpan: 1 },
   { keyPath: ['due_in'], title: 'Due In', colSpan: 1 },
];

// Actions Unassigned
// report missing info
// Report missing information : What information is missing: Energy Usage, Sq Footage, Roof confirmation, Electric Company, Other missing info, "report missing info"
// Assign to specialist
// A popup with a select field with all proposal specialists, assign now and cancel

// Actions In Progress
// Notify Specialist
// Revert to unassigned

// Actions Complete
// Request Revision

// Actions Missing info
// Notify consultant
// Return to unassigned

// Actions Revisions requested
// Revision complete

// New Drafts
// Draft Used

const NewDrafts = ({}: Props) => {
   const [data, setData] = useState([]);

   useEffect(() => {
      const dataToStore: any = all_data
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
         case 'edit':
            break;
         case 'delete':
            break;
         default:
            break;
      }
   };

   return (
      <div>
         <Table
            actions={[
               { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit User', callback: handleActionClick },
               { icon: 'Duplicate', actionKey: 'duplicate', toolTip: 'Duplicate User', callback: handleActionClick },
            ]}
            columns={columns}
            data={data}
            onCellEvent={({ event }) => {
               console.log('Checkbox', event);
            }}
         />
      </div>
   );
};

export default NewDrafts;
