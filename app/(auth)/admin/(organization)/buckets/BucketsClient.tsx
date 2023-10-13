'use client';
import { useRouter } from 'next/navigation';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import Button from '../../../../../common/components/button/Button';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';
import TableCellLink from '../../../../../common/components/table-cell-link/TableCellLink';
import { useAppSelector } from '../../../../../store/hooks';
import { selectUser } from '../../../../../store/slices/user';
import ToggleSwitch from '../../../../../common/components/toggle-switch/ToggleSwitch';
import { useEffect, useState } from 'react';
import { Bucket } from './(partials)/types';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';

type Props = {
   buckets: Bucket[];
};

const BucketsClient = ({ buckets }: Props) => {
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const authToken = user.token;
   const [allBuckets, setAllBuckets] = useState<Bucket[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
      const updatedBuckets = buckets.map((b: Bucket) => {
         return {
            ...b,
            usersAssigned: b.bucketUsers.length,
            actionsConfig: {
               edit: { disabled: false },
               delete: { disabled: false },
            },
         };
      });

      setAllBuckets(updatedBuckets);
   }, []);

   const columns: ColumnType[] = [
      {
         keyPath: ['name'],
         title: 'Bucket Name',
         colSpan: 3,
         render: ({ item }: { item: Bucket }) => (
            <TableCellLink path={`/admin/buckets/${item.id}`}>{item.name}</TableCellLink>
         ),
      },
      { keyPath: ['usersAssigned'], title: 'Users', colSpan: 1 },
      { keyPath: ['leadCount'], title: ' Leads In Bucket', colSpan: 1 },
      {
         keyPath: ['isActive'],
         title: 'Active?',
         colSpan: 1,
         render: ({ item }: { item: Bucket }) => {
            const bucket: any = allBuckets.find((b: any) => b.id === item.id);
            return <ToggleSwitch checked={bucket.isActive} onChange={(e) => handleIsActiveToggleSwitch(item)} />;
         },
      },
   ];

   const handleIsActiveToggleSwitch = async (bucket: Bucket) => {
      try {
         if (!bucket.id) return;
         setIsLoading(true);
         let isActive = bucket.isActive;

         let request = await fetch(`/api/v2/buckets/${bucket.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
            body: JSON.stringify({
               id: bucket.id,
               isActive: !isActive,
            }),
         });

         if (request.ok) {
            let response = await request.json();
            const updatedActiveBuckets = allBuckets.map((b: Bucket) => {
               if (b.id === bucket.id) {
                  return {
                     ...b,
                     isActive: !isActive,
                  };
               } else {
                  return {
                     ...b,
                  };
               }
            });

            setAllBuckets(updatedActiveBuckets);
            setIsLoading(false);
         }
      } catch (err: any) {
         console.log(err);
      }
   };

   const handleActionClick = async ({ event, actionKey, item }: { event: Event; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            router.push(`/admin/buckets/${item.id}`);
            break;
         case 'delete':
            setIsLoading(true);
            let request = await fetch(`/api/v2/buckets/${item.id}`, {
               method: 'DELETE',
               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
            });

            let response = await request.json();

            if (response.status === 200) {
               const filteredBuckets = allBuckets.filter((bucket: Bucket) => bucket.id !== item.id);
               setAllBuckets(filteredBuckets);
               setIsLoading(false);
            }

            break;
         default:
            setIsLoading(false);
            break;
      }
   };

   return (
      <PageContainer
         breadcrumbsChildren={
            <Button
               color='blue:500'
               iconName='Plus'
               size='md'
               shadow
               onClick={() => {
                  router.push('/admin/buckets/new');
               }}>
               New Bucket
            </Button>
         }>
         <Table
            actions={[
               { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Bucket', callback: handleActionClick },
               { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Bucket', callback: handleActionClick },
            ]}
            data={allBuckets || []}
            columns={columns}></Table>
         <LoadingBackdrop isOpen={isLoading} zIndex={101} />
      </PageContainer>
   );
};

export default BucketsClient;
