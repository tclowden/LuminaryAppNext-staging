'use client';
import Grid from '@/common/components/grid/Grid';
import Textarea from '@/common/components/textarea/Textarea';
import React from 'react';

interface Props {}

const GeneralNotes = ({}: Props) => {
   return (
      <Grid>
         <div>General Notes</div>
         <div className='grid grid-cols-1'>
            <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Notes</div>
            <div className='mt-1'></div>
            <Textarea />
         </div>
      </Grid>
   );
};

export default GeneralNotes;
