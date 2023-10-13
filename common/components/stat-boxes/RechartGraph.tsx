import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Text } from 'recharts';
import { theme } from '@/tailwind.config';
import format from 'date-fns/format';

interface Props {
   data: any[];
   goal: any;
}
const formatNumber = (num: number) => {
   if (Math.abs(num) >= 1.0e9) {
      return (Math.abs(num) / 1.0e9).toFixed(1) + 'B';
   }

   if (Math.abs(num) >= 1.0e6) {
      return (Math.abs(num) / 1.0e6).toFixed(1) + 'M';
   }

   if (Math.abs(num) >= 1.0e3) {
      return (Math.abs(num) / 1.0e3).toFixed(0) + 'K';
   }

   return Math.abs(num).toString();
};
const RechartGraph: React.FC<Props> = ({ data, goal }: Props) => {
   const formattedData = data.map((item) => {
      return {
         date: format(new Date(item.week), 'MMM dd'),
         revenueA: item.totalSum,
         goal: goal,
      };
   });
   // All colors from the tw config
   const colors: any = theme?.colors;

   return (
      <div className='bg-lum-white  dark:bg-lum-gray-750'>
         <ResponsiveContainer minHeight={270} maxHeight={270} minWidth={777}>
            <LineChart
               layout='horizontal'
               data={formattedData}
               compact={false}
               margin={{
                  top: 0,
                  right: 60,
                  bottom: 0,
                  left: 0,
               }}>
               <XAxis
                  axisLine={false}
                  color='lum-gray-500'
                  dataKey='date'
                  tick={({ x, y, payload }) => (
                     <Text x={x} y={y} fill='white'>
                        {payload.value}
                     </Text>
                  )}
               />
               <YAxis
                  axisLine={false}
                  scale={'time'}
                  tickMargin={45}
                  tick={({ x, y, payload }) => (
                     <Text x={x} y={y} fill='white'>
                        {formatNumber(payload.value)}
                     </Text>
                  )}
               />
               <Tooltip />
               {/* add recharts attributes on the legend */}
               <Legend verticalAlign='top' align='right' />
               <Line
                  type='monotone'
                  dataKey='revenueA'
                  name='Actual'
                  stroke={`${colors?.[`lum-cyan`][`500`]}`}
                  strokeWidth={8}
                  dot={false}
               />
               <Line
                  type='monotone'
                  dataKey='goal'
                  name='Goal'
                  stroke={`${colors?.[`lum-black`]}`}
                  strokeWidth={8}
                  dot={false}
               />
            </LineChart>
         </ResponsiveContainer>
      </div>
   );
};

export default RechartGraph;
