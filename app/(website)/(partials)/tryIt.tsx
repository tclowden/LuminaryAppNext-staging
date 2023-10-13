'use client'
import React from 'react'
import Image from 'next/image'
import WebSection from './section'
import WebButton from './button'
import ImageLuminaryBear from '@/public/assets/website/luminary-bear.png'
import { usePathname } from 'next/navigation'


const WebTryIt = () => {
   const path = usePathname()

   return (
      <WebSection variant='light' className='py-20'>
         <div className='text-center text-[#052130] text-[23px] md:text-[40px] font-bold leading-[30px] md:leading-[50px]'>We can't wait for you to try it!</div>
         {path === '/' &&
            <div className='text-center mt-1 text-[#4F748A] text-[15px] md:text-lg font-normal leading-snug md:leading-normal'>We know this is a lot to take in.<br className='md:hidden' /> But we just scratched the surface.</div>
         }
         <div className='my-7 bg-lum-white h-min p-4 aspect-square rounded-full grid place-items-center shadow-[0_10px_40px_0px_rgba(0,50,72,0.10)]'>
            <Image src={ImageLuminaryBear} alt='Luminary Bear' width={265} className='w-[200px] md:w-[265px] h-auto' />
         </div>
         {path === '/' &&
            <div className="text-center text-[#4F748A] text-lg font-normal">How about we explain the rest in a demo, then you can see Luminary in action!</div>
         }
         <WebButton className='mt-7 bg-gradient-to-r from-[#28D2FF] to-[#1CB3FF]' openWebModal={'contact-luminary-apps'}>Request a Demo</WebButton>
      </WebSection >
   )
}

export default WebTryIt
