'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import WebButton from './button';

import LumLogo from '@/public/assets/website/luminary-logo.svg';

export const websiteNavLinks = [
   { label: 'Home', path: '/' },
   { label: 'Pricing', path: '/pricing' },
   { label: 'Contact', path: '/contact' },
];

const WebNavbar = () => {
   const path = usePathname();
   const [menuActive, setMenuActive] = useState(false);

   return (
      <div className='relative'>
         <header className='fixed top-0 w-screen z-50 px-[30px] bg-[#03121B] shadow'>
            <nav className='h-[60px] grid grid-cols-[auto_auto] md:grid-cols-[1fr_auto_1fr] justify-between place-items-center max-w-[1440px] mx-auto '>
               {/* Shine Logo */}
               <Link
                  className='py-3 justify-self-start'
                  href='/'
                  aria-label='Luminary Logo'
                  onClick={() => setMenuActive((prev) => !prev)}>
                  <LumLogo className='h-6 md:h-[26px] w-auto' width={174} height={26} />
               </Link>

               {/* Desktop Links */}
               <div className='w-min h-10 hidden md:flex md:gap-3 lg:gap-5 m-auto'>
                  {websiteNavLinks.map((link, i) => (
                     <Link
                        key={i}
                        className={`w-max text-[#85A4BB] text-sm font-medium leading-none px-5 rounded-md grid place-items-center ${
                           link.path === path ? 'text-lum-white bg-[#05202F]' : 'hover:text-lum-white'
                        }`}
                        href={link.path}>
                        {link.label}
                     </Link>
                  ))}
               </div>

               {/* action */}
               <div className='hidden md:flex w-max justify-self-end'>
                  <WebButton
                     className='min-h-[40px] text-sm bg-gradient-to-r from-[#28D2FF] to-[#1CB3FF]'
                     openWebModal={'contact-luminary-apps'}>
                     Request A Demo
                  </WebButton>
               </div>

               {/* Hanburger to X icon */}
               <div className='py-5 pr-5 md:hidden rotate-180' onClick={() => setMenuActive((prev) => !prev)}>
                  <div className={`flex flex-col justify-between my-0 mx-auto h-[19px] transition duration-300 `}>
                     <div
                        className={`${
                           menuActive ? 'origin-top-left rotate-45' : 'origin-top-left -rotate-0'
                        } w-6 h-[3px] bg-lum-white rounded-sm transition duration-300`}></div>
                     <div
                        className={`${
                           menuActive ? 'opacity-0' : 'opacity-100'
                        } w-6 h-[3px] bg-lum-white rounded-sm transition `}></div>
                     <div
                        className={`${
                           menuActive ? 'origin-bottom-left -rotate-45' : 'origin-bottom-left rotate-0'
                        } w-6 h-[3px] bg-lum-white rounded-sm transition duration-300`}></div>
                  </div>
               </div>
            </nav>
         </header>

         <div className='w-full h-[60px] bg-[#03121B]'></div>

         <div
            className={`fixed md:hidden top-14 z-40 w-screen p-8 py-5 bg-[#03121B] drop-shadow-lg transition  duration-300 ${
               menuActive ? 'opacity-100 visible' : 'hidden'
            }`}>
            <div className='w-full flex flex-col'>
               {websiteNavLinks.map((link, i) => (
                  <Link
                     key={i}
                     className={`w-full py-3 text-slate-600 text-md font-medium uppercase tracking-wide hover:text-orange leading-none text-center ${
                        link.path === path && 'text-[#85A4BB]'
                     }`}
                     href={link.path}
                     onClick={() => setMenuActive(false)}>
                     {link.label}
                  </Link>
               ))}
            </div>
         </div>
      </div>
   );
};

export default WebNavbar;
