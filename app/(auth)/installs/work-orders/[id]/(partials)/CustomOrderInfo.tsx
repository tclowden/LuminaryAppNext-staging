'use client';
import React from 'react';
import Grid from '../../../../../../common/components/grid/Grid';
import Panel from '../../../../../../common/components/panel/Panel';

interface Props {}

const CustomOrderInfo = ({}: Props) => {
   return (
      <Panel title={`Custom Order Info`} titleSize={'md'} collapsible>
         <Grid rowGap={24}>Custom Order Info Here</Grid>
      </Panel>
   );
};

export default CustomOrderInfo;
