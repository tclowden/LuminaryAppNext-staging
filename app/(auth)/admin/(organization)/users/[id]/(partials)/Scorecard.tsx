'use client';
import React from 'react';
import Icon from '../../../../../../../common/components/Icon';
import LineChart from '../../../../../../../common/components/line-chart/LineChart';
import ProgressCircle from '../../../../../../../common/components/progress-circle/ProgressCircle';

interface Props { }

const Scorecard = ({ }: Props) => {
   const goal = [
      { value: 42000, label: '$42K' },
      { value: 42000, label: '$42K' },
      { value: 42000, label: '$42K' },
      { value: 42000, label: '$42K' },
      { value: 42000, label: '$42K' },
      { value: 42000, label: '$42K' },
   ];
   const weekTotals = [
      { value: 29000, label: '$29K' },
      { value: 0, label: '$0' },
      { value: 42000, label: '$42K' },
      { value: 59000, label: '$59K' },
      { value: 89000, label: '$89K' },
      { value: 66000, label: '$66K' },
   ];
   const sixWeekAverages = [
      { value: 59000, label: '$59K' },
      { value: 42000, label: '$42K' },
      { value: 54000, label: '$54K' },
      { value: 56000, label: '$56K' },
      { value: 62000, label: '$62K' },
      { value: 58000, label: '$58K' },
   ];
   return (
      <div className='flex flex-col gap-2'>
         <div className='flex flex-row flex-wrap lg:flex-nowrap gap-2'>
            <div className='bg-lum-white dark:bg-lum-gray-750 w-full p-[20px] rounded flex flex-row gap-x-4 items-center'>
               <ProgressCircle strokeColor='green' progressPercentage={87} width={100} strokeWidth={6}>
                  <div className='text-[22px] text-lum-gray-400'>87%</div>
               </ProgressCircle>
               <div className='flex flex-col gap-y-1'>
                  <Icon color='green' name='CalendarCash' width={22} height={22} />
                  <div className='text-lum-gray-500 text-[14px]'>6 Week Average</div>
                  <div className='text-[36px] text-lum-gray-700 dark:text-lum-white font-[600] leading-[36px]'>
                     $49.6K
                  </div>
               </div>
               <div className='flex flex-row items-center gap-x-1 self-end'>
                  <Icon color='green' width={18} height={18} name='ArrowButtonUp' />
                  <span className='font-[600] text-[20px] text-lum-gray-700 dark:text-lum-white'>7.2K</span>
               </div>
            </div>
            <div className='bg-lum-white dark:bg-lum-gray-750 w-full p-[20px] rounded flex flex-row gap-x-4 items-center'>
               <ProgressCircle strokeColor='blue' progressPercentage={68} width={100} strokeWidth={6}>
                  <div className='text-[22px] text-lum-gray-400'>68%</div>
               </ProgressCircle>
               <div className='flex flex-col gap-y-1'>
                  <Icon color='blue' name='CalendarCash' width={22} height={22} />
                  <div className='text-lum-gray-500 text-[14px]'>Year to Date Revenue</div>
                  <div className='text-[36px] text-lum-gray-700 dark:text-lum-white font-[600] leading-[36px]'>
                     $641.4K
                  </div>
               </div>
            </div>
         </div>
         <div className='flex flex-row flex-wrap lg:flex-nowrap gap-2'>
            <LineChart
               height={100}
               config={{
                  title: { value: 'Weekly Totals', placement: 'left' },
                  xLabels: {
                     type: 'date',
                     labels: ['12/4/2022', '12/11/2022', '12/18/2022', '12/25/2022', '1/1/2023', '1/8/2023'],
                  },
                  yLabels: {
                     type: 'currency',
                     labels: [0, 25000, 50000, 75000, 100000],
                  },
               }}
               data={[
                  {
                     yValues: [...goal],
                     config: {
                        strokeColor: 'gray',
                        strokeWidth: 3,
                        title: 'Goal',
                        iconName: { x: 'Calendar', y: 'DollarSignCircle' },
                        referenceLine: true,
                     },
                  },
                  {
                     yValues: [...weekTotals],
                     config: {
                        strokeColor: 'blue',
                        strokeWidth: 3,
                        title: 'Actual',
                        iconName: { x: 'Calendar', y: 'DollarSignCircle' },
                     },
                  },
               ]}
            />
            <LineChart
               height={100}
               config={{
                  title: { value: '6 Week Averages', placement: 'left' },
                  xLabels: {
                     type: 'date',
                     labels: ['12/4/2022', '12/11/2022', '12/18/2022', '12/25/2022', '1/1/2023', '1/8/2023'],
                  },
                  yLabels: {
                     type: 'currency',
                     labels: [0, 25000, 50000, 75000, 100000],
                  },
               }}
               data={[
                  {
                     yValues: [...goal],
                     config: {
                        strokeColor: 'gray',
                        strokeWidth: 3,
                        title: 'Goal',
                        iconName: { x: 'Calendar', y: 'DollarSignCircle' },
                        referenceLine: true,
                     },
                  },
                  {
                     yValues: [...sixWeekAverages],
                     config: {
                        strokeColor: 'blue',
                        strokeWidth: 3,
                        title: 'Actual',
                        iconName: { x: 'Calendar', y: 'DollarSignCircle' },
                     },
                  },
               ]}
            />
         </div>
         <div className='flex flex-row flex-wrap lg:flex-nowrap gap-2'>
            <div className='bg-lum-white dark:bg-lum-gray-750 w-full p-[20px] rounded flex flex-row items-start justify-between'>
               <div className='flex flex-1 flex-col items-start'>
                  <div className='text-lum-gray-500 text-[14px]'>6 Week Appts Set</div>
                  <div className='text-lum-gray-700 text-[26px] font-[600] dark:text-lum-white'>36</div>
               </div>
               <div className='flex flex-1 flex-col items-start'>
                  <div className='text-lum-gray-500 text-[14px]'>6 Week Appts Kept</div>
                  <div className='text-lum-gray-700 text-[26px] font-[600] dark:text-lum-white'>24</div>
                  <div className='text-lum-gray-400 text-[12px]'>67% Kept Ratio</div>
               </div>
               <div className='flex flex-1 flex-col items-start'>
                  <div className='text-lum-gray-500 text-[14px]'>6 Week Deals Closed</div>
                  <div className='text-lum-gray-700 text-[26px] font-[600] dark:text-lum-white'>6</div>
                  <div className='text-lum-gray-400 text-[12px]'>17% Close Ratio</div>
               </div>
               <div className='flex flex-1 flex-col items-start'>
                  <div className='text-lum-gray-500 text-[14px]'>6 Week DPL</div>
                  <div className='text-lum-gray-700 text-[26px] font-[600] dark:text-lum-white'>$1,346</div>
               </div>
               <div className='flex flex-1 flex-col items-start'>
                  <div className='text-lum-gray-500 text-[14px]'>6 Week Avg PPW</div>
                  <div className='text-lum-gray-700 text-[26px] font-[600] dark:text-lum-white'>$124.52</div>
               </div>
            </div>
         </div>
         <div className='flex flex-row flex-wrap lg:flex-nowrap gap-2'>
            <div className='bg-lum-white dark:bg-lum-gray-750 w-full p-[20px] rounded flex flex-row gap-x-4 items-center'>
               <ProgressCircle strokeColor='blue' progressPercentage={68} width={100} strokeWidth={6}>
                  <div className='text-[22px] text-lum-gray-400'>68%</div>
               </ProgressCircle>
               <div className='flex flex-col gap-y-1'>
                  <Icon color='blue' name='PhoneTime' width={22} height={22} />
                  <div className='text-lum-gray-500 text-[14px]'>Total Talk Time</div>
                  <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>
                     16h 52m
                  </div>
                  <div className='flex flex-row items-center gap-x-1'>
                     <Icon color='green' width={18} height={18} name='ArrowButtonUp' />
                     <span className='font-[600] text-[20px] text-lum-gray-700 dark:text-lum-white'>1h 17m</span>
                  </div>
               </div>
               <div className='flex flex-col gap-y-1 self-start'>
                  <Icon color='blue' name='PhoneTime' width={22} height={22} />
                  <div className='text-lum-gray-500 text-[14px]'>Daily Average Talk Time</div>
                  <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>
                     3h 39m
                  </div>
               </div>
            </div>
            <div className='bg-lum-white dark:bg-lum-gray-750 w-full p-[20px] rounded flex flex-row gap-x-4 items-center'>
               <ProgressCircle strokeColor='green' progressPercentage={68} width={100} strokeWidth={6}>
                  <div className='text-[22px] text-lum-gray-400'>68%</div>
               </ProgressCircle>
               <div className='flex flex-col gap-y-1'>
                  <Icon color='green' name='PhoneActions' width={22} height={22} />
                  <div className='text-lum-gray-500 text-[14px] truncate'>Total Dials</div>
                  <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>
                     1,465
                  </div>
                  <div className='flex flex-row items-center gap-x-1'>
                     <span className='-rotate-180'>
                        <Icon color='red' width={18} height={18} name='ArrowButtonUp' />
                     </span>
                     <span className='font-[600] text-[20px] text-lum-gray-700 dark:text-lum-white'>142</span>
                  </div>
               </div>
               <div className='flex flex-col gap-y-1 self-start'>
                  <Icon color='green' name='PhoneActions' width={22} height={22} />
                  <div className='text-lum-gray-500 text-[14px] truncate'>Daily Average Dials</div>
                  <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>74</div>
               </div>
            </div>
         </div>
         <div className='flex flex-row flex-wrap xl:flex-nowrap gap-2'>
            <div className='bg-lum-white dark:bg-lum-gray-750 flex-1 p-[20px] rounded flex flex-row gap-x-4 items-start'>
               <Icon color='blue' name='PhoneTime' width={26} height={26} />
               <div className='flex flex-col items-start truncate'>
                  <div className='text-lum-gray-500 text-[14px]'>6 Week Referrals</div>
                  <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>26%</div>
               </div>
            </div>
            <div className='bg-lum-white dark:bg-lum-gray-750 flex-1 p-[20px] rounded flex flex-row gap-x-4 items-start'>
               <Icon color='green' name='PhoneTime' width={26} height={26} />
               <div className='flex flex-col items-start truncate'>
                  <div className='text-lum-gray-500 text-[14px]'>6 Week EE Sales</div>
                  <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>
                     100%
                  </div>
               </div>
            </div>
            <div className='bg-lum-white dark:bg-lum-gray-750 flex-1 p-[20px] rounded flex flex-row gap-x-4 items-start'>
               <Icon color='cyan' name='PhoneTime' width={26} height={26} />
               <div className='flex flex-col items-start truncate'>
                  <div className='text-lum-gray-500 text-[14px]'>6 Week HVAC Sales</div>
                  <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>36%</div>
               </div>
            </div>
            <div className='bg-lum-white dark:bg-lum-gray-750 flex-1 p-[20px] rounded flex flex-row gap-x-4 items-start'>
               <Icon color='orange' name='PhoneTime' width={26} height={26} />
               <div className='flex flex-col items-start truncate'>
                  <div className='text-lum-gray-500 text-[14px]'>6 Week HVAC Maint.</div>
                  <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>52%</div>
               </div>
            </div>
            <div className='bg-lum-white dark:bg-lum-gray-750 flex-1 p-[20px] rounded flex flex-row gap-x-4 items-start'>
               <Icon color='orange' name='PhoneTime' width={26} height={26} />
               <div className='flex flex-col items-start truncate'>
                  <div className='text-lum-gray-500 text-[14px]'>6 Week Cancellations</div>
                  <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>6%</div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Scorecard;
