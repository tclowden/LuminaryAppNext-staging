'use client';
import Grid from '@/common/components/grid/Grid';
import { useAppSelector } from '@/store/hooks';
import { selectPageContext } from '@/store/slices/pageContext';
import { getDayCount } from '@/utilities/helpers';
import React from 'react';

interface Props {}

const KeyIndicators = ({}: Props) => {
   const { order } = useAppSelector(selectPageContext);

   return (
      <Grid>
         <div>Key Indicators</div>
         <Grid columnCount={4}>
            <Grid rowGap={0}>
               <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>
                  Days Since Initial Funding
               </div>
               <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>
                  {order?.firstFundedAt ? getDayCount(new Date(), order.firstFundedAt) : 'N/A'}
               </div>
            </Grid>
            <Grid rowGap={0}>
               <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>
                  Days Since Last Phone Call
               </div>
               <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>
                  {/* {getDayCount(new Date(), pageContext.)} */}
                  N/A
               </div>
            </Grid>
         </Grid>
      </Grid>
   );
};

export default KeyIndicators;
