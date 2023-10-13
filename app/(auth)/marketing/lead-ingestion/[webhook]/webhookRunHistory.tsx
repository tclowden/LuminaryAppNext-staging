'use client';

import React, { useEffect, useState } from 'react';
import { ColumnType } from '../../../../../common/components/table/tableTypes';

const columns: ColumnType[] = [
   { keyPath: ['status'], title: 'Status', colSpan: .5},
   { keyPath: ['dataIn'], title: 'Data Recieved', colSpan: 2},
   { keyPath: ['createdAt'], title: 'Run Date', colSpan: .5 },
];

import Table from "../../../../../common/components/table/Table";
import { forEach } from 'cypress/types/lodash';


const LIWebhookRunHistory = ({ runHistory }: { runHistory: any }) => {
   const [data, setData] = useState([]);

   useEffect(() => {


      const dataToStore: any = runHistory
         ?.map((u: any, i: number) => ({
            ...u,
            dataIn: u?.dataIn && JSON.stringify(u.dataIn) || '{}',
            createdAt: u?.createdAt && new Date(u.createdAt).toLocaleString() || 'N/A',
            // customRender: i % 2 === 0 ? 'Click to redirect to Login' : 'Click to log to console!',
            // NOTICE HERE, WE ADD THE ACTIONS CONFIG
            actionsConfig: { edit: true, delete: true },
         }))
         .sort((a: any, b: any) => {
            const valueA = columns[0].keyPath?.reduce((acc: any, curr: any) => acc[curr as any], a);
            const valueB = columns[0].keyPath?.reduce((acc: any, curr: any) => acc[curr as any], b);
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
      <>
         <Table
            // fixedHeader
            // tableHeight={1000}
            // actions={[
            //    { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit User', callback: handleActionClick },
            //    { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete User', callback: handleActionClick }
            // ]}
            columns={columns}
            data={data}
         />
      </>
   );
};

export default LIWebhookRunHistory;
