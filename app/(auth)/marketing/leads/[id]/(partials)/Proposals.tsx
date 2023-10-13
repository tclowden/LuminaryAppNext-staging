'use client';

import React, { useEffect, useState } from 'react';
import Button from '../../../../../../common/components/button/Button';
import Table from '../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../common/components/table/tableTypes';
import { useRouter } from 'next/navigation';
import Panel from '../../../../../../common/components/panel/Panel';
import Grid from '../../../../../../common/components/grid/Grid';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { fetchDbApi } from '@/serverActions';

interface params {
   lead: any;
}

const LeadRecord = ({ lead }: params) => {
   const user = useAppSelector(selectUser);
   const router = useRouter();

   const [data, setData] = useState([]);
   const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
   const [initialLoadData, setInitialLoadData] = useState<boolean>(false);

   const handleActionClick = ({ event, actionKey, item }: { event: Event; actionKey: string; item: any }) => {
      const userAuthToken = user?.token;
      const axios = require('axios');
      switch (actionKey) {
         case 'edit':
            router.push('/installs/proposals/view/' + item.id);
            break;
         case 'delete':
            if (!window.confirm('Are you sure you want to remove this proposal option?')) {
               return;
            }
            // axios
            //    .put(
            //       `/api/v2/proposal-options/archive/`,
            //       { optionId: item.id },
            //       { headers: { Authorization: `Bearer ${userAuthToken}` } }
            //    )
            fetchDbApi(`/api/v2/proposal-options/${item?.id}`, {
               method: 'DELETE',
               headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
            })
               .then((res: any) => {
                  if (res.data.success) {
                     console.log('Success!');

                     setData((prevData) => {
                        console.log(prevData);
                        const prevDataCopy = [...prevData];
                        const filtered = prevDataCopy.filter((e: any) => {
                           return e.id != item.id;
                        });
                        return filtered;
                     });
                  } else {
                     console.log('Invalid Json, or failure');
                  }
               })
               .catch((err: any) => {
                  console.log('err:', err);
               });
            break;
         case 'duplicate':
            console.log('TIME TO DUPLICATE!');
            // axios
            //    .put(
            //       `/api/v2/proposal-options/duplicate/`,
            //       { optionId: item.id },
            //       { headers: { Authorization: `Bearer ${userAuthToken}` } }
            //    )
            fetchDbApi(`/api/v2/proposal-options/${item.id}/duplicate`, {
               method: 'GET',
               headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
            })
               .then((res: any) => {
                  if (res.data.success) {
                     console.log('Success!');
                     loadProposals();
                  } else {
                     console.log('Invalid Json, or failure');
                  }
               })
               .catch((err: any) => {
                  console.log('err:', err);
               });

         default:
            break;
      }
   };

   const columns: ColumnType[] = [
      { keyPath: ['name'], title: 'Name', colSpan: 1 },
      { keyPath: ['proposalTech'], title: 'Proposal Tech', colSpan: 1 },
      { keyPath: ['createdAt'], title: 'Date Created', colSpan: 1 },
      { keyPath: ['solar'], title: 'Solar', colSpan: 1 },
      { keyPath: ['hvac'], title: 'HVAC', colSpan: 1 },
      { keyPath: ['ee'], title: 'EE', colSpan: 1 },
      { keyPath: ['battery'], title: 'Battery', colSpan: 1 },
   ];

   const loadProposals = () => {
      let proposalOptions: Array<Object> = [];

      const userAuthToken = user?.token;
      // change route from: /api/v2/proposal-options/lead/${lead.id}
      // to: /api/v2/leads/${lead.id}/proposal-options
      // that's how the rest of the lead feature it handling all it's calls
      // axios
      //    .get(`/api/v2/proposal-options/lead/${lead.id}`, {
      //       headers: { Authorization: `Bearer ${userAuthToken}` },
      //    })
      fetchDbApi(`/api/v2/leads/${lead.id}/proposal-options`, {
         method: 'GET',
         headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
      })
         .then((res: any) => {
            // if (res.data.success) {
            if (res) {
               console.log('Success!');
               // Redirect to load page for id. res.data.proposalId
               console.log('SHOW ME THE MONEY', res);

               // COMMENTED THIS OUT UNTIL MARK ADDED CONTROLLER LOGIC TO ROUTE
               // console.log(res.data.proposalOptions);
               // proposalOptions = res.data.proposalOptions;

               // const dataToStore: any = proposalOptions
               //    .map((u: any) => ({
               //       ...u,
               //    }))
               //    .map((e) => {
               //       const hasIcon = (exists: Boolean) => {
               //          return exists ? 'CheckMarkCircle' : 'XMarkCircle';
               //       };
               //       const hasGreen = (exists: Boolean) => {
               //          return exists ? 'green' : 'white';
               //       };

               //       let hasProds = {
               //          solar: false,
               //          hvac: false,
               //          ee: false,
               //          battery: false,
               //       };
               //       console.log(e.proposalOptionProducts, 'e.proposalOptionProducts');
               //       e.proposalOptionProducts.forEach((prods: any) => {
               //          console.log(prods, 'prods');
               //          if (prods.product == 'solar') hasProds.solar = true;
               //          if (prods.product == 'hvac') hasProds.hvac = true;
               //          if (prods.product == 'ee') hasProds.ee = true;
               //          if (prods.product == 'battery') hasProds.battery = true;
               //       });

               //       e.solar = { iconConfig: { name: hasIcon(hasProds.solar), color: hasGreen(hasProds.solar) } };
               //       e.hvac = { iconConfig: { name: hasIcon(hasProds.hvac), color: hasGreen(hasProds.hvac) } };
               //       e.ee = { iconConfig: { name: hasIcon(hasProds.ee), color: hasGreen(hasProds.ee) } };
               //       e.battery = { iconConfig: { name: hasIcon(hasProds.battery), color: hasGreen(hasProds.battery) } };

               //       e.actionsConfig = { edit: true, duplicate: true, delete: true };

               //       const humanDate = new Date(e.createdAt);
               //       e.createdAt = humanDate.toLocaleDateString();
               //       return e;
               //    })
               //    .sort((a: any, b: any) => {
               //       //@ts-ignore
               //       const valueA = columns[0].keyPath.reduce((acc: any, curr: any) => acc[curr as any], a);
               //       //@ts-ignore
               //       const valueB = columns[0].keyPath.reduce((acc: any, curr: any) => acc[curr as any], b);
               //       return valueA > valueB ? 1 : -1;
               //    });
               // setData(dataToStore);
            } else {
               console.log('Invalid Json, or failure');
            }
         })
         .catch((err: any) => {
            console.log('err:', err);
         });
   };

   useEffect(() => {
      if (!initialLoadData && !isCollapsed) {
         loadProposals();
         setInitialLoadData(true);
      }
   }, [isCollapsed, initialLoadData]);

   const handleHrefButton = () => {
      console.log('Button w/ href clicked!');
      console.log('Now, rerouting will occur!');
   };

   return (
      <Panel
         title='Proposals'
         titleIconName='Clipboard'
         titleIconColor='pink'
         collapsible
         isCollapsed
         onCollapseBtnClick={(e: any) => {
            setIsCollapsed((prevState: boolean) => !prevState);
         }}>
         <Grid rowGap={30}>
            <Grid>
               <div className='flex flex-row justify-between items-end'>
                  <span className='pl-[10px] text-[16px] text-lum-gray-700 dark:text-lum-white'>Proposals</span>
                  <Button
                     size='sm'
                     color='gray'
                     onClick={(e: any) => {
                        e.preventDefault();
                        router.push(`/installs/proposals/new?lead=${lead.id}`);
                     }}>
                     New Proposal
                  </Button>
               </div>
               {!!data.length ? (
                  <Table
                     actions={[
                        {
                           icon: 'Edit',
                           actionKey: 'edit',
                           toolTip: 'Edit Proposal Option',
                           callback: handleActionClick,
                        },
                        {
                           icon: 'TrashCan',
                           actionKey: 'delete',
                           toolTip: 'Delete Proposal Option',
                           callback: handleActionClick,
                        },
                        {
                           icon: 'Duplicate',
                           actionKey: 'duplicate',
                           toolTip: 'Duplicate Proposal Option',
                           callback: handleActionClick,
                        },
                     ]}
                     columns={columns}
                     data={data}
                     onCellEvent={(e) => {
                        console.log('Checkbox', e);
                     }}
                     theme='secondary'
                  />
               ) : (
                  <div className='h-[40px] flex justify-center items-center bg-lum-gray-50 dark:bg-lum-gray-700'>
                     <span className='text-[14px] text-lum-gray-300 dark:text-lum-gray-500'>No Proposals</span>
                  </div>
               )}
            </Grid>
         </Grid>
      </Panel>
   );
};

export default LeadRecord;
