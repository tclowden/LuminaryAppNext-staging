'use client';
import React from 'react';
import Image from 'next/image';
import Icon from '../../../../../common/components/Icon';
import amyMelton from '../../../../../public/assets/proposal/profiles/amy-melton.jpg';
import darrel from '../../../../../public/assets/proposal/profiles/darrel.jpg';
import kassandra from '../../../../../public/assets/proposal/profiles/kassandra.png';
import wadeSpencer from '../../../../../public/assets/proposal/profiles/wade-spencer.jpg';

interface Props {}

const Reviews = ({}: Props) => {
   return (
      <div
         className='flex
        flex-col
        font-[100px]
        text-[20px]
        w-full
        max-h-[1015px]
        min-h-[1015px]
        bg-no-repeat
        bg-center
        bg-cover
        relative'
         style={{ backgroundColor: '#F5F6F7' }}>
         <div className='text-[100px] self-center h-[120px]' style={{ fontFamily: 'fjalla one' }}>
            1300+
         </div>
         <div className='text-[28px] self-center text-grey-100' style={{ fontFamily: 'fjalla one' }}>
            CUSTOMER REVIEWS
         </div>
         <div
            className='flex
       flex-row
       justify-between
       w-[768px]
       mt-[35px]
       self-center'>
            <div
               className='
              w-[375px]
              h-auto
              rounded
              flex: 50%;
              mb-[32px]
              flex-row
              p-[30px]
             '
               style={{ backgroundColor: '#FFF' }}>
               <div className='flex flex-row'>
                  <Image className='mr-[15px]' src={wadeSpencer} alt='Wade' height='70' width='70' />
                  <div className='flex flex-col'>
                     <div className=''>WADE SPENCER</div>
                     <div className='text-[#303d46] text-[11px]'>Garfield, AR</div>
                     <div className='flex flex-row'>
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                     </div>
                  </div>
               </div>
               <div className='mt-[20px] text-[13px]'>
                  "We had our unit installed a few months ago and it went brilliantly smooth. Our first solar bill was
                  $19! As for Shine Solar, I really can't say enough..."
               </div>
            </div>

            <div
               className='
              w-[375px]
              h-auto
              rounded
              flex: 50%;
              mb-[32px]
              flex-row
              p-[30px]
             '
               style={{ backgroundColor: '#FFF' }}>
               <div className='flex flex-row'>
                  <Image className='mr-[15px]' src={amyMelton} alt='Amy' height='70' width='70' />
                  <div className='flex flex-col'>
                     <div className=''>AMY MELTON</div>
                     <div className='text-[#303d46] text-[11px]'>Bentonville, AR</div>
                     <div className='flex flex-row'>
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                     </div>
                  </div>
               </div>
               <div className='mt-[20px] text-[13px]'>
                  "We officially went solar today with Shine Solar! The installation was a few weeks ago and the power
                  company flipped the switch today. I kept wandering to the..."
               </div>
            </div>
         </div>

         <div
            className='flex
       flex-row
       justify-between
       w-[768px]
       self-center'>
            <div
               className='
              w-[375px]
              h-auto
              rounded
              flex: 50%;
              mb-[32px]
              flex-row
              p-[30px]
             '
               style={{ backgroundColor: '#FFF' }}>
               <div className='flex flex-row'>
                  <Image className='mr-[15px]' src={darrel} alt='Wade' height='70' width='70' />
                  <div className='flex flex-col'>
                     <div className=''>DARREL BUTTRAM</div>
                     <div className='text-[#303d46] text-[11px]'>Hurley, MO</div>
                     <div className='flex flex-row'>
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                     </div>
                  </div>
               </div>
               <div className='mt-[20px] text-[13px]'>
                  "Thank you Shine Solar for the awesome system and support! We received our first electric bill with a
                  full month of solar panels power. The bill was $22.73..."
               </div>
            </div>

            <div
               className='
              w-[375px]
              h-auto
              rounded
              flex: 50%;
              mb-[32px]
              flex-row
              p-[30px]
             '
               style={{ backgroundColor: '#FFF' }}>
               <div className='flex flex-row'>
                  <Image className='mr-[15px]' src={kassandra} alt='Kassandra' height='70' width='70' />
                  <div className='flex flex-col'>
                     <div className=''>KASSANDRA DAVIS</div>
                     <div className='text-[#303d46] text-[11px]'>Diamond, MO</div>
                     <div className='flex flex-row'>
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                        <Icon className='mr-[3px]' name='Star' color='orange' height='15' width='15' />
                     </div>
                  </div>
               </div>
               <div className='mt-[20px] text-[13px]'>"Great company to work with. Very informative and helpful."</div>
            </div>
         </div>
      </div>
   );
};

export default Reviews;
