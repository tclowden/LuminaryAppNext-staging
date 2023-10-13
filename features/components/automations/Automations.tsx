'use client';
import React, { useCallback, useEffect, useState } from 'react';
import PageContainer from '@/common/components/page-container/PageContainer';
import Button from '@/common/components/button/Button';
import Tabs from '@/common/components/tabs/Tabs';
import AutomationEditor from './automationEditor/AutomationEditor';
import AutomationRuns from './AutomationRuns';
import useForm from '@/common/hooks/useForm';
import * as Yup from 'yup';
import { fetchDbApi, revalidate } from '@/serverActions';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';

const Automations = ({ type, automationData }: { type: 'operations' | 'marketing'; automationData?: any }) => {
   const searchParams = useSearchParams();
   const searchTab = searchParams.get('tab');

   const [automationInit, setAutomationInit] = useState<any>(null);

   const router = useRouter();
   const pathname = usePathname();
   const params = useParams();
   const user = useAppSelector(selectUser);

   const tabs = params?.id === 'new' ? [{ name: 'Flow' }] : [{ name: 'Flow' }, { name: 'Leads In Flow' }];

   useEffect(() => {
      setAutomationInit(
         automationData ?? {
            name: 'New Automation',
            type: type,
            segment: [],
            triggers: [],
            actions: [],
         }
      );

      return () => {};
   }, [automationData]);

   // Get a new searchParams string by merging the current
   // searchParams with a provided key/value pair
   const createQueryString = useCallback(
      (name: string, value: string) => {
         const params = new URLSearchParams(searchParams);
         params.set(name, value);

         return params.toString();
      },
      [searchParams]
   );

   const handleSave = async () => {
      let apiUrl = '/api/v2/automations/';
      if (automationData?.id === 'new') {
         apiUrl = '/api/v2/automations/';
      } else if (automationData?.id) {
         apiUrl = `/api/v2/automations/${automationData?.id}`;
      }
      console.log('Save automation', automationForm.values);
      console.log('stringify', JSON.stringify(automationForm.values));

      console.log('apiUrl', apiUrl);
      const method = automationData?.id ? 'PUT' : 'POST';

      console.log('method', method);
      const request = await fetch(apiUrl, {
         method: automationData?.id ? 'PUT' : 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
         },
         body: JSON.stringify(automationForm.values),
      });

      const response = await request.json();

      console.log('Save automation', response);

      if (response.status === 200) {
         const url = pathname.substring(0, pathname.lastIndexOf('/'));
         await revalidate({ path: url });
         router.push(url);
      }

      // fetchDbApi(
      //    apiUrl,
      //    {
      //       method: automationData?.id ? 'PUT' : 'POST',
      //       body: JSON.stringify(automationForm.values),
      //    },
      //    false
      // )
      //    .then((res) => {
      //       console.log('Save automation', res);
      //       const url = pathname.substring(0, pathname.lastIndexOf('/'));
      //       revalidate({ path: url });
      //       router.push(url);
      //       // await revalidate({ path: url }).then(() => { router.push(url) })
      //    })
      //    .catch((err) => {
      //       console.log(err);
      //    });
   };

   const automationForm = useForm({
      initialValues: {},
      validationSchema: { name: Yup.string().required() },
      onSubmit: handleSave,
   });

   return (
      <PageContainer
         breadcrumbsChildren={
            <>
               <Button color='blue' onClick={automationForm.handleSubmit}>
                  Save
               </Button>
               <Button
                  color='white'
                  onClick={() => {
                     router.back();
                  }}>
                  Cancel
               </Button>
            </>
         }>
         <div className='flex flex-col gap-4'>
            <Tabs
               tabs={tabs}
               activeTabIndex={searchTab ? +searchTab : 0}
               setActiveTabIndex={(e) => {
                  router.replace(pathname + '?' + createQueryString('tab', `${e}`));
               }}
            />
            {searchTab !== '1' && automationInit && (
               <AutomationEditor automationInit={automationInit} automationForm={automationForm} />
            )}
            {searchTab === '1' && automationInit && <AutomationRuns automationId={automationInit.id} />}
         </div>
      </PageContainer>
   );
};

export default Automations;
