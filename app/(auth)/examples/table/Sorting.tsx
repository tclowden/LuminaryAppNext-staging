'use client';

import React, { useEffect, useState } from 'react';
import Table from '../../../../common/components/table/Table';
import { ColumnType, SortingConfiguration, SortingType } from '../../../../common/components/table/tableTypes';

const columns: ColumnType[] = [
   { keyPath: ['fullName'], title: 'Name', colSpan: 1, sortable: true },
   { keyPath: ['role', 'name'], title: 'Role', colSpan: 2 },
   { keyPath: ['emailAddress'], title: 'Email', colSpan: 1 },
   { keyPath: ['phoneNumber'], title: 'Phone Number', colSpan: 1 },
];

const Sorting = ({ allData }: { allData: any[] }) => {
   const [data, setData] = useState<Array<any>>([]);
   const [sortConfig, setSortConfig] = useState<SortingConfiguration>({
      column: columns[0],
      sortType: SortingType.ASC,
   });

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

   const onTableSort = (column: ColumnType, direction: SortingType, sortedData: Array<any>) => {
      // you can sort yourself....
      // const usersToSave = [...data].sort((a, b) => {
      //    const valueA = column.keyPath.reduce((acc, curr) => acc[curr as any], a);
      //    const valueB = column.keyPath.reduce((acc, curr) => acc[curr as any], b);
      //    if (direction === SortingType.ASC) return valueA > valueB ? 1 : -1;
      //    else return valueA < valueB ? 1 : -1;
      // });
      // OR use the sortedData... the sortedData being passed in is being sorted exactly the same way..
      setData(sortedData);
      setSortConfig({ column: column, sortType: direction });
   };

   return (
      <div>
         <h2>Example Sorting</h2>
         <p className='pb-2 text-[14px] text-lum-gray-700'></p>
         <Table columns={columns} data={data} sortingConfig={sortConfig} onTableSort={onTableSort} />
      </div>
   );
};

export default Sorting;
