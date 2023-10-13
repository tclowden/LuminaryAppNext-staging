'use client';
import Button from '@/common/components/button/Button';
import PageContainer from '@/common/components/page-container/PageContainer';
import Table from '@/common/components/table/Table';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Input from '@/common/components/input/Input';
import { ColumnType } from '@/common/components/table/tableTypes';
import TableCellLink from '@/common/components/table-cell-link/TableCellLink';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { setAddToast } from '@/store/slices/toast';

const columns: ColumnType[] = [
   {
      keyPath: ['name'],
      title: 'Segment Name',
      colSpan: 1,
      render: ({ item }) => {
         return <TableCellLink path={`/marketing/segments/${item?.id}`}>{item?.name}</TableCellLink>;
      },
   },
   { keyPath: ['leadCount'], title: 'Leads in Segment', colSpan: 1 },
];

type Props = {
   segments: any;
};
export default function SegmentsClient({ segments }: Props) {
   console.log('segments:', segments);
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const [searchValue, setSearchValue] = useState<string>('');
   const [filteredSegments, setFilteredSegments] = useState<any>([]);
   const dispatch = useAppDispatch();
   useEffect(() => {
      const updatedSegments = segments.map((s: any) => {
         return {
            ...s,
            actionsConfig: {
               edit: { disabled: false },
               delete: { disabled: false },
            },
         };
      });
      setFilteredSegments(updatedSegments);
   }, []);
   const handleSearch = (value: string) => {
      setSearchValue(value);
   };

   const handleActionClick = async ({ event, actionKey, item }: { event: Event; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            router.push(`/marketing/segments/${item.id}`);
            break;
         case 'delete':
            console.log('delete item:', item.id);
            let request = await fetch(`/api/v2/segments/${item.id}`, {
               method: 'DELETE',
               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            });

            let response = await request.json();

            if (response.status === 200) {
               const updatedSegments = filteredSegments.filter((s: any) => s.id !== item.id);
               setFilteredSegments(updatedSegments);

               dispatch(
                  setAddToast({
                     iconName: 'CheckMarkCircle',
                     details: [
                        {
                           label: 'Success',
                           text: 'Segment Deleted!',
                        },
                     ],
                     variant: 'success',
                     autoCloseDelay: 1,
                  })
               );
            }

            break;
         default:
            break;
      }
   };

   return (
      <PageContainer
         breadcrumbsChildren={
            <>
               <Button
                  color='blue'
                  onClick={() => {
                     router.push('/marketing/segments/new');
                  }}>
                  {'+ New Segment'}
               </Button>
               <Input
                  iconName='MagnifyingGlass'
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  border
                  placeholder='Search Segments'
                  shadow
                  onClearInput={() => handleSearch('')}
               />
            </>
         }>
         <Table
            data={filteredSegments}
            columns={columns}
            actions={[
               { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Segment', callback: handleActionClick },
               { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Segment', callback: handleActionClick },
            ]}></Table>
      </PageContainer>
   );
}
