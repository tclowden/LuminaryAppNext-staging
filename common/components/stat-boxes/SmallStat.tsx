import React from 'react';
import Icon from '../Icon';
import styles from './StatBoxes.module.css';
import { statRowData } from './types';

interface Props {
   showDollarSign?: boolean;
   data: statRowData;
   icon?: React.ReactNode;
}

const defaultIcon = <Icon name='AnalyticsBar' />;

const SmallStat: React.FC<Props> = ({ icon = defaultIcon, showDollarSign, data }) => {
   return (
      <div className='flex flex-row'>
         {data && (
            <div className={styles.container}>
               <div className={styles.iconBoxShadow + ' pb-[10px]'}>{data.icon}</div>
               <div className={styles.title}>{data.title}</div>
               <div className='flex flex-col justify-center items-center'>
                  <div className={styles.stat}>
                     {showDollarSign && <sup>$</sup>}
                     {data.stat || 0}
                  </div>
                  {data.subtitle && <div className={styles.subtitle}>{data.subtitle}</div>}
               </div>
            </div>
         )}
      </div>
   );
};

export default SmallStat;
