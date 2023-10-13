'use client';
import React from 'react';
import solarHouseBlue from '../../../../../public/assets/proposal/images/solar-house-blue.jpg';
import Image from 'next/image';
import ssOrangWhiteLogo from '../../../../../public/assets/proposal/logos/ss-orang-white-logo.png';
import shineHomeLogo1Green from '../../../../../public/assets/proposal/logos/shine-home-logo-1-green.png';
import shineAirLogo from '../../../../../public/assets/proposal/logos/shine-air-logo.png';
import ProductionGraph from './ProductionGraph';

interface Props {
   production: any;
}

const Production = ({ production }: Props) => {
   return (
      <div
         className='flex
    flex-col
    font-[100]
    text-lum-white
    text-[20px]
    w-full

    max-h-[1030px]
    min-h-[1030px]
    bg-no-repeat
    bg-center
    bg-cover
    relative
    bg-white
    border-b-4
'
         style={{ backgroundImage: `url('${solarHouseBlue.src}')`, pageBreakAfter: 'always' }}>
         <div
            className='w-[768px]
       min-h-[500px]

       

       flex
       flex-col
       self-center
       mt-[100px]
       pb-[30px]
       pl-[20px]
       pr-[30px]
       rounded-md
       '
            style={{ backgroundColor: '#FFF' }}>
            <div
               className='flex self-center text-[38px] mt-[40px] mb-[30px]'
               style={{ fontFamily: 'fjalla one', color: '#FF6900' }}>
               PRODUCTION VS CONSUMPTION
            </div>
            <ProductionGraph production={production} />
         </div>
      </div>
   );
};

export default Production;
