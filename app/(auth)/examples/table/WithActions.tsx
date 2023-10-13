'use client';

import React, { useEffect, useState } from 'react';
import Table from '../../../../common/components/table/Table';
import { ColumnType } from '../../../../common/components/table/tableTypes';

const columns: ColumnType[] = [
   { keyPath: ['fullName'], title: 'Name', colSpan: 1 },
   { keyPath: ['role', 'name'], title: 'Role', colSpan: 2 },
   { keyPath: ['emailAddress'], title: 'Email', colSpan: 1 },
   { keyPath: ['phoneNumber'], title: 'Phone Number', colSpan: 1 },
];

const WithActions = ({ allData }: { allData: any[] }) => {
   const [data, setData] = useState([]);

   useEffect(() => {
      const dataToStore: any = allData
         ?.map((u: any, i: number) => ({
            ...u,
            fullName: u.firstName + ' ' + u.lastName,
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
         <h2>With Actions Example</h2>
         <p className='pb-2 text-[14px] text-lum-gray-700'>
            Click on each action icon & check the console to see what each is returning...
         </p>
         <Table
            actions={[
               { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit User', callback: handleActionClick },
               { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete User', callback: handleActionClick },
               { icon: 'Duplicate', actionKey: 'duplicate', toolTip: 'Duplicate User', callback: handleActionClick },
               { icon: 'Duplicate', actionKey: 'duplicate', toolTip: 'Duplicate User', callback: handleActionClick },
            ]}
            columns={columns}
            data={data}
         />
      </div>
   );
};

export default WithActions;
