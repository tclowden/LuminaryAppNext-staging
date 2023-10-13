'use client';

import React, { useEffect, useState } from 'react';
import Table from '../../../../common/components/table/Table';
import { ColumnType } from '../../../../common/components/table/tableTypes';

const columns: ColumnType[] = [
   { keyPath: ['fullName'], title: 'Name (FLEX WIDTH)', colSpan: 1 },
   { keyPath: ['role', 'name'], title: 'Role (FIXED WIDTH)', colSpan: 2, fixedWidth: true },
   { keyPath: ['emailAddress'], title: 'Email (FLEX WIDTH)', colSpan: 1 },
   { keyPath: ['phoneNumber'], title: 'Phone Number (FLEX WIDTH)', colSpan: 1 },
];

const WithFixedColumns = ({ allData }: { allData: any[] }) => {
   const [data, setData] = useState([]);

   useEffect(() => {
      const dataToStore: any = allData
         ?.map((u: any, i: number) => ({
            ...u,
            fullName: u.firstName + ' ' + u.lastName,
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

   return (
      <div>
         <h2>With Fixed Width Column Example</h2>
         <p className='pb-2 text-[14px] text-lum-gray-700'>
            You should see that the 'Roles' coilumn is always the same size, no matter the screen size... Resize window
            to test.
         </p>
         <Table columns={columns} data={data} />
      </div>
   );
};

export default WithFixedColumns;
