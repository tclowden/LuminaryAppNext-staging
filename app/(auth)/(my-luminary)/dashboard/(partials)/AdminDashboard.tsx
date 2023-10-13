'use client';

import Icon from '@/common/components/Icon';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';
import ProgressCircleStat from '@/common/components/stat-boxes/ProgressCircleStat';
import RechartGraph from '@/common/components/stat-boxes/RechartGraph';
import SmallStat from '@/common/components/stat-boxes/SmallStat';
import TallStat from '@/common/components/stat-boxes/TallStat';

import React, { useEffect, useState } from 'react';

type Props = {
   user: any;
};

const formatNumber = (num: number) => {
   if (Math.abs(num) >= 1.0e9) {
      return (Math.abs(num) / 1.0e9).toFixed(1) + 'B';
   }

   if (Math.abs(num) >= 1.0e6) {
      return (Math.abs(num) / 1.0e6).toFixed(1) + 'M';
   }

   if (Math.abs(num) >= 1.0e3) {
      return (Math.abs(num) / 1.0e3).toFixed(1) + 'K';
   }

   return Math.abs(num).toString();
};

// create a utility function that formats the number of seconds to ex: 1h 30m
const formatSeconds = (seconds: number) => {
   const hours = Math.floor(seconds / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);
   const hoursDisplay = hours > 0 ? hours + (hours === 1 ? 'h ' : 'h ') : '';
   const minutesDisplay = minutes > 0 ? minutes + (minutes === 1 ? 'm ' : 'm ') : '';
   return hoursDisplay + minutesDisplay;
};

const AdminDashboard = ({ user }: Props) => {
   const [dashboardData, setDashboardData] = useState<any>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   useEffect(() => {
      async function getDashboardData() {
         try {
            // Fetch data here
            const request = await fetch(`/api/v2/analytics/dashboards/admin-dashboard`, {
               method: 'GET',
               headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user?.token}` },
            });
            const data = await request.json();
            console.log('data: ', data);
            setDashboardData(data);
            setIsLoading(false);
         } catch (err) {
            console.log(err);
         }
      }

      getDashboardData();
   }, []);

   return (
      <>
         {!isLoading && dashboardData && (
            <div className='grid grid-cols-3  gap-[10px]'>
               <TallStat
                  title='Revenue Year to Date'
                  icon={<Icon name='CalendarCash' color='cyan' width={26} />}
                  stat={formatNumber(dashboardData?.ytdRev)}
                  subtitle={`$${formatNumber(dashboardData?.dashboardGoals?.yearToDateRevenue)} Goal`}
                  goal={dashboardData?.dashboardGoals?.yearToDateRevenue}
                  rawStat={dashboardData?.ytdRev}
               />

               {/* Wrap all SmallStat components in a div that spans 2 columns */}
               <div className='col-span-2'>
                  <div className='grid grid-cols-4'>
                     <SmallStat
                        showDollarSign={true}
                        data={{
                           title: 'Today',
                           icon: <Icon name='CalendarCash' color='blue' width={26} />,
                           stat: formatNumber(dashboardData?.todayRev),
                        }}
                     />
                     <SmallStat
                        showDollarSign={true}
                        data={{
                           title: 'Week To Date',
                           icon: <Icon name='CalendarCash' color='blue' width={26} />,
                           stat: formatNumber(dashboardData?.weekToDateRev),
                        }}
                     />
                     <SmallStat
                        showDollarSign={true}
                        data={{
                           title: 'Month To Date',
                           icon: <Icon name='CalendarCash' color='blue' width={26} />,
                           stat: formatNumber(dashboardData?.monthToDateRev),
                        }}
                     />
                     <SmallStat
                        showDollarSign={true}
                        data={{
                           title: '6 Week Revenue',
                           icon: <Icon name='CalendarCash' color='blue' width={26} />,
                           stat: formatNumber(dashboardData?.sixWeeksRev),
                        }}
                     />
                  </div>
                  <div className='grid grid-cols-1 mt-[10px]'>
                     <RechartGraph
                        data={dashboardData?.sixWeekRevGroupedByWeek}
                        goal={dashboardData?.dashboardGoals?.weeklyRevenue}
                     />
                  </div>
               </div>
               <div className='col-span-3'>
                  <div className='grid grid-cols-3 gap-[10px]'>
                     <ProgressCircleStat
                        data={{
                           title: 'Global Talk Time Today',
                           icon: <Icon name='CalendarCash' color='green' width={26} />,
                           stat: formatSeconds(parseInt(dashboardData?.talkTimeToday)),
                           circleColor: 'green',
                        }}
                        rawStat={dashboardData?.talkTimeToday}
                        goal={dashboardData?.dashboardGoals?.dailyTalkTime}
                     />
                     <ProgressCircleStat
                        data={{
                           title: 'Set Appointments Today',
                           icon: <Icon name='CalendarCash' color='blue' width={26} />,
                           stat: dashboardData?.setAppointments,
                           circleColor: 'blue',
                        }}
                        rawStat={dashboardData?.setAppointments}
                        goal={dashboardData?.dashboardGoals?.appointmentsSet}
                     />
                     <ProgressCircleStat
                        data={{
                           title: 'Signed Contracts Today',
                           icon: <Icon name='CalendarCash' color='pink:500' width={26} />,
                           stat: dashboardData?.signedContractsToday,
                           circleColor: 'pink:500',
                        }}
                        rawStat={dashboardData?.signedContractsToday}
                        goal={dashboardData?.dashboardGoals?.contractsSigned}
                     />
                  </div>
               </div>
            </div>
         )}
         {isLoading && <LoadingBackdrop isOpen={isLoading} />}
      </>
   );
};

export default AdminDashboard;
