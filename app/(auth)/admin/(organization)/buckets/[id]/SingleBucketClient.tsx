'use client';

import { useEffect, useState } from 'react';
import PageContainer from '../../../../../../common/components/page-container/PageContainer';
import Button from '../../../../../../common/components/button/Button';
import Grid from '../../../../../../common/components/grid/Grid';
import Tabs from '../../../../../../common/components/tabs/Tabs';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { setAddToast } from '../../../../../../store/slices/toast';
import { useRouter } from 'next/navigation';
import { selectUser } from '../../../../../../store/slices/user';
import LeadTable from '../(partials)/LeadTable';
import UsersTable from '../(partials)/UsersTable';
import Settings from '../(partials)/Settings';
import { Bucket } from '../(partials)/types';
import LoadingBackdrop from '../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import BucketLeadAndUserCount from '../(partials)/BucketLeadAndUserCount';
import LeadSourceConfig from '../(partials)/LeadSourceConfig';
import StatusConfig from '../(partials)/StatusConfig';
import { revalidate } from '@/serverActions';

const tabs = [
   { name: 'Leads', iconName: 'Target' },
   { name: 'Users', iconName: 'Users' },
   { name: 'Lead Sources', iconName: 'LeadSources' },
   { name: 'Statuses', iconName: 'Checklist' },
   { name: 'Settings', iconName: 'Gear' },
];

type Props = {
   bucketData: Bucket;
};

const createOrUpdateBucket = async (userAuthToken: string, payload: any, bucketId: string) => {
   let url, method;
   let headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${userAuthToken}` };
   if (bucketId === 'new') {
      url = '/api/v2/buckets';
      method = 'POST';
   } else {
      url = `/api/v2/buckets/${bucketId}`;
      method = 'PUT';
   }
   let request = await fetch(url, { method: method, headers: headers, body: JSON.stringify(payload) });
   let response = await request.json();
   return response;
};

const queryLeadsInBucket = async (
   token: any,
   leadSourceIds: any,
   statusIds: any,
   bucketId: any,
   bucketOrderCriteria: any
) => {
   let request = await fetch(`/api/v2/buckets/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
         leadSourceIds: leadSourceIds,
         statusIds: statusIds,
         bucketId: bucketId,
         bucketOrderCriteria: bucketOrderCriteria,
      }),
      cache: 'no-store',
   });
   return await request.json();
};

const SingleBucketClient = ({ bucketData }: Props) => {
   // console.log('bucketData: ', bucketData);
   const router = useRouter();
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const userAuthToken = user.token as string;

   const [bucketId, setBucketId] = useState<string>(bucketData.id);

   const [activeNavIndex, setActiveNavIndex] = useState<number>(0);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const [activeLeadSources, setActiveLeadSources] = useState<any[]>(bucketData.bucketLeadSources);
   const [activeStatuses, setActiveStatuses] = useState<any[]>(bucketData.bucketStatuses);
   const [isBucketActive, setIsBucketActive] = useState<boolean>(bucketData.isActive || false);
   const [activeBucketUsers, setActiveBucketUsers] = useState<any[]>(bucketData.bucketUsers);
   const [bucketName, setBucketName] = useState<string>(bucketData.name);
   const [isDefaultBucket, setIsDefaultBucket] = useState<boolean>(bucketData.isDefaultBucket);
   const [bucketType, setBucketType] = useState<any[]>([bucketData.bucketType]);
   const [orderCriteria, setOrderCriteria] = useState<any>(bucketData.orderCriteria || []);
   const [bucketLeadsCount, setBucketLeadsCount] = useState<number>(bucketData.numLeads);
   const [bucketLeadsApi, setBucketLeadsApi] = useState<any[]>([]);
   const [isLeadsTableLoading, setIsLeadsTableLoading] = useState<boolean>(true);

   // order leads correctly for table and get count when status and source change
   useEffect(() => {
      setIsLeadsTableLoading(true);
      const leadSourceIds = activeLeadSources.map((src: any) => src.id);
      const statusIds = activeStatuses.map((stat: any) => stat.id);
      queryLeadsInBucket(userAuthToken, leadSourceIds, statusIds, bucketId, orderCriteria).then((data: any) => {
         if (data) {
            console.log('data: ', data);
            setBucketLeadsCount(data.count ?? 0);
            setBucketLeadsApi(data.rows);
         }
      });
      setIsLeadsTableLoading(false);
   }, [activeLeadSources, activeStatuses]);

   const handleActiveLeadSourcesChange = (newActiveLeadSources: any[]) => {
      setActiveLeadSources(newActiveLeadSources);
   };

   const handleActiveStatusChange = (activeStatuses: any[]) => {
      setActiveStatuses(activeStatuses);
   };

   const handleActiveUsersChange = (newActiveBucketUsers: any[]) => {
      setActiveBucketUsers(newActiveBucketUsers);
   };

   const handleBucketNameUpdate = (name: string) => {
      setBucketName(name);
   };

   const toggleActiveBucket = (isActive: boolean) => {
      setIsBucketActive(isActive);
   };

   const handleIsDefaultBucket = (isDefault: boolean) => {
      setIsDefaultBucket(isDefault);
   };

   const handleBucketTypeUpdate = (e: any, newBucketType: any) => {
      setBucketType([newBucketType]);
   };

   const generateOrderCriteria = () => {
      const combinedItems = [...activeLeadSources, ...activeStatuses];
      return combinedItems.map((item, index) => ({
         ...item,
         displayOrder: index + 1,
      }));
   };

   const handleOrderCriteriaUpdate = (updatedOrder: any) => {
      console.log('updatedOrder: ', updatedOrder);
      setOrderCriteria(updatedOrder);
      setIsLeadsTableLoading(true);
      const leadSourceIds = activeLeadSources.map((src: any) => src.id);
      const statusIds = activeStatuses.map((stat: any) => stat.id);
      queryLeadsInBucket(userAuthToken, leadSourceIds, statusIds, bucketId, updatedOrder).then((data: any) => {
         if (data) {
            console.log('data: ', data);
            setBucketLeadsCount(data.count ?? 0);
            setBucketLeadsApi(data.rows);
         }
      });
      setIsLeadsTableLoading(false);
   };

   const handleSaveBucket = async (userAuthToken: string) => {
      setIsLoading(true);
      const bucketUsers = activeBucketUsers.map((user: any) => user.id);
      const bucketSources = activeLeadSources.map((source: any) => source.id);
      const bucketStatuses = activeStatuses.map((status: any) => status.id);
      const bucketOrderCriteria = orderCriteria.sort((a: any, b: any) => a.displayOrder - b.displayOrder);

      const payload = {
         bucketUsers: bucketUsers,
         bucketSources: bucketSources,
         bucketStatuses: bucketStatuses,
         bucketType: bucketType,
         bucketName: bucketName,
         isDefaultBucket: isDefaultBucket,
         isActive: isBucketActive,
         orderCriteria: bucketOrderCriteria,
      };

      console.log('payload: ', payload);

      // Validate that bucketName, bucketType
      if (payload.bucketType[0].id === '') {
         dispatch(
            setAddToast({
               details: [{ label: 'Error', text: 'Bucket type is required' }],
               iconName: 'Warning',
               autoCloseDelay: 5,
            })
         );
         setIsLoading(false);
         return;
      }

      const request = await createOrUpdateBucket(userAuthToken, payload, bucketId);
      console.log('request: ', request);
      if (request.status === 200) {
         await revalidate({ path: '/admin/buckets' });
         router.push('/admin/buckets');
         setIsLoading(false);
         dispatch(
            setAddToast({
               details: [{ label: 'Success', text: 'Bucket successfully saved!' }],
               iconName: 'CheckMarkCircle',
               variant: 'success',
               autoCloseDelay: 5,
            })
         );
      }
   };

   return (
      <PageContainer
         breadcrumbsTitle={bucketData.name}
         breadcrumbsChildren={
            <Grid columnCount={2} columnGap={10}>
               <Button color='blue' onClick={() => handleSaveBucket(userAuthToken)}>
                  Save
               </Button>
               <Button
                  color='gray'
                  onClick={() => {
                     router.push(`/admin/buckets`);
                  }}>
                  Cancel
               </Button>
            </Grid>
         }>
         <Grid>
            <BucketLeadAndUserCount
               activeBucketUsers={activeBucketUsers}
               bucketLeadsCount={bucketLeadsCount}
               bucketName={bucketName}
               isBucketActive={isBucketActive}
               handleToggleBucketActive={toggleActiveBucket}
            />

            <Tabs tabs={tabs} activeTabIndex={activeNavIndex} setActiveTabIndex={setActiveNavIndex} />

            {activeNavIndex === 0 ? (
               <LeadTable bucketLeads={bucketLeadsApi} isLeadsTableLoading={isLeadsTableLoading} />
            ) : activeNavIndex === 1 ? (
               <UsersTable onActiveUserChange={handleActiveUsersChange} activeBucketUsers={activeBucketUsers} />
            ) : activeNavIndex === 2 ? (
               <LeadSourceConfig
                  onActiveLeadSourcesChange={handleActiveLeadSourcesChange}
                  activeLeadSources={activeLeadSources}
               />
            ) : activeNavIndex === 3 ? (
               <StatusConfig onActiveStatusesChange={handleActiveStatusChange} activeStatuses={activeStatuses} />
            ) : activeNavIndex === 4 ? (
               <>
                  <Settings
                     bucketName={bucketName}
                     bucketType={bucketType}
                     activeLeadSources={activeLeadSources}
                     activeStatuses={activeStatuses}
                     isDefaultBucket={isDefaultBucket}
                     orderCriteria={orderCriteria}
                     onBucketNameUpdate={handleBucketNameUpdate}
                     onDefaultBucketUpdate={handleIsDefaultBucket}
                     onBucketTypeUpdate={handleBucketTypeUpdate}
                     onBucketOrderUpdate={handleOrderCriteriaUpdate}
                  />
                  <LeadTable bucketLeads={bucketLeadsApi} isLeadsTableLoading={isLeadsTableLoading} />
               </>
            ) : null}

            <LoadingBackdrop isOpen={isLoading} zIndex={101} />
         </Grid>
      </PageContainer>
   );
};

export default SingleBucketClient;
