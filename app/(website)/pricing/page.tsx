import type { Metadata } from 'next';
export const metadata: Metadata = {
   title: 'Pricing',
};

import React from 'react';
import WebSection from '../(partials)/section';
import WebButton from '../(partials)/button';
import Image from 'next/image';

import ImageDashboard from '@/public/assets/website/dashboard-screenshot.jpeg';


const Page = () => {
   return (
      <WebSection variant='dark' className='pb-0 md:py-24 md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr] md:gap-5' priority={false}>
         <div className='col-span-2 md:pl-10'>
            <div className="mb-4 max-w-[412px] text-lum-white text-2xl md:text-3xl font-bold leading-[30px] md:leading-10">Luminary Pricing</div>
            <div className='text-[#85A4BB] text-[15px] md:text-lg font-normal leading-snug md:leading-normal'>
               Pricing can get complicated. We have found it works best to chat person to person to you make sure all your needs are met and to get you the best deal.
            </div>
            <WebButton className='mt-5 mb-8 bg-gradient-to-r from-[#09D770] to-[#0AD79E]' openWebModal={'contact-luminary-apps'}>Request Pricing</WebButton>

         </div>
         <Image
            src={ImageDashboard}
            alt='Incoming Calls'
            className='rounded-t-md md:rounded-lg shadow-[0_9px_50px_0px_rgba(3,16,24,0.50)] col-span-3 justify-self-end'
         />
      </WebSection>
   );
};

export default Page;
