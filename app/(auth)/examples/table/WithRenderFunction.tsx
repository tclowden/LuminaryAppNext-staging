'use client';

import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Button from '../../../../common/components/button/Button';
import Table from '../../../../common/components/table/Table';
import { ColumnType } from '../../../../common/components/table/tableTypes';

const WithRenderFunction = ({ allData }: { allData: any[] }) => {
   const [data, setData] = useState([]);
   const router = useRouter();

   const columns: ColumnType[] = [
      { keyPath: ['fullName'], title: 'Name', colSpan: 1 },
      {
         keyPath: ['customRender'],
         title: 'Custom Render',
         colSpan: 2,
         render: ({ column, item }) => {
            // Can add anything you want here... it will render...
            return (
               <Button
                  size='sm'
                  onClick={(e) => {
                     if (item.customRender.includes('console')) console.log(item, column, e);
                     else router.push(item.navigateTo);
                  }}>
                  {item.customRender}
               </Button>
            );
         },
      },
      { keyPath: ['phoneNumber'], title: 'Phone Number', colSpan: 1 },
   ];

   useEffect(() => {
      const dataToStore: any = allData
         ?.map((u: any, i: number) => ({
            ...u,
            fullName: u.firstName + ' ' + u.lastName,
            navigateTo: '/login',
         }))
         .sort((a: any, b: any) => {
            // @ts-ignore
            const valueA = columns[0].keyPath.reduce((acc: any, curr: any) => acc[curr as any], a);
            // @ts-ignore
            const valueB = columns[0].keyPath.reduce((acc: any, curr: any) => acc[curr as any], b);
            return valueA > valueB ? 1 : -1;
         })
         .map((u: any, i: number) => ({
            ...u,
            customRender: i % 2 === 0 ? 'Click to redirect to Login' : 'Click to log to console!',
         }));
      setData(dataToStore);
   }, []);

   return (
      <div>
         <h2>Using the `Render` Method</h2>
         <p className='pb-2 text-[14px] text-lum-gray-700'></p>
         <Table columns={columns} data={data} />
      </div>
   );
};

export default WithRenderFunction;
