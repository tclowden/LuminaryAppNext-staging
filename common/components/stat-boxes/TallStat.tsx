import React from 'react';
import Icon from '../Icon';
import ProgressCircle from '../progress-circle/ProgressCircle';

interface Props {
   title: string;
   icon?: JSX.Element;
   stat: string | number;
   subtitle?: string;
   showDollarSign?: boolean; // new prop
   goal: any;
   rawStat: any;
}

const defaultIcon = <Icon name='AnalyticsBar'></Icon>;

const TallStat: React.FC<Props> = ({ title, icon = defaultIcon, stat, subtitle, showDollarSign, goal, rawStat }) => {
   const progressPercentage = (rawStat / goal) * 100;
   // Set up size-based styles
   let containerClass = 'w-full h-[450px] bg-lum-white dark:bg-lum-gray-750';
   let titleClass = 'text-[14px] text-lum-gray-500 dark:text-lum-gray-400 p-[5px]';
   let statClass = 'text-[60px] text-lum-black dark:text-lum-white';
   let subtitleClass = 'text-sm text-lum-gray-400 dark:text-lum-gray-300';

   return (
      <div className={`${containerClass} flex flex-col justify-center items-center`}>
         <div className='flex items-center justify-center pb-[10px]'>
            {icon && <div style={{ boxShadow: '0px 1px 2px 0px rgba(28, 39, 48, 0.20)' }}>{icon}</div>}
            <div className={`${titleClass} ml-2`}>{title}</div>
         </div>
         <ProgressCircle
            width={300}
            strokeWidth={8}
            strokeColor={'cyan'}
            progressPercentage={progressPercentage}
            defaultStrokeColor={'black'}>
            <div className='flex flex-col justify-center items-center'>
               <div className={`${statClass}`}>
                  {showDollarSign && <sup className='mr-1'>$</sup>}
                  {stat}
               </div>
               {subtitle && <div className={`${subtitleClass} font-medium`}>{subtitle}</div>}
            </div>
         </ProgressCircle>
      </div>
   );
};

export default TallStat;
