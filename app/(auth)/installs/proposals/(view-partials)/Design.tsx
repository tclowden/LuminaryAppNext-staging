'use client';
import React from 'react';
import noImageDefault from '../../../../../public/assets/proposal/images/no-image-default.jpg';
import Image from 'next/image';
import OffsetGraph from './OffsetGraph';

interface Props {
   designInfo: any;
   previewURL: any;
   totals: any;
}

const Design = ({ designInfo, previewURL, totals }: Props) => {
   const offset = totals.offsetHuman;

   return (
      <div
         className='flex flex-col font-[100] text-[20px] w-full max-h-[1056px]
         min-h-[1056px] relative '
         style={{ backgroundColor: '#F5F6F7' }}>
         <div className='flex w-full mt-[40px] justify-center align-center flex-col'>
            <img
               className='flex self-center'
               src={'/assets/proposal/logos/ss-orang-black-logo.png'}
               alt='Shine Solar Logo'
               width='310'
            />
            <div className='flex self-center'>YOUR SOLAR DESIGN</div>
         </div>

         <div className='flex mt-[40px] justify-center'>
            <Image
               className='min-w[700px] object-cover self-center'
               src={previewURL == null || previewURL == '' ? noImageDefault : previewURL}
               alt='show roof simulation'
               width='700'
               height='400'
            />
         </div>

         <div
            className='max-w-3xl h-[295px] w-[960px] rounded-md drop-shadow relative flex place-content-around border-slate-200 bg-slate-500 self-center mt-[30px]'
            style={{ backgroundColor: '#FFF' }}>
            <div className='flex flex-col justify-center w-full'>
               <div className='self-center text-[16px]' style={{ fontFamily: 'fjalla one', color: '#FF6900' }}>
                  SYSTEM SIZE
               </div>
               <div className='self-center'>
                  <span className='text-[30px]'>{`${designInfo.displaySystemSize}`}</span>
                  <span className='text-[20px] text-[#7d8d9a] ml-[10px]'>kW</span>
               </div>

               <div
                  className='self-center text-[16px] mt-[15px]'
                  style={{ fontFamily: 'fjalla one', color: '#FF6900' }}>
                  NUMBER OF PANELS
               </div>
               <div className='self-center'>
                  <span className='text-[30px]'>{`${designInfo.numberOfPanels}`}</span>
                  <span className='text-[20px] text-[#7d8d9a] ml-[10px]'>Panels</span>
               </div>

               <div
                  className='self-center text-[16px] mt-[15px]'
                  style={{ fontFamily: 'fjalla one', color: '#FF6900' }}>
                  ESTIMATED YEARLY PRODUCTION
               </div>
               <div className='self-center'>
                  <span className='text-[30px]'>9873</span>
                  <span className='text-[20px] text-[#7d8d9a] ml-[10px]'>kWh</span>
               </div>
            </div>

            <div className=''></div>

            <div className='flex flex-col justify-center w-full'>
               <div className='self-center text-[16px]' style={{ fontFamily: 'fjalla one', color: '#FF6900' }}>
                  BATTERY
               </div>
               <div className='self-center text-[30px]'>{designInfo.hasBattery ? 'Yes' : 'No'}</div>

               <div
                  className='self-center text-[16px] mt-[15px]'
                  style={{ fontFamily: 'fjalla one', color: '#FF6900' }}>
                  HVAC
               </div>
               <div className='self-center text-[30px]'>{designInfo.hasHvac ? 'Yes' : 'No'}</div>
            </div>

            <div className=''></div>

            <div className='flex flex-col h-[295px] pt-[30px] w-full relative'>
               <div className=' text-[16px] text-center' style={{ fontFamily: 'fjalla one', color: '#FF6900' }}>
                  TOTAL OFFSET
               </div>
               <div className='flex relative self-center align-self w-[200px] h-[200px]'>
                  <OffsetGraph offset={designInfo.offsetHuman} />
                  <div className='absolute left-[75px] self-center w-fit right-0 mt-[0px] mb-[0px]  text-[42px] lum-grey-700'>
                     <span>{designInfo.offsetHuman}</span>
                     <span className='lum-grey-500 text-[36px] text-[#7d8d9a]'>%</span>
                  </div>
               </div>

               {/* <svg
                  className='self-center text-[16px] -rotate-90'
                  viewBox='0 0 33.83098862 33.83098862'
                  width='200'
                  height='200'
                  xmlns='http://www.w3.org/2000/svg'>
                  <circle
                     className='circle-chart__background'
                     stroke='#dce0e2'
                     stroke-width='2'
                     fill='none'
                     cx='16.91549431'
                     cy='16.91549431'
                     r='12.91549431'></circle>
                  <circle
                     className='circle-chart__circle'
                     stroke='#FF6900'
                     stroke-width='3'
                     stroke-dasharray={strokeLength}
                     stroke-linecap='square'
                     fill='none'
                     cx='16.91549431'
                     cy='16.91549431'
                     r='12.91549431'></circle>
               </svg> */}
            </div>
         </div>
      </div>
   );
};

export default Design;
