'use client';
import LoadingSpinner from '@/common/components/loaders/loading-spinner/LoadingSpinner';
import Table from '@/common/components/table/Table';
import { ColumnType, SortingConfiguration, SortingType } from '@/common/components/table/tableTypes';
import React, { useEffect, useState } from 'react';

type ReportData = {
   reportData: any[];
};

const columns: ColumnType[] = [
   { keyPath: ['leadSource'], title: 'Consultant', colSpan: 2, sortable: true },
   { keyPath: ['leads'], title: 'Leads', colSpan: 1, sortable: true },
   // { keyPath: ['contactRate'], title: 'Contact Rate', colSpan: 1, sortable: true },
   // { keyPath: ['apptsSet'], title: 'Appointments Set', colSpan: 1, sortable: true },
   // { keyPath: ['leadToAppt'], title: 'Lead to Appointment', colSpan: 1, sortable: true },
   // { keyPath: ['apptsKept'], title: 'Appointments Kept', colSpan: 1, sortable: true },
   // { keyPath: ['keptRatio'], title: 'Kept Ratio', colSpan: 1, sortable: true },
   // { keyPath: ['sales'], title: 'Sales', colSpan: 1, sortable: true },
   // { keyPath: ['closeRatio'], title: 'Close Ratio', colSpan: 1, sortable: true },
   // { keyPath: ['leadToSale'], title: 'Lead to Sale', colSpan: 1, sortable: true },
   // { keyPath: ['totalRevenue'], title: 'Revenue', colSpan: 1, sortable: true },
   // { keyPath: ['cancels'], title: 'Cancels', colSpan: 1, sortable: true },
];

export default function EssentialsReport({ reportData }: ReportData) {
   const [data, setData] = useState<any[]>([...reportData]);
   const [sortingConfig, setSortingConfig] = useState<SortingConfiguration>({
      column: columns[0],
      sortType: SortingType.ASC,
   });

   const handleTableSort = (column: ColumnType, direction: SortingType, sortedData: any) => {
      console.log('sortedData:', sortedData);
      setSortingConfig({ column, sortType: direction });
      setData(sortedData);
   };

   return (
      <>
         <Table
            columns={columns}
            data={data}
            pagination
            onTableSort={handleTableSort}
            sortingConfig={sortingConfig}></Table>
      </>
   );
}
