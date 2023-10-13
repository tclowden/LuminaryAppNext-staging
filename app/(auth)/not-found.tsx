'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../common/components/button/Button';
import PageContainer from '../../common/components/page-container/PageContainer';

type Props = {};

const AuthNotFound = ({}: Props) => {
   const router = useRouter();
   const [remainingTime, setRemainingTime] = useState<number>(10);

   useEffect(() => {
      const interval = setInterval(() => {
         setRemainingTime((prevState) => {
            return prevState - 1;
         });
      }, 1000);
      const timeout = setTimeout(() => {
         console.log('Redirecting Now');
         router.back();
      }, 10 * 1000);

      return () => {
         clearInterval(interval);
         clearTimeout(timeout);
      };
   }, []);

   return (
      <PageContainer breadcrumbsTitle={'Page Not Found'}>
         <div
            className={'flex flex-col items-center p-[20px] gap-[20px] rounded bg-lum-white dark:bg-lum-gray-750'}
            style={{ boxShadow: '0px 1px 2px rgba(16, 24, 30, 0.15)' }}>
            <div className='flex flex-col items-center gap-[6px]'>
               <span className='text-[26px] font-semibold text-lum-gray-600 dark:text-lum-gray-100'>
                  Page Not Found
               </span>
               <div className='flex gap-[15px]'>
                  <Button size='sm' color='light' onClick={() => router.back()}>
                     Go Back
                  </Button>
               </div>
               <span className='text-[14px] text-lum-gray-450'>
                  Returning to previous page in {remainingTime} seconds
               </span>
            </div>
         </div>
      </PageContainer>
   );
};

export default AuthNotFound;
