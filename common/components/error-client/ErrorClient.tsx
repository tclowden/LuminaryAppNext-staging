'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../button/Button';
import Icon from '../Icon';
import PageContainer from '../page-container/PageContainer';

type Props = {
   errorMessage?: string;
   primaryBtnText?: string;
   primaryBtnRoute?: string;
   delay?: number;
};

const ErrorClient = ({ errorMessage, primaryBtnText, primaryBtnRoute, delay = 10 }: Props) => {
   const router = useRouter();
   const [remainingTime, setRemainingTime] = useState<number>(delay);

   useEffect(() => {
      const interval = setInterval(() => {
         setRemainingTime((prevState) => {
            return prevState - 1;
         });
      }, 1000);
      const timeout = setTimeout(() => {
         console.log('Redirecting Now');
         router.back();
      }, delay * 1000);

      return () => {
         clearInterval(interval);
         clearTimeout(timeout);
      };
   }, [delay]);

   return (
      <PageContainer breadcrumbsTitle={'Error'}>
         <div
            className={'flex flex-col items-center p-[20px] gap-[20px] rounded bg-lum-white dark:bg-lum-gray-750'}
            style={{ boxShadow: '0px 1px 2px rgba(16, 24, 30, 0.15)' }}>
            <Icon name='Warning' color='yellow' width={40} />
            <div className='flex flex-col items-center gap-[6px]'>
               <span className='text-[26px] font-semibold text-lum-gray-600 dark:text-lum-gray-100'>
                  {errorMessage ? errorMessage : `Nothing to See Here`}
               </span>
               <div className='flex gap-[15px]'>
                  <Button size='sm' color='light' onClick={() => router.back()}>
                     Go Back
                  </Button>
                  {primaryBtnText && primaryBtnRoute && (
                     <Button size='sm' color='blue' href={'primaryBtnRoute'}>
                        {primaryBtnText}
                     </Button>
                  )}
               </div>
               <span className='text-[14px] text-lum-gray-450'>
                  Returning to previous page in {remainingTime} seconds
               </span>
            </div>
         </div>
      </PageContainer>
   );
};

export default ErrorClient;
