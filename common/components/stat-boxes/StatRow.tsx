import React from 'react';
import { statRowData } from '@/common/components/stat-boxes/types';
import Icon from '../Icon';
import styles from './StatBoxes.module.css';

interface Props {
   showDollarSign?: boolean;
   data: statRowData[];
   icon?: React.ReactNode;
}

const defaultIcon = <Icon name='AnalyticsBar' />;

const StatRow: React.FC<Props> = ({ icon = defaultIcon, showDollarSign, data }) => {
   return (
      <div className='flex flex-row'>
         {data &&
            data.length > 0 &&
            data.map((item, index) => (
               <div key={index} className={styles.container}>
                  <div className={styles.iconBoxShadow + ' pb-[10px]'}>{item.icon}</div>
                  <div className={styles.title}>{item.title}</div>
                  <div className='flex flex-col justify-center items-center'>
                     <div className={styles.stat}>
                        {showDollarSign && <sup>$</sup>}
                        {item.stat}
                     </div>
                     {item.subtitle && <div className={styles.subtitle}>{item.subtitle}</div>}
                  </div>
               </div>
            ))}
      </div>
   );
};

export default StatRow;
