'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { websiteNavLinks } from './navbar';
import WebButton from './button';
import WebSection from './section';

import LumLogo from '@/public/assets/website/luminary-logo.svg';

const WebFooter = () => {
   const path = usePathname();

   return (
      <WebSection className='!py-12'>
         {/* Shine Logo */}
         <Link className='pt-3 md:pt-0 w-max' href='/'>
            <LumLogo className='h-6 md:h-8 w-auto' width={220} height={32} />
         </Link>

         {/* Desktop HR */}
         <div className='hidden md:inline w-full h-[1px] my-7 md:mt-12 bg-[#0C465C]' />

         <div className='md:w-full md:grid md:grid-cols-[1fr_auto] md:items-center'>
            {/* Desktop Links */}
            <div className='w-min h-10 hidden md:grid grid-cols-[auto_auto_auto] md:gap-3 lg:gap-5 md:pl-5'>
               {websiteNavLinks.map((link, i) => (
                  <Link
                     key={i}
                     className={`w-max text-[#85A4BB] text-sm font-medium leading-none px-5 rounded-md grid place-items-center ${
                        link.path === path ? 'text-lum-white bg-[#12394E]' : 'hover:text-lum-white'
                     }`}
                     href={link.path}
                     aria-label='Luminary Logo'>
                     {link.label}
                  </Link>
               ))}
            </div>

            {/* Desktop Action Buttons */}
            <div className='hidden md:flex gap-5'>
               {/* <WebButton onClick={serlialScrollToTop} className='bg-[#12394E]'>
                  <div className="text-center text-white text-sm font-medium leading-relaxed">Login</div>
               </WebButton> */}

               <WebButton
                  className='bg-gradient-to-r from-[#28D2FF] to-[#1CB3FF]'
                  openWebModal={'contact-luminary-apps'}>
                  <div className='w-max text-center text-white text-sm font-semibold leading-relaxed'>
                     Request a Demo
                  </div>
               </WebButton>
            </div>
         </div>

         {/* HR */}
         <div className='w-full h-[1px] my-7 md:mb-10 bg-[#0C465C]' />

         {/* Copyright */}
         <div className='text-center text-[#85A4BB] text-base font-medium'>© Copyright 2023 LuminaryApps</div>
      </WebSection>
   );
};

export default WebFooter;
