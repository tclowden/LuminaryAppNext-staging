'use client';
import React from 'react';
import { xLabels } from './LineChart';

interface Props {
   xLabels: xLabels;
}

const Footer = ({ xLabels }: Props) => {
   return (
      <div className={`pt-4`} style={{ gridArea: 'footer' }}>
         <div className='flex flex-row items-center justify-between'>
            {xLabels.labels?.map((label: string, i: number) => (
               <div key={i} className='text-[11px] text-lum-gray-400'>
                  {label}
               </div>
            ))}
         </div>
      </div>
   );
};

export default Footer;
