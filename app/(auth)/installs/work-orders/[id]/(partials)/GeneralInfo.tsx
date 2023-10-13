'use client';

import React, { useEffect, useState } from 'react';
import Grid from '../../../../../../common/components/grid/Grid';
import Panel from '../../../../../../common/components/panel/Panel';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { selectPageContext } from '../../../../../../store/slices/pageContext';
import Hr from '../../../../../../common/components/hr/Hr';
import { useRouter } from 'next/navigation';
import { revalidate } from '@/serverActions';
import CustomerInfo from './(general-info-partials)/CustomerInfo';
import StageInfo from './(general-info-partials)/StageInfo';
// import KeyIndicators from './(general-info-partials)/KeyIndicators';
import Coordinators from './(general-info-partials)/Coordinators';
// import GeneralNotes from './(general-info-partials)/GeneralNotes';
import InstallDetails from './(general-info-partials)/InstallDetails';

interface Props {}

const GeneralInfo = ({}: Props) => {
   const router = useRouter();
   const { order, allLeadOrders } = useAppSelector(selectPageContext);
   const dispatch = useAppDispatch();
   // need to be able to add a callback to each order so the code can handle the reroute
   const [leadOrders, setLeadOrders] = useState<any[]>([]);

   const cb = async (e: any, optionSelected: any) => {
      if (optionSelected?.id) {
         const url = `/installs/work-orders/${optionSelected?.id}`;
         await revalidate({ path: url });
         return router.push(url);
      }
   };

   useEffect(() => {
      setLeadOrders((prevState: Array<any>) => {
         return allLeadOrders
            .filter((allOrders: any) => allOrders?.id !== order?.id)
            .map((val: any) => ({
               ...val,
               text: `${val?.id?.slice(0, 6)}... - ${val?.product?.name}`,
               callback: (e: any) => cb(e, val),
            }));
      });

      // made the id a dependency just in case we want to change the data based on an id change & not reload the page
      // i think it'd be better to reload the page tho so the url matches & we can make the db call on the server
      // either way, this still only renders once
   }, [order?.id]);

   return (
      <Panel
         title={`#${order?.id.slice(0, 6)}... - ${order?.product?.name}`}
         titleSize={'md'}
         titleIconName={'HammerWrench'}
         titleIconColor={'gray'}
         options={leadOrders || []}
         optionsIconName={'ListBullets'}
         optionsIconTooltip={'Actions'}>
         <Grid rowGap={24}>
            <CustomerInfo />
            <Hr className='-ml-[20px] w-[calc(100%+40px)]' />
            <StageInfo />
            <Hr className='-ml-[20px] w-[calc(100%+40px)]' />
            <InstallDetails />
            {/* <Hr className='-ml-[20px] w-[calc(100%+40px)]' />
            <KeyIndicators /> */}
            {/* <Hr className='-ml-[20px] w-[calc(100%+40px)]' />
            <Coordinators /> */}
            {/* <Hr className='-ml-[20px] w-[calc(100%+40px)]' />
            <GeneralNotes /> */}
         </Grid>
      </Panel>
   );
};

export default GeneralInfo;
