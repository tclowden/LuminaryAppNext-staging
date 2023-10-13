import React, { useEffect, useState } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { UserData } from '../../types';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { LuminaryColors } from '@/common/types/LuminaryColors';

interface Props {
   userData: UserData | undefined;
}

const chartColors: LuminaryColors[] = ['blue', 'green', 'yellow', 'red', 'purple', 'pink', 'gray'];

const NewScoreCard = ({ userData }: Props) => {
   const [apiResponse, setApiResponse] = useState<any[]>([]);
   const [totalSixWeekRev, setTotalSixWeekRev] = useState<number>(0);

   const user = useAppSelector(selectUser);

   useEffect(() => {
      async function getData() {
         // TODO: Pass in a date parameter
         const response = await fetch(`/api/v2/analytics/users/${userData?.id}/scorecard`, {
            method: 'POST',
            headers: {
               'Content-type': 'application/json',
               Authorization: `Bearer ${user?.token}`,
            },
            body: JSON.stringify({
               repId: userData?.id,
            }),
         });
         const data = await response.json();
         console.log('api response', data);
         // Group by week and sum totalAmount
         const groupedData: { [key: string]: { actual: number; goal: number } } = {};

         for (const item of data) {
            const date = new Date(item.week);
            const week = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            const totalAmount = item.totalAmount || 0;

            if (groupedData[week]) {
               groupedData[week].actual += totalAmount;
            } else {
               groupedData[week] = { actual: totalAmount, goal: 42500 /* Replace with real goal value */ };
            }
         }

         const chartData = Object.keys(groupedData).map((week) => ({
            name: week,
            ...groupedData[week],
         }));

         const totalSixWeekRev = Object.values(groupedData).reduce((acc, { actual }) => acc + actual, 0);

         setTotalSixWeekRev(totalSixWeekRev);
         setApiResponse(chartData);
      }

      getData();
   }, [userData, user]);

   return (
      <>
         {totalSixWeekRev > 0 && (
            <BarChart width={900} height={500} data={apiResponse}>
               <CartesianGrid stroke='#ccc' />
               <XAxis dataKey='name' />
               <YAxis />
               <Tooltip />
               <Bar dataKey='actual' fill='#8884d8' />
               <Bar dataKey='goal' fill='#82ca9d' />
            </BarChart>
         )}
      </>
   );
};

export default NewScoreCard;
