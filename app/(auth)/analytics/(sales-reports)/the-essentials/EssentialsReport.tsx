'use client';
import DropDown from '@/common/components/drop-down/DropDown';
import LoadingSpinner from '@/common/components/loaders/loading-spinner/LoadingSpinner';
import PageContainer from '@/common/components/page-container/PageContainer';
import Table from '@/common/components/table/Table';
import { ColumnType, SortingConfiguration, SortingType } from '@/common/components/table/tableTypes';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import React, { useEffect, useState } from 'react';

// TODO: Share type with server
type PrettyInterval =
   | 'Today'
   | 'Yesterday'
   | 'Last Full Week'
   | 'Month To Date'
   | 'Last Full Month'
   | 'Year To Date'
   | 'Six Week Rolling';

type ReportData = {
   reportData: any[];
   intervalOptions: any[];
};

const columns: ColumnType[] = [
   { keyPath: ['fullName'], title: 'Consultant', colSpan: 1, sortable: true },
   { keyPath: ['office'], title: 'Office', colSpan: 1, sortable: true },
   { keyPath: ['totalCalls'], title: 'Dials', colSpan: 1, sortable: true },
   { keyPath: ['talkTime'], title: 'Talk Time', colSpan: 1, sortable: true },
   { keyPath: ['totalContracts'], title: 'Contracts Signed', colSpan: 1, sortable: true },
   { keyPath: ['totalRevenue'], title: 'Revenue', colSpan: 1, sortable: true },
];

const fetchData = async (authToken: string | null, intervalOption: PrettyInterval) => {
   try {
      const report = await fetch(`/api/v2/analytics/reports/essentials?interval=${intervalOption}`, {
         method: 'GET',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
         cache: 'no-store',
      });
      return await report.json();
   } catch (error) {
      console.log(error);
   }
};

export default function EssentialsReport({ reportData, intervalOptions }: ReportData) {
   console.log('reportData:', reportData);
   const user = useAppSelector(selectUser);

   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [data, setData] = useState<any[]>([...reportData]);

   const [sortingConfig, setSortingConfig] = useState<SortingConfiguration>({
      column: columns[0],
      sortType: SortingType.ASC,
   });
   // Set to null, server default interval is six weeks
   const [selectedOption, setSelectedOption] = useState<any[]>();

   useEffect(() => {
      console.log('useEffect: ', selectedOption);
      if (!!selectedOption) {
         // Make a fetchData call with the selectedOption
         setIsLoading(true);
         fetchData(user?.token, selectedOption[0].option).then((data) => {
            setData([...data]);
            setIsLoading(false);
         });
      }
   }, [selectedOption]);

   const handleTableSort = (column: ColumnType, direction: SortingType, sortedData: any) => {
      setSortingConfig({ column, sortType: direction });
      setData(sortedData);
   };

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <DropDown
                  className='w-[150px]'
                  selectedValues={selectedOption ? selectedOption : []}
                  placeholder={'Date Filter'}
                  options={intervalOptions}
                  keyPath={['option']}
                  onOptionSelect={(e: any, arg: any) => {
                     setSelectedOption([arg]);
                  }}></DropDown>
            }>
            <Table
               isLoading={isLoading}
               columns={columns}
               data={data}
               pagination
               onTableSort={handleTableSort}
               sortingConfig={sortingConfig}></Table>
         </PageContainer>
      </>
   );
}
