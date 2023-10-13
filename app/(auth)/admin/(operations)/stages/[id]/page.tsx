import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../../providers/PageProvider';
import StageClient from './StageClient';
import { fetchDbApi } from '@/serverActions';

interface Props {
   params: { id: string };
   searchParams?: { type: string };
}

const Stage = async ({ params }: Props) => {
   const stageId = params.id !== 'new' ? params.id : null;
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   let stageDataRes: any = null;
   if (stageId) {
      stageDataRes = fetchStage(authToken, stageId);
   } else {
      stageDataRes = { name: null, stageType: null, stageTypeId: null, webhookUrl: null };
   }

   // get stage types
   const stageTypesRes = fetchStageTypes(authToken);

   const [stageData, stageTypes] = await Promise.allSettled([stageDataRes, stageTypesRes])
      .then(handleResults)
      .catch((err) => {
         console.log('err', err);
      });

   return (
      <PageProvider>
         <StageClient stage={stageData} stageTypes={stageTypes} />
      </PageProvider>
   );
};

export default Stage;

const fetchStage = async (token: string | undefined, stageId: number | string) => {
   return await fetchDbApi(`/api/v2/products/stages/${stageId}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      console.log('err in stage with id:', stageId, ' err -->', err);
   });
};

const fetchStageTypes = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/stage-types`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
   }).catch((err) => {
      console.log('err fetching stage types...', err);
   });
};

const handleResults = (results: any) => results.map((result: any) => result.status === 'fulfilled' && result.value);
