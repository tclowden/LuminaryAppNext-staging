'use client';
import React from 'react';

interface Props {}

const Example = ({}: Props) => {
   return (
      <div
         className='flex
    flex-col
    font-[100]
    text-[20px]
    w-full
    max-h-[1015px]
    min-h-[1015px]
    bg-no-repeat
    bg-center
    bg-cover
    relative
    '
         style={{ backgroundColor: '#F5F6F7', pageBreakAfter: 'always' }}>
         <div className='flex w-full mt-[40px] justify-center align-center flex-col'>
            <img
               className='flex self-center w-[310px]'
               src={'/assets/proposal/logos/ss-orang-black-logo.png'}
               alt='Shine Solar Logo'
               height='45'
            />
            <div className='flex self-center text-grey-100' style={{ fontFamily: 'fjalla one' }}>
               Solar Panel Design
            </div>
            <p
               className='self-center
                  text-center
                  text-[#425563]
                  w-[768px]
                  mt-[10px]'>
               We only install Solar Panels that are solid black with slim roof mounts to blend in with your roof as
               much as possible. Often our customers feel the panels add to the beauty of their home instead of detract
               from it.
            </p>

            <div
               className='flex w-[768px]
       min-h-[500px]
       self-center
       mt-[35px]
       pt-[15px]
       pb-[15px]
       flex-col'
               style={{ backgroundColor: '#fff' }}>
               <div className='flex h-[240px] flex-row  justify-center'>
                  <img
                     src={'/assets/proposal/images/solar-example-1.jpg'}
                     className='
             bg[#656565]
             rounded
             ml-[10px]
             mr-[10px]
             mt-[10px]
             mb-[10px]
             bg-center
             bg-auto
             bg-no-repeat'
                     alt='Solar image example'
                     width='350'
                     // height='240'
                  />
                  <img
                     src={'/assets/proposal/images/solar-example-2.jpg'}
                     className='
             bg[#656565]
             rounded
             ml-[10px]
             mr-[10px]
             mt-[10px]
             mb-[10px]
             bg-center
             bg-auto
             bg-no-repeat'
                     alt='Solar image example'
                     width='350'
                     // height='240'
                  />
               </div>

               <div className='flex h-[240px] flex-row  justify-center'>
                  <img
                     src={'/assets/proposal/images/solar-example-3.jpg'}
                     className='
             bg[#656565]
             rounded
             ml-[10px]
             mr-[10px]
             mt-[10px]
             mb-[10px]
             bg-center
             bg-auto
             bg-no-repeat'
                     alt='Solar image example'
                     width='350'
                     // height='240'
                  />
                  <img
                     src={'/assets/proposal/images/solar-example-4.jpg'}
                     className='
             bg[#656565]
             rounded
             ml-[10px]
             mr-[10px]
             mt-[10px]
             mb-[10px]
             bg-center
             bg-auto
             bg-no-repeat'
                     alt='Solar image example'
                     width='350'
                     // height='240'
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Example;
