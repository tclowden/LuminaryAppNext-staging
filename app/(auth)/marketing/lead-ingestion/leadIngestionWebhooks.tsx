'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Table from '../../../../common/components/table/Table';
import { ColumnType } from '../../../../common/components/table/tableTypes';
import Tooltip from '../../../../common/components/tooltip/Tooltip';

const columns: ColumnType[] = [
   {
      keyPath: ['name'], title: 'Name', colSpan: 2,
      render: ({ column, item }) => {
         return (
            <Tooltip content={item.description}>
               <Link href={`/marketing/lead-ingestion/${item.id}`} className='block'>
                  {item.name}
               </Link>
            </Tooltip >
         );
      },
   },
   { keyPath: ['total'], title: 'Total', colSpan: .5 },
   { keyPath: ['successes'], title: 'Success', colSpan: .5 },
   { keyPath: ['fails'], title: 'Failed', colSpan: .5 },
   // { keyPath: ['duplicate'], title: 'Duplicate', colSpan: .5 },
   { keyPath: ['id'], title: 'Endpoint', colSpan: .5 },
];

const LeadIngestionWebhooks = ({ endpoints }: { endpoints?: object[] }) => {
   const [data, setData] = useState([]);
   const router = useRouter()

   useEffect(() => {
      const dataToStore: any = endpoints
         ?.map((u: any, i: number) => ({
            ...u,
            name: u?.name || 'N/A',
            actionsConfig: { edit: true, delete: true },
         }))
         .sort((a: any, b: any) => {
            const valueA = columns[0].keyPath?.reduce((acc: any, curr: any) => acc[curr as any], a);
            const valueB = columns[0].keyPath?.reduce((acc: any, curr: any) => acc[curr as any], b);
            return valueA > valueB ? 1 : -1;
         });
      setData(dataToStore);
   }, [endpoints]);

   const handleActionClick = ({ event, actionKey, item }: { event: Event; actionKey: string; item: any }) => {
      console.log('EVENT', event);
      console.log('ACTION KEY', actionKey);
      console.log('ITEM RETURNED', item);
      switch (actionKey) {
         case 'edit':
            router.push(`/marketing/lead-ingestion/${item.id}?tab=2`)
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
            // fixedHeader
            // tableHeight={1000}
            actions={[
               { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Source', callback: handleActionClick },
               { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Archive Source', callback: handleActionClick }
            ]}
            columns={columns}
            data={data}
         />
      </div>
   );
};

export default LeadIngestionWebhooks;