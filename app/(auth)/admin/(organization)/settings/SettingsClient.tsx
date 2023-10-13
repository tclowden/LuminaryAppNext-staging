'use client';
import React, { useEffect, useState } from 'react';
import PageContainer from '@/common/components/page-container/PageContainer';
import Grid from '@/common/components/grid/Grid';
import Panel from '@/common/components/panel/Panel';
import Input from '@/common/components/input/Input';
import Button from '@/common/components/button/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';
import { setAddToast } from '@/store/slices/toast';
import { useRouter } from 'next/navigation';
import { revalidate } from '@/serverActions';

export default function SettingsClient() {
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const router = useRouter();

   const [yearToDateRevenue, setYearToDateRevenue] = useState<number>();
   const [sixWeekRevenue, setSixWeekRevenue] = useState<number>();
   const [monthlyRevenue, setMonthlyRevenue] = useState<number>();
   const [dailyRevenue, setDailyRevenue] = useState<number>();
   const [weeklyRevenue, setWeeklyRevenue] = useState<number>();
   const [dailyTalkTime, setDailyTalkTime] = useState<number>();
   const [appointmentsSet, setAppointmentsSet] = useState<number>();
   const [contractsSigned, setContractsSigned] = useState<number>();
   const [leadsAllowedInPipe, setLeadsAllowedInPipe] = useState<number>();
   const [dailyBucketGrabsLimit, setDailyBucketGrabsLimit] = useState<number>();
   const [isLoading, setIsLoading] = useState<boolean>(true);

   useEffect(() => {
      async function fetchOrgSettings() {
         const res = await fetch('/api/v2/org-settings', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${user.token}`,
            },
         });
         const data = await res.json();
         setYearToDateRevenue(data?.yearToDateRevenue);
         setSixWeekRevenue(data?.sixWeekRevenue);
         setMonthlyRevenue(data?.monthlyRevenue);
         setDailyRevenue(data?.dailyRevenue);
         setWeeklyRevenue(data?.weeklyRevenue);
         setDailyTalkTime(data?.dailyTalkTime);
         setAppointmentsSet(data?.appointmentsSet);
         setContractsSigned(data?.contractsSigned);
         setLeadsAllowedInPipe(data?.leadsAllowedInPipe);
         setDailyBucketGrabsLimit(data?.dailyBucketGrabsLimit);
         setIsLoading(false);
         console.log(data);
      }
      fetchOrgSettings();
   }, [user.token]);

   // Add the correct event type in the function params
   const handleSubmit = async (e: any) => {
      e.preventDefault();
      setIsLoading(true);
      const body = {
         yearToDateRevenue,
         sixWeekRevenue,
         monthlyRevenue,
         dailyRevenue,
         weeklyRevenue,
         dailyTalkTime,
         appointmentsSet,
         contractsSigned,
         leadsAllowedInPipe,
         dailyBucketGrabsLimit,
      };

      const request = await fetch('/api/v2/org-settings', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
         },
         body: JSON.stringify(body),
      });
      const data = await request.json();
      console.log('data', data);
      if (data.status === 200) {
         dispatch(
            setAddToast({
               variant: 'success',
               animate: true,
               position: 'bottom-left',
               autoCloseDelay: 2,
               details: [
                  {
                     label: 'Success',
                     text: 'Dashboard Updated',
                  },
               ],
            })
         );
         const url = `/dashboard`;
         await revalidate({ path: url });
         router.push(url);
         setIsLoading(false);
      } else {
         dispatch(
            setAddToast({
               variant: 'danger',
               animate: true,
               position: 'bottom-left',
               details: [
                  {
                     label: 'Error',
                     text: `${data}`,
                  },
               ],
            })
         );
      }
   };

   return (
      <PageContainer
         breadcrumbsChildren={
            <>
               <Button color='blue' type='submit' onClick={handleSubmit}>
                  Save
               </Button>
            </>
         }>
         <Panel title={'Dashboard Goals'} collapsible>
            <Grid columnCount={4}>
               <Input
                  type={'number'}
                  label='Yearly Revenue'
                  placeholder='Enter Yearly Revenue'
                  // use the currencyFormatter function to format the value
                  value={yearToDateRevenue || ''}
                  onChange={(e) => setYearToDateRevenue(e.target.valueAsNumber)}></Input>

               <Input
                  label='Six Week Revenue'
                  placeholder='Enter Six Week Revenue'
                  value={sixWeekRevenue || ''}
                  onChange={(e) => setSixWeekRevenue(e.target.value)}></Input>

               <Input
                  label='Monthly Revenue'
                  placeholder='Enter Monthly Revenue'
                  value={monthlyRevenue || ''}
                  onChange={(e) => setMonthlyRevenue(e.target.value)}></Input>

               <Input
                  label='Daily Revenue'
                  placeholder='Enter Daily Revenue'
                  value={dailyRevenue || ''}
                  onChange={(e) => setDailyRevenue(e.target.value)}></Input>
               <Input
                  label='Weekly Revenue'
                  placeholder='Enter Weekly Revenue'
                  value={weeklyRevenue || ''}
                  onChange={(e) => setWeeklyRevenue(e.target.value)}></Input>
               <Input
                  label='Daily Talk Time Minutes'
                  placeholder='Enter Daily Talk Time'
                  value={dailyTalkTime || ''}
                  onChange={(e) => setDailyTalkTime(e.target.value)}></Input>
               <Input
                  label='Appointments Set'
                  placeholder='Enter Appointments Set'
                  value={appointmentsSet || ''}
                  onChange={(e) => setAppointmentsSet(e.target.value)}></Input>
               <Input
                  label='Contracts Signed'
                  placeholder='Enter Contracts Signed'
                  value={contractsSigned || ''}
                  onChange={(e) => setContractsSigned(e.target.value)}></Input>
            </Grid>
         </Panel>
         <div className='w-full h-[5px]'></div>
         <Panel title={'Bucket / Sales Config'} collapsible>
            <Grid columnCount={3}>
               <Input
                  label='Leads Allowed in Pipe'
                  placeholder='Enter Leads Allowed in Pipe'
                  value={leadsAllowedInPipe || ''}
                  onChange={(e) => setLeadsAllowedInPipe(e.target.value)}></Input>
               <Input
                  label='Daily bucket grabs limit'
                  placeholder='Enter Daily bucket grabs limit'
                  value={dailyBucketGrabsLimit || ''}
                  onChange={(e) => setDailyBucketGrabsLimit(e.target.value)}></Input>
            </Grid>
         </Panel>
         <LoadingBackdrop isOpen={isLoading} zIndex={101} />
      </PageContainer>
   );
}
