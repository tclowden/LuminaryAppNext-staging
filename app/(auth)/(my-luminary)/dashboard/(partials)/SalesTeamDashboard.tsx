'use client';
import Grid from '@/common/components/grid/Grid';
import Icon from '@/common/components/Icon';
import PageContainer from '@/common/components/page-container/PageContainer';
import RechartGraph from '@/common/components/stat-boxes/RechartGraph';
import StatRow from '@/common/components/stat-boxes/SmallStat';
import TallStat from '@/common/components/stat-boxes/TallStat';
import { statRowData } from '@/common/components/stat-boxes/types';
import React from 'react';
const statObject: statRowData[] = [
   {
      title: 'Revenue Year to Date',
      icon: <Icon name='CalendarCash' color='blue' width={26} />,
      stat: '77.2M',
      subtitle: '$90M Goal',
      showDollarSign: true,
   },
   {
      title: 'Today',
      icon: <Icon name='CalendarCash' color='purple' width={25} />,
      stat: '87.9K',
      subtitle: '$90M Goal',
      showDollarSign: true,
   },
   {
      title: 'Today',
      icon: <Icon name='CalendarCash' color='cyan' width={25} />,
      stat: '87.9K',
      showDollarSign: true,
      subtitle: '$90M Goal',
   },
   {
      title: 'Today',
      icon: <Icon name='CalendarCash' color='green' width={25} />,
      stat: '87.9K',
      showDollarSign: true,
      subtitle: '$90M Goal',
   },
];

type Props = {
   user: any;
};

const SalesTeamDash = ({ user }: Props) => {
   return (
      <>
         <div>Sales Team Dash</div>
         {/* <Grid columnCount={3} columnGap={10} colSpan={2}>
            <Grid columnCount={1}>
               <TallStat
                  title='Revenue Year to Date'
                  icon={<Icon name='CalendarCash' color='cyan' width={26} />}
                  stat={'77.2M'}
                  subtitle='$90M Goal'
                  showDollarSign={true}
               />
            </Grid>

            <Grid columnCount={1} colSpan={2}>
               <StatRow showDollarSign={true} data={statObject} />
               <RechartGraph />
            </Grid>
         </Grid>
         <div className='h-[10px] w-[10px]'></div>
         <Grid colSpan={10}>
            <StatRow showDollarSign={true} data={statObject} />
         </Grid> */}
      </>
   );
};

export default SalesTeamDash;
