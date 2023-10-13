'use client';
import React from 'react';
import Image from 'next/image';
import OffsetGraph from './OffsetGraph';

interface Props {
   proposalInfo: any;
}

const Hvac = ({ proposalInfo }: Props) => {
   console.log('proposalInfo we want the best class of hvac', proposalInfo);

   return (
      <div
         className='flex flex-col font-[100] text-[20px] w-full max-h-[1056px]
         min-h-[1040px] relative pt-[50px]'
         style={{ backgroundColor: '#F5F6F7' }}>
         <img
            className='flex self-center'
            width='270'
            height='30'
            src='/assets/proposal/logos/shine-air-logo-dark-color.png'
            alt='Shine Air Logo'
         />

         <div className='flex self-center mt-[50px] text-[28px]' style={{ color: '#425563', fontFamily: 'Fjalla One' }}>
            YOUR HVAC PACKAGE
         </div>

         <div
            className='w-[768px]
            min-h-[500px]
            flex
            flex-col
            self-center
            mt-[20px]
            pb-[30px]
            
            rounded-md
            '
            style={{ backgroundColor: '#FFF' }}>
            <div
               className='flex w-full h-[140px] justify-between'
               style={{ backgroundColor: '#f8c623', borderRadius: '12px 12px 0 0' }}>
               <div
                  className='flex border-white w-[750px] ml-[10px] mt-[10px] h-[120px]'
                  style={{ border: 'white solid 2px' }}>
                  <img
                     className=' h-[65px] w-[65px] ml-[20px] mt-[30px]'
                     src='/assets/proposal/images/hvac-circle-gold.png'
                  />

                  <div className='flex flex-col w-[300px] ml-[10px]'>
                     <span
                        className='text-[44px]'
                        style={{ color: 'white', fontWeight: 500, lineHeight: 0.99, marginTop: '29px' }}>
                        Gold
                     </span>
                     <span
                        className='text-[26px]'
                        style={{ color: 'white', fontWeight: 400, marginTop: 0, lineHeight: 0.99 }}>
                        Package
                     </span>
                  </div>
                  <div className='text-[27px] flex items-center w-[500px]' style={{ color: 'white', fontWeight: 400 }}>
                     Up to
                     <span className='text-[35px] ml-[5px] mr-[5px]' style={{ fontWeight: 500 }}>
                        17%
                     </span>
                     Energy Savings!
                  </div>
               </div>
            </div>

            <div className='flex w-full justify-between items-center' style={{ backgroundColor: '#FFF' }}>
               <div className='flex flex-col items-center w-[359px]'>
                  <span className='mt-[30px]' style={{ color: '#7d8d9a', fontSize: '14px', fontWeight: 500 }}>
                     Equipment
                  </span>
                  <img className='mt-[20px]' width='178' src='/assets/proposal/images/hvac.png' />
                  <ul
                     className='mt-[35px]'
                     style={{ fontWeight: 500, fontSize: '16px', color: '#425563', lineHeight: 2.5 }}>
                     <li className='flex items-center'>
                        <span
                           style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#b1bbc2',
                              borderRadius: '4px',
                              marginRight: '10px',
                           }}></span>
                        2 Stage High-Efficiency Electric or Gas
                     </li>
                     <li className='flex items-center'>
                        <span
                           style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#b1bbc2',
                              borderRadius: '4px',
                              marginRight: '10px',
                           }}></span>
                        Efficient Air Conditioner
                     </li>
                     <li className='flex items-center'>
                        <span
                           style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#b1bbc2',
                              borderRadius: '4px',
                              marginRight: '10px',
                           }}></span>
                        ION Wi-fi Thermostat
                     </li>
                  </ul>
               </div>
               <div
                  style={{
                     height: '421.7px',
                     width: '1px',
                     backgroundColor: '#d3d8dc',
                     marginTop: '26px',
                  }}></div>
               <div className='flex flex-col w-[359px] pt-[20px] text-center'>
                  <span className='mt-[10px] mb-[20px]' style={{ color: '#7d8d9a', fontSize: '14px', fontWeight: 500 }}>
                     Warranties
                  </span>
                  <div className='flex justify-between items-center'>
                     <div className='flex items-center flex-col  w-[180px] h-[200px]'>
                        <img className='w-[121px] h-[121px]' src='/assets/proposal/images/hvac_warranty.png' />
                        <div className='mt-[4px] text-[14px] text-center' style={{ color: '#425563', fontWeight: 500 }}>
                           Limited - 10 Year Parts Warranty
                        </div>
                     </div>

                     <div className='flex items-center flex-col w-[180px]  h-[200px]'>
                        <img className='w-[121px] h-[121px]' src='/assets/proposal/images/hvac_warranty_2.png' />
                        <div className='mt-[4px] text-[14px] text-center' style={{ color: '#425563', fontWeight: 500 }}>
                           12 Year No Hassle
                        </div>
                     </div>
                  </div>
                  <div className='flex justify-between items-center'>
                     <div className='flex items-center flex-col w-[180px]  h-[200px]'>
                        <img className='w-[121px] h-[121px]' src='/assets/proposal/images/hvac_warranty_3.png' />
                        <div className='mt-[4px] text-[14px] text-center' style={{ color: '#425563', fontWeight: 500 }}>
                           10 Year Thermostat Warranty
                        </div>
                     </div>

                     <div className='flex items-center flex-col w-[180px]  h-[200px]'>
                        <img className='w-[121px] h-[121px]' src='/assets/proposal/images/hvac_warranty_4_3.png' />
                        <div className='mt-[4px] text-[14px] text-center' style={{ color: '#425563', fontWeight: 500 }}>
                           Limited - 1 Year Labor Warranty
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Hvac;
