'use client';
import Button from '@/common/components/button/Button';
import Grid from '@/common/components/grid/Grid';
import React from 'react';

interface Props {}

const Coordinators = ({}: Props) => {
   return (
      <Grid>
         <div>Coordinators</div>
         <Grid columnCount={4}>
            <Grid rowGap={0}>
               <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>
                  Sales Operation Coordinator
               </div>
               {/* <Link className='text-lum-blue-500 text-[16px]' href={''}>
            N/A
         </Link> */}
            </Grid>
            <Grid rowGap={0}>
               <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>
                  Net Metering Coordinator
               </div>
               {/* <Link className='text-lum-blue-500 text-[16px]' href={''}>
            N/A
         </Link> */}
            </Grid>
            <Grid rowGap={0}>
               <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>
                  Operations Support Coordinator
               </div>
               {/* <Link className='text-lum-blue-500 text-[16px]' href={''}>
            N/A
         </Link> */}
            </Grid>
            <div className='flex flex-row gap-x-2'>
               <Button iconName='PaperEdit' color={'light:dark'} disabled />
               <Button iconName='Bell' color={'light:dark'} disabled />
            </div>
         </Grid>
         {/*  */}
         <Grid columnCount={4}>
            <Grid rowGap={0}>
               <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Account Manager</div>
               {/* <Link className='text-lum-blue-500 text-[16px]' href={''}>
            N/A
         </Link> */}
            </Grid>
            <Grid rowGap={0}>
               <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Design Coordinator</div>
               {/* <Link className='text-lum-blue-500 text-[16px]' href={''}>
            N/A
         </Link> */}
            </Grid>
            <Grid rowGap={0}>
               <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Permit Coordinator</div>
               {/* <Link className='text-lum-blue-500 text-[16px]' href={''}>
            N/A
         </Link> */}
            </Grid>
         </Grid>
      </Grid>
   );
};

export default Coordinators;
