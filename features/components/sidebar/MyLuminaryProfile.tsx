'use client';
import { getObjectProp } from '@/utilities/helpers';
import React from 'react';
import Grid from '../../../common/components/grid/Grid';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/user';
import GetNextLead from '../get-next-lead/GetNextLead';
import ProfileWidget from './ProfileWidget';
import StatWidget from './StatWidget';
import { calculateProgressPercent, convertValueToHoursMinutesSeconds, getCustomNumberValueOutput } from './utilities';

interface Props {}

const MyLuminaryProfile = ({}: Props) => {
   const user = useAppSelector(selectUser);

   const widgetStats = [
      { value: 112, displayType: 'number', bgColor: 'bg-lum-green-500', title: 'Dials', goal: 150 },
      { value: 4, displayType: 'number', bgColor: 'bg-lum-blue-500', title: 'Appts Set', goal: 25 },
      { value: 7200000, displayType: 'time', bgColor: 'bg-lum-green-500', title: 'Talk time', goal: 10800000 },
      { value: 319000, displayType: 'revenue', bgColor: 'bg-lum-blue-500', title: '6 Week Rev', goal: 400000 },
   ];

   return (
      <>
         <ProfileWidget
            profileImageSrc={user?.profileUrl}
            name={user?.fullName ?? 'N/A'}
            phone={getObjectProp(user, ['phoneNumbers', 0, 'phoneNumber', 'prettyNumber'])}
         />

         {/* TODO: Add Permission for GetNextLeadWidget */}
         <GetNextLead />

         <Grid columnCount={2} rowGap={10} columnGap={10}>
            {widgetStats.map((stat: any, i: number) => {
               const width: number = calculateProgressPercent(stat.value, stat.goal);

               let val = null;
               switch (stat.displayType) {
                  case 'number':
                     val = stat.value;
                     break;
                  case 'time':
                     val = convertValueToHoursMinutesSeconds(stat.value);
                     break;
                  case 'revenue':
                     val = getCustomNumberValueOutput(stat.value);
                     break;
                  default:
                     break;
               }

               return <StatWidget key={i} value={val} bgColor={stat.bgColor} title={stat.title} width={width} />;
            })}
         </Grid>
      </>
   );
};

export default MyLuminaryProfile;
