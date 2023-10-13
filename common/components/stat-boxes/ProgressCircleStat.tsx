import React from 'react';
import Icon from '../Icon';
import ProgressCircle from '../progress-circle/ProgressCircle';

interface Props {
   data: any;
   icon?: React.ReactNode;
   rawStat?: any;
   goal?: any;
}

const defaultIcon = <Icon name='AnalyticsBar' />;

const ProgressCircleStat: React.FC<Props> = ({ icon = defaultIcon, data, rawStat, goal }) => {
   const progress = (rawStat / goal) * 100;
   return (
      <div className='flex flex-row w-full h-[170px] bg-lum-white dark:bg-lum-gray-750 p-[30px]'>
         <ProgressCircle
            width={100}
            strokeWidth={8}
            strokeColor={data.circleColor}
            progressPercentage={progress}
            defaultStrokeColor={'black'}>
            <span className='text-lum-gray-500 text-[24px]'>{`${progress.toFixed(0)}%`}</span>
         </ProgressCircle>
         <div className='flex flex-col items-start justify-center align-center ml-[10px]'>
            {data.icon && <div>{data.icon}</div>}
            <span className='text-lum-gray-500 pt-[5px] pb-[5px]'>{data.title}</span>
            <span className='text-lum-white text-[24px]'>{data.stat || 0}</span>
         </div>
      </div>
   );
};

export default ProgressCircleStat;
