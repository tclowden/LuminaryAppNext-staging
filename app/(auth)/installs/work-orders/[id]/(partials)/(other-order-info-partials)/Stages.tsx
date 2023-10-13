'use client';
import Table from '@/common/components/table/Table';
import { useAppSelector } from '@/store/hooks';
import { selectPageContext } from '@/store/slices/pageContext';
import { formatPostgresTimestamp, getDayCount } from '@/utilities/helpers';
import React, { useEffect, useState } from 'react';

interface Props {}

const Stages = ({}: Props) => {
   const { order } = useAppSelector(selectPageContext);
   const [stagesOnOrder, setStagesOnOrder] = useState<Array<any>>([]);

   useEffect(() => {
      setStagesOnOrder((prevState: Array<any>) => {
         const tempStagesOnOrder = order?.stagesOnOrder;
         return tempStagesOnOrder?.map((stageOnOrder: any, i: number) => {
            const dateToSubtract = tempStagesOnOrder[i + 1]
               ? tempStagesOnOrder[i + 1]?.createdAt
               : stageOnOrder?.completedAt
               ? stageOnOrder?.completedAt
               : new Date();

            const daysInStage =
               getDayCount(dateToSubtract, stageOnOrder?.createdAt)?.toString() !== '0'
                  ? getDayCount(dateToSubtract, stageOnOrder?.createdAt)?.toString()
                  : '< 1';

            return {
               ...stageOnOrder,
               daysInStage: daysInStage,
            };
         });
      });
   }, [order?.stagesOnOrder]);

   return (
      <>
         <Table
            data={stagesOnOrder}
            theme='secondary'
            columns={[
               {
                  keyPath: ['createdAt'],
                  title: 'Date',
                  colSpan: 1.5,
                  ellipsis: true,
                  render: ({ item }: any) => <>{formatPostgresTimestamp(item?.createdAt)}</>,
               },
               {
                  keyPath: ['stageOnProduct', 'productStage', 'name'],
                  title: 'Stage Name',
                  colSpan: 2,
                  ellipsis: true,
                  render: ({ item }) => <>{item?.stageOnProduct?.productStage?.name}</>,
               },
               {
                  keyPath: ['daysInStage'],
                  title: 'Days In Stage',
                  colSpan: 1,
                  ellipsis: true,
               },
               {
                  keyPath: ['completedAt'],
                  title: 'Completed',
                  colSpan: 1,
                  ellipsis: true,
                  render: ({ item }) => <>{item?.completedAt ? 'Yes' : 'No'}</>,
               },
               {
                  keyPath: ['assignedTo', 'fullName'],
                  title: 'Assigned To',
                  colSpan: 1,
                  ellipsis: true,
               },
            ]}
         />
      </>
   );
};

export default Stages;
