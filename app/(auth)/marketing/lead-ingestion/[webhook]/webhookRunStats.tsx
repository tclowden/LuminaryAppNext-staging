'use client';

import React, { useEffect, useState } from 'react';
import { ColumnType } from '../../../../../common/components/table/tableTypes';

const columns: ColumnType[] = [
   { keyPath: ['status'], title: 'Status', colSpan: .5 },
   { keyPath: ['dataIn'], title: 'Data Recieved', colSpan: 2 },
   { keyPath: ['createdAt'], title: 'Run Date', colSpan: .5 },
];

import ProgressCircle from '../../../../../common/components/progress-circle/ProgressCircle';
import Icon from '../../../../../common/components/Icon';
import Panel from '../../../../../common/components/panel/Panel';
import Explainer from '../../../../../common/components/explainer/Explainer';


const LIWebhookRunStats = ({ runHistory }: { runHistory: any }) => {
   const runsTotal = runHistory.length
   const runsFailed = 0
   const runsSuccess = runsTotal - runsFailed
   const runSuccessPrecent = runsSuccess / runsTotal * 100

   const leadsTotal = runHistory.length
   const leadsRejected = 0
   const leadsCreated = 0
   const leadsCreatedPercent = leadsCreated / leadsTotal * 100

   // Runs, Leads Created, Leads Rejected, Duplicate, OOSA, 

   return (
      <>
         <div className='flex flex-row flex-wrap lg:flex-nowrap gap-2'>

            {/* Total runs */}
            <div className='bg-lum-white dark:bg-lum-gray-750 w-full p-[20px] rounded flex flex-row gap-x-4 items-center'>

               <ProgressCircle strokeColor='blue' progressPercentage={runSuccessPrecent || 0} width={100} strokeWidth={6}>
                  <div className='grid place-items-center gap-1'>
                     <div className='text-base leading-none text-lum-gray-400'>{runSuccessPrecent || 0}%</div>
                     <div className='text-sm leading-none text-lum-gray-400'>success</div>
                  </div>
               </ProgressCircle>

               <div className='w-full flex justify-around '>

                  <div className='flex flex-col gap-y-1'>
                     <div className='text-lum-gray-500 text-[14px]'>Total Runs</div>
                     <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>
                        {runsTotal}
                     </div>
                  </div>

                  <div className='flex flex-col gap-y-1'>
                     <Icon color='blue' name='CheckMark' width={22} height={22} />
                     <div className='text-lum-gray-500 text-[14px]'>Total Success</div>
                     <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>
                        {runsSuccess}
                     </div>
                  </div>

                  <div className='flex flex-col gap-y-1'>
                     <Icon color='blue' name='Warning' width={22} height={22} />
                     <div className='text-lum-gray-500 text-[14px]'>Total Failed</div>
                     <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>
                        {runsFailed}
                     </div>
                  </div>

               </div>

            </div>

            {/* Leads */}
            <div className='bg-lum-white dark:bg-lum-gray-750 w-full p-[20px] rounded flex flex-row gap-x-4 items-center'>
               <ProgressCircle strokeColor='green' progressPercentage={leadsCreatedPercent || 0} width={100} strokeWidth={6}>
                  <div className='grid place-items-center gap-1'>
                     <div className='text-base leading-none text-lum-gray-400'>{leadsCreatedPercent || 0}%</div>
                     <div className='text-sm leading-none text-lum-gray-400'>success</div>
                  </div>
               </ProgressCircle>

               <div className='w-full flex justify-around '>

                  <div className='flex flex-col gap-y-1'>
                     <div className='text-lum-gray-500 text-[14px]'>Total Leads</div>
                     <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>
                        {leadsTotal}
                     </div>
                  </div>

                  <div className='flex flex-col gap-y-1'>
                     <Icon color='green' name='CheckMark' width={22} height={22} />
                     <div className='text-lum-gray-500 text-[14px]'>Total Created</div>
                     <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>
                        {leadsCreated}
                     </div>
                  </div>

                  <div className='flex flex-col gap-y-1'>
                     <Icon color='green' name='XMarkCircle' width={22} height={22} />
                     <div className='text-lum-gray-500 text-[14px]'>Total Rejected</div>
                     <div className='text-[36px] text-lum-gray-700 font-[600] leading-[36px] dark:text-lum-white'>
                        {leadsRejected}
                     </div>
                  </div>

               </div>


            </div>
         </div>

         <Panel
            title={`Rejected Leads: ${leadsRejected}`}
            collapsible
            isCollapsed={leadsRejected > 0 ? false : true}
         >
            {leadsRejected > 0
               ? <>
                  <Explainer
                     title='Duplicate Leads'
                     description={'Leads that already exist within Luminary'}
                  >
                     <div></div>
                  </Explainer>

                  <Explainer
                     title='Lives out of service area'
                     description={'Leads that live outside of the service area'}
                  >
                     <div></div>
                  </Explainer>
               </>
               : <div > There are currently no rejected leads!</div>
            }
         </Panel>

         <Panel
            title={`Leads Per State`}
            collapsible
         >
         </Panel>

      </>
   );
};

export default LIWebhookRunStats;
