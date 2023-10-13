import axios from 'axios';
import React from 'react';
import WorkOrderClient from './WorkOrderClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PageProvider from '../../../../../providers/PageProvider';
import { fetchDbApi } from '@/serverActions';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';

interface Props {
   params: { id: string };
   searchParams?: { type: string };
}

const WorkOrder = async ({ params, searchParams }: Props) => {
   // make our call based on the id & get all the work order data
   const { id } = params;
   if (!id) return redirect('installs/work-orders');
   const cookiesInstance = cookies();
   const authToken = cookiesInstance.get('LUM_AUTH')?.value;

   let orderData: any = await getOrderData(authToken, id);
   let attachmentTypes: any = [];

   let allLeadOrders: any = [];
   let stagesOnProduct: any = [];
   let coordinatorsOnProduct: any = [];
   let fieldsOnProduct: any = [];
   let notificationTypes: any = [];

   let currProductStageId = null;
   let currStageOnProduct = null;

   // handle an error if the order isn't found by id
   if (!orderData || orderData?.errorMessage) throw new LumError(orderData?.statusCode, orderData?.errorMessage);

   if (orderData) {
      allLeadOrders = getAllLeadOrders(authToken, orderData?.leadId);
      stagesOnProduct = getStagesOnProduct(authToken, orderData?.productId);
      coordinatorsOnProduct = getCoordinatorsOnProduct(authToken, orderData?.productId);
      fieldsOnProduct = getFieldsOnProduct(authToken, orderData?.productId);

      attachmentTypes = getAttachmentTypes(authToken);
      notificationTypes = getNotificationTypes(authToken);

      [allLeadOrders, stagesOnProduct, coordinatorsOnProduct, fieldsOnProduct, attachmentTypes, notificationTypes] =
         await Promise.allSettled([
            allLeadOrders,
            stagesOnProduct,
            coordinatorsOnProduct,
            fieldsOnProduct,
            attachmentTypes,
            notificationTypes,
         ])
            .then(handleResults)
            .catch((err) => {
               console.log('err', err);
            });

      currProductStageId = orderData?.productStageId;
      currStageOnProduct = stagesOnProduct?.find(
         (stageOnProd: any) => stageOnProd?.productStageId === orderData?.productStageId
      );
   }

   return (
      <PageProvider
         enablePageContext
         defaultPageContext={{
            order: orderData,

            allLeadOrders,
            stagesOnProduct,
            coordinatorsOnProduct,
            fieldsOnProduct,

            attachmentTypes,
            notificationTypes,

            currentProductStageId: currProductStageId,
            currStageOnProduct: currStageOnProduct,
         }}>
         <WorkOrderClient />
      </PageProvider>
   );
};

export default WorkOrder;

const getOrderData = async (token: string | undefined, orderId: string) => {
   return await fetchDbApi(`/api/v2/orders/${orderId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      console.log('err:', err);
   });
};

const getAllLeadOrders = async (token: string | undefined, leadId: string) => {
   return await fetchDbApi(`/api/v2/leads/${leadId}/orders`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      console.log('err:', err);
   });
};

const getStagesOnProduct = async (token: string | undefined, productId: string) => {
   return await fetchDbApi(`/api/v2/products/${productId}/stages`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      console.log('err:', err);
   });
};

const getCoordinatorsOnProduct = async (token: string | undefined, productId: string) => {
   return await fetchDbApi(`/api/v2/products/${productId}/coordinators`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      console.log('err:', err);
   });
};

const getFieldsOnProduct = async (token: string | undefined, productId: string) => {
   return await fetchDbApi(`/api/v2/products/${productId}/fields`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      console.log('err:', err);
   });
};

const getAttachmentTypes = async (token: string | undefined) => {
   return fetchDbApi(`/api/v2/attachment-types/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ where: { '[Op.or]': [{ name: 'Work Order' }, { name: 'Install Agreement' }] } }),
   }).catch((err: any) => {
      console.log('err:', err);
   });
};

const getNotificationTypes = async (token: string | undefined) => {
   return fetchDbApi(`/api/v2/notification-types`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
   }).catch((err: any) => {
      console.log('err:', err);
   });
};

const handleResults = (results: any) =>
   results.map((result: any) => {
      return result.status === 'fulfilled' && deepCopy(result.value);
   });
