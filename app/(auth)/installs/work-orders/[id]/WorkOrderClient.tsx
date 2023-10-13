'use client';
import React from 'react';
import Grid from '../../../../../common/components/grid/Grid';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import CustomOrderInfo from './(partials)/CustomOrderInfo';
import GeneralInfo from './(partials)/GeneralInfo';
import OrderInfo from './(partials)/OrderInfo';
import OtherOrderInfo from './(partials)/OtherOrderInfo';

interface Props {}

const WorkOrderClient = ({}: Props) => {
   return (
      <PageContainer>
         <Grid>
            <GeneralInfo />
            <OrderInfo />
            <OtherOrderInfo />
            {/* <CustomOrderInfo /> */}
         </Grid>
      </PageContainer>
   );
};

export default WorkOrderClient;

const Hr = () => <hr className='-ml-[20px] w-[calc(100%+40px)] bt-[1px] border-lum-gray-650' />;
