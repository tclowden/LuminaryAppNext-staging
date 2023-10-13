import type { Metadata } from 'next'
export const metadata: Metadata = {
   title: 'Contact',
};

import React from 'react'
import WebSection from '../(partials)/section'
import WebButton from '../(partials)/button';
import Image from 'next/image';

import ImageDashboard from '@/public/assets/website/dashboard-screenshot.jpeg';


const page = () => {
   return (
      <WebSection variant='dark' className='pb-0 md:py-24 md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr] md:gap-5' priority={false}>
         <div className='col-span-2 md:pl-10'>
            <div className="mb-4 max-w-[412px] text-lum-white text-2xl md:text-3xl font-bold leading-[30px] md:leading-10">Contact LuminaryApps</div>
            <div className="text-[#85A4BB] text-[15px] md:text-lg font-normal leading-snug md:leading-normal">We would love to chat! Please click below, fill out a short form and we will be in touch soon!</div>
            <WebButton className='mt-5 mb-8 max-w-[230px] bg-gradient-to-r from-[#DB2492] to-[#B825C8]' openWebModal={'contact-luminary-apps'}>Contact LuminaryApps</WebButton>
         </div>
         <Image src={ImageDashboard} alt='Incoming Calls' className='rounded-t-md md:rounded-lg shadow-[0_9px_50px_0px_rgba(3,16,24,0.50)] col-span-3 justify-self-end' />
      </WebSection>
   )
}

export default page