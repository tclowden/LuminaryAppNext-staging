import React from 'react';
import Grid from '../grid/Grid';

interface Props {
   count: number;
}
const PanelLoader = ({ count = 1 }: Props) => {
   return (
      <>
         {Array.from({ length: count }).map((_: any, i: number) => {
            return (
               <div
                  key={i}
                  style={{ boxShadow: '0px 1px 2px rgba(16, 24, 30, 0.15)' }}
                  className='rounded animate-pulse'>
                  <div
                     className={`
                        flex justify-between items-center px-[20px] min-h-[60px] bg-lum-gray-100 dark:bg-lum-gray-600 animate-pulse
                     `}>
                     <div className='flex flex-row items-center'>
                        <div className='relative w-[40px] h-[40px] mr-[8px] rounded-full bg-lum-gray-50 dark:bg-lum-gray-700 animate-pulse' />
                        <span className={`w-[300px] h-[16px] ml-[6px] bg-lum-gray-50 dark:bg-lum-gray-700`} />
                     </div>
                     <div>
                        <span className='relative'></span>
                     </div>
                     <Grid
                        className={`max-h-[2000px] py-[8px] px-[6px] rounded-b bg-lum-gray-50 dark:bg-lum-gray-700 transition-[max-height,padding-top,padding-bottom] ease-in-out animate-pulse`}></Grid>
                  </div>
               </div>
            );
         })}
      </>
   );
};

export default PanelLoader;
