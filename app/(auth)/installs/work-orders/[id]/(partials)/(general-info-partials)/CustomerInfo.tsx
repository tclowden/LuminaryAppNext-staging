'use client';
import Grid from '@/common/components/grid/Grid';
import { useAppSelector } from '@/store/hooks';
import { selectPageContext } from '@/store/slices/pageContext';
import { getFormattedPhoneNumber } from '@/utilities/helpers';
import Link from 'next/link';
import React from 'react';

interface Props {}

const CustomerInfo = ({}: Props) => {
   const { order } = useAppSelector(selectPageContext);

   return (
      <Grid>
         <div>Customer Info</div>
         <Grid columnCount={4}>
            <Grid rowGap={0}>
               <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Customer</div>
               <Link className='text-lum-blue-500 text-[16px]' href={`/marketing/leads/${order?.lead?.id}`}>
                  {order.lead.firstName} {order.lead.lastName}
               </Link>
            </Grid>
            <Grid rowGap={0}>
               <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Address</div>
               <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>
                  {order.lead?.fullAddress || 'N/A'}
               </div>
            </Grid>
            <Grid rowGap={0}>
               <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Phone Number</div>
               <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>
                  {getFormattedPhoneNumber(order.lead?.phoneNumber) || 'N/A'}
               </div>
            </Grid>
            <Grid rowGap={0}>
               <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Email</div>
               <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>{order.lead?.emailAddress}</div>
            </Grid>
         </Grid>
      </Grid>
   );
};

export default CustomerInfo;
