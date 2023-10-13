'use client';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Button from '../../../../common/components/button/Button';
import Tabs from '../../../../common/components/tabs/Tabs';
import InProgress from './(partials)/InProgress';
import MissingInfo from './(partials)/MissingInfo';
import RevisionsRequested from './(partials)/RevisionsRequested';
import NewDrafts from './(partials)/NewDrafts';
import Unassigned from './(partials)/Unassigned';
import Complete from './(partials)/Complete';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import PageContainer from '@/common/components/page-container/PageContainer';

const tabsWithIcons = [
   { name: 'Unassigned' }, // , iconName: 'Gear'
   { name: 'In Progress' }, // , iconName: 'Target'
   { name: 'Complete' }, // , iconName: 'Users'
   { name: 'Missing Info' }, // , iconName: 'LeadSources'
   // { name: 'Revisions requested' }, // , iconName: 'LeadSources'
   // { name: 'New Drafts' }, // , iconName: 'Proposal'
];

interface Props {
   queueInfo: any;
   statusTypes: any;
}

const ProposalsClient = ({ queueInfo, statusTypes }: Props) => {
   const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
   const [unassigned, setUnassigned] = useState<any>([]);
   const [inProgress, setInProgress] = useState<Object>({});
   const [complete, setComplete] = useState<Object>({});
   const [missingInfo, setMissingInfo] = useState<Object>({});
   const [revisionsRequested, setRevisionsRequested] = useState<Object>({});
   const [newDrafts, setNewDrafts] = useState<Object>({});

   const [proposalTechs, setProposalTechs] = useState<any>({});

   const [queue, setQueueInfo] = useState<Object>({});

   const updateProposalQueue = () => {
      // Send an api request out to /api/v2/
      const requestOptions = {
         method: 'GET',
         redirect: 'follow',
      } as RequestInit;

      fetch('/api/v2/proposal-queue/', requestOptions)
         .then((response) => response.json())
         .then((result) => {
            const unassigned = result['proposalQueue'].filter((e: any) => {
               // return e.assignedTo == null && e.completedBy == null;
               return e.proposalStatus.name == 'Unassigned';
            });

            const inProg = result['proposalQueue'].filter((e: any) => {
               // return e.assignedTo !== null && e.completedBy == null;
               return e.proposalStatus.name == 'In Progress';
            });

            const completed = result['proposalQueue'].filter((e: any) => {
               // return e.assignedTo !== null && e.completedBy !== null;
               return e.proposalStatus.name == 'Completed';
            });

            const missing = result['proposalQueue'].filter((e: any) => {
               // e.proposalStatus.name
               // 'In Progress'
               // return e.assignedTo !== null && e.completedBy !== null;
               return e.proposalStatus.name == 'Missing Info';
            });

            setUnassigned(unassigned);
            setInProgress(inProg);
            setComplete(completed);
            setMissingInfo(missing);
            // setRevisionsRequested();
            // setNewDrafts();

            setProposalTechs(result['availableProposalTechs']);
         })
         .catch((error) => console.log('error', error));
   };

   useEffect(() => {
      updateProposalQueue();
   }, []);
   useEffect(() => {
      updateProposalQueue();
   }, [activeTabIndex]);

   return (
      <PageContainer>
         <div className='flex flex-col gap-4'>
            {/* <div className='flex flex-row items-start gap-4'>
            <Tabs tabs={tabsWithIcons} activeTabIndex={activeTabIndex} setActiveTabIndex={setActiveTabIndex} />
         </div> */}
            <Tabs tabs={tabsWithIcons} activeTabIndex={activeTabIndex} setActiveTabIndex={setActiveTabIndex} />
            {activeTabIndex === 0 && (
               <Unassigned
                  unassigned={unassigned}
                  proposalTechs={proposalTechs}
                  updateProposalQueue={updateProposalQueue}
               />
            )}
            {activeTabIndex === 1 && <InProgress inProgress={inProgress} updateProposalQueue={updateProposalQueue} />}
            {activeTabIndex === 2 && <Complete complete={complete} updateProposalQueue={updateProposalQueue} />}
            {activeTabIndex === 3 && <MissingInfo missing={missingInfo} updateProposalQueue={updateProposalQueue} />}
            {/* {activeTabIndex === 4 && <RevisionsRequested />}
            {activeTabIndex === 5 && <NewDrafts />} */}
         </div>
      </PageContainer>
   );
};

export default ProposalsClient;
