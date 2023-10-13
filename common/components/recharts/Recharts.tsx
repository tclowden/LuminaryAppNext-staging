'use client';
import React, { useState } from 'react';
import { backgroundColorObject } from '@/utilities/colors/colorObjects';
import { IconColors } from '../Icon';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface Props {
   data: Record<string, any>[];
}

const Recharts = ({ data }: Props) => {
   // const [dataVals, setDataVals] = useState<any>([...data.names]);
   console.log('data Props: ', data);

   return (
      <>
         <ResponsiveContainer width='100%' aspect={2}>
            <BarChart width={500} height={500} data={data}>
               <CartesianGrid strokeDasharray='3 3' />
               <XAxis dataKey='name' />
               <YAxis />
               <Tooltip />
               <Bar dataKey='totalLeads' fill='#8884d8' />
            </BarChart>
         </ResponsiveContainer>
      </>
   );
};

export default Recharts;
