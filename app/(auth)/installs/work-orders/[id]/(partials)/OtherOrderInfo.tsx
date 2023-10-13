'use client';
import React, { useState } from 'react';
import Grid from '../../../../../../common/components/grid/Grid';
import Panel from '../../../../../../common/components/panel/Panel';
import Tabs from '../../../../../../common/components/tabs/Tabs';
import Tasks from './(other-order-info-partials)/Tasks';
import Stages from './(other-order-info-partials)/Stages';
import Notes from './(other-order-info-partials)/Notes';
import Attachments from './(other-order-info-partials)/Attachments';
import Button from '@/common/components/button/Button';

const tabs = [
   { name: 'Stages' },
   { name: 'Tasks', addBtnText: 'Add Task' },
   { name: 'Notes', addBtnText: 'Add Note' },
   { name: 'Attachments', addBtnText: 'Add Attachment' },
   // { name: 'Lead Notes' },
   // { name: 'Lead Attachments' },
   // { name: 'Finance' },
   // { name: 'Emails' },
   // { name: 'Call Logs' },
];

interface Props {}

const OtherOrderInfo = ({}: Props) => {
   const [activeNavIndex, setActiveNavIndex] = useState<number>(0);
   const [modalOpen, setModalOpen] = useState<boolean>(false);

   return (
      <Panel title={`Other Order Info`} titleSize={'md'} collapsible>
         <Grid rowGap={24}>
            <Grid>
               <Tabs tabs={tabs} activeTabIndex={activeNavIndex} setActiveTabIndex={setActiveNavIndex} />
            </Grid>
            <Grid>
               {tabs[activeNavIndex]?.addBtnText && (
                  <div className='flex flex-row justify-end col-start-3'>
                     <Button
                        color='blue'
                        iconName='Plus'
                        onClick={() => {
                           setModalOpen(true);
                        }}>
                        {tabs[activeNavIndex]?.addBtnText}
                     </Button>
                  </div>
               )}
            </Grid>

            {tabs[activeNavIndex].name === 'Stages' && <Stages />}
            {tabs[activeNavIndex].name === 'Tasks' && <Tasks modalOpen={modalOpen} setModalOpen={setModalOpen} />}
            {tabs[activeNavIndex].name === 'Notes' && <Notes modalOpen={modalOpen} setModalOpen={setModalOpen} />}
            {tabs[activeNavIndex].name === 'Attachments' && (
               <Attachments modalOpen={modalOpen} setModalOpen={setModalOpen} />
            )}
         </Grid>
      </Panel>
   );
};

export default OtherOrderInfo;
