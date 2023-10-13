import type { Metadata } from 'next';
export const metadata: Metadata = {
   title: 'Win',
};

import React from 'react';
import WebSection from '../(partials)/section';
import WebButton from '../(partials)/button';
import Image from 'next/image';

import ImageYetiCooler from '@/public/assets/website/yeti-cooler.png';


const Page = () => {
   return (
      <WebSection variant='dark' className='pb-0 md:py-24 md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr] md:gap-5' priority={false}>
         <div className='col-span-2 md:pl-10'>
            <div className="mb-4 max-w-[412px] text-lum-white text-2xl md:text-3xl font-bold leading-[30px] md:leading-10">
               Win this one-of-a-kind Luminary branded YETI Cooler!
            </div>
            <div className='text-[#85A4BB] text-[15px] md:text-lg font-normal leading-snug md:leading-normal'>
               Learn why Luminary Apps is the preferred software to run America's top solar companies. And be entered to win this YETI Tundra 45 Cooler!
            </div>
            <WebButton className='mt-5 mb-8 bg-gradient-to-r from-[#DB2492] to-[#B825C8]' openWebModal={'contact-luminary-apps'}>Enter Now to Win</WebButton>

         </div>
         <Image
            src={ImageYetiCooler}
            alt='Win Yeti Cooler'
            className='col-span-3 justify-self-end'
         />
      </WebSection>
   );
};

export default Page;
