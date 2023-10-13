'use client';
import React, { useEffect, useState } from 'react';
import Table from '../../../../common/components/table/Table';
import { ColumnType } from '../../../../common/components/table/tableTypes';

const columns: ColumnType[] = [
   { keyPath: ['fullName'], title: 'Name', colSpan: 2 },
   { keyPath: ['role', 'name'], title: 'Role', colSpan: 2 },
   { keyPath: ['emailAddress'], title: 'Email', colSpan: 1 },
   { keyPath: ['phoneNumber'], title: 'Phone Number', colSpan: 1 },
];

const WithNestedRows = ({ allData }: { allData: any[] }) => {
   const [data, setData] = useState([]);

   useEffect(() => {
      const dataToStore: any = allData
         ?.map((u: any, i: number) => ({
            ...u,
            fullName: i === 2 ? u.firstName + ' ' + u.lastName + ' (NOT COLLAPSABLE)' : u.firstName + ' ' + u.lastName,
            ...(i !== 2 && {
               expandableData: [
                  {
                     fullName: `naw.. first: ${u.firstName}`,
                     role: { name: 'MVP Role' },
                     email: 'personal...',
                     phoneNumber: '555666555' + i,
                  },
               ],
            }),
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
         <h2>With Nested Rows</h2>
         <p className='pb-2 text-[14px] text-lum-gray-700'>
            The Data Set being passed in must have a key:value pair with the key named: `expandableData` & the value
            being an array type. Must also add the `expandableRows` prop to the table component.
            <br />
            <br />
            Notice if there is no key named: `expandableData`, the icon won't show up, & the row won't expand.
         </p>
         <Table columns={columns} data={data} expandableRows />
      </div>
   );
};

export default WithNestedRows;
