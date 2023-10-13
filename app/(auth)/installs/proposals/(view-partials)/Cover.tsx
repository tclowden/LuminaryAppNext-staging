'use client';
import React from 'react';
import Image from 'next/image';
import solarHouseBlue from '../../../../../public/assets/proposal/images/solar-house-blue.jpg';
import ssOrangWhiteLogo from '../../../../../public/assets/proposal/logos/ss-orang-white-logo.png';
import shineHomeLogo1Green from '../../../../../public/assets/proposal/logos/shine-home-logo-1-green.png';
import shineAirLogo from '../../../../../public/assets/proposal/logos/shine-air-logo.png';

interface Props {
   coverInfo: any;
}

const Cover = ({ coverInfo }: Props) => {
   return (
      <div
         className='flex
   flex-col
   font-[100]
   text-lum-white
   text-[20px]
   w-full
   max-h-[1046px]
   min-h-[1046px]
   bg-no-repeat
   bg-center
   bg-cover
   relative
   bg-white'
         style={{
            backgroundImage: `url('${solarHouseBlue.src}')`,
            backgroundColor: '#1C252E',
         }}>
         <div className='flex flex-row w-full  items-center mt-[30px]'>
            <img
               style={{ verticalAlign: 'middle', width: '200px' }}
               className='m-[30px]'
               width='200'
               height='30'
               src='/assets/proposal/logos/ss-orang-white-logo.png'
               alt='Shine Solar Logo'
            />
            <img
               className='w-[200px] m-[30px]'
               width='200'
               height='30'
               src='/assets/proposal/logos/shine-home-logo-1-green.png'
               alt='Shine Home Logo'
            />
            <img
               className='w-[200px] m-[30px]'
               width='200'
               height='30'
               src='/assets/proposal/logos/shine-air-logo.png'
               alt='Shine Air Logo'
            />
         </div>
         <div className='pl-[60px] mt-[360px]'>SOLAR SAVINGS REPORT</div>
         <div className='pl-[60px] font-[600] text-[60px]'>{`${coverInfo.fullName}`}</div>
         <div className='pl-[60px]'>{`${coverInfo.street_address} ${coverInfo.city} ${coverInfo.state} ${coverInfo.zip_code}`}</div>
         <div className='pl-[60px]'>{`${coverInfo.email_address}`}</div>
         <div className='pl-[60px]'>{`${coverInfo.phone_number}`}</div>
      </div>
   );
};

export default Cover;
