import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../../providers/PageProvider';
import ProductClient from './ProductClient';
import fs from 'fs';
import path from 'path';
import { camelCaseToTitleCase } from '../../../../../../utilities/helpers';
import { fetchDbApi } from '@/serverActions';

interface Props {
   params: { id: string };
   searchParams?: { type: string };
}

const Product = async ({ params }: Props) => {
   const productId = params.id !== 'new' ? params.id : null;
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   const iconsData: Array<any> = fetchIcons();

   const colorsData = [
      { displayName: 'Blue', iconConfig: { name: 'Rectangle', color: 'blue' } },
      { displayName: 'Cyan', iconConfig: { name: 'Rectangle', color: 'cyan' } },
      { displayName: 'Green', iconConfig: { name: 'Rectangle', color: 'green' } },
      { displayName: 'Yellow', iconConfig: { name: 'Rectangle', color: 'yellow' } },
      { displayName: 'Orange', iconConfig: { name: 'Rectangle', color: 'orange' } },
      { displayName: 'Red', iconConfig: { name: 'Rectangle', color: 'red' } },
      { displayName: 'Pink', iconConfig: { name: 'Rectangle', color: 'pink' } },
      { displayName: 'Purple', iconConfig: { name: 'Rectangle', color: 'purple' } },
      { displayName: 'Gray', iconConfig: { name: 'Rectangle', color: 'gray' } },
   ];

   let productDataRes: any = null;
   if (productId) productDataRes = await fetchProduct(authToken, productId);
   else {
      productDataRes = {
         fieldsOnProductCount: 0,
         tasksOnProductCount: 0,
         stagesOnProductCount: 7,
         stagesOnProductRequiredCount: 0,
         stagesOnProductOtherCount: 0,
         coordinatorsOnProductCount: 0,
      };
   }

   productDataRes = {
      ...productDataRes,
      // add these two keys regardless...
      // will split the stagesOnProduct whether they are required or other
      stagesOnProductRequired: [],
      stagesOnProductOther: [],
      // stagesOnProductRequired: [...productDataRes.stagesOnProduct].filter((stageOnProd: any) => stageOnProd.required),
      // stagesOnProductOther: [...productDataRes.stagesOnProduct].filter((stageOnProd: any) => !stageOnProd.required),

      coordinatorsOnProduct: [],
      fieldsOnProduct: [],
      stagesOnProduct: [],
      tasksOnProduct: [],
   };

   return (
      <PageProvider
         enablePageContext
         defaultPageContext={{
            product: productDataRes,
            icons: iconsData,
            colors: colorsData,

            // look up data... will fetch when needed
            coordinators: { fetched: false, data: [] },
            fields: { fetched: false, data: [] },
            tasks: { fetched: false, data: [] },
            stages: { fetched: false, data: [] },
            taskDueDateTypes: { fetched: false, data: [] },
            roles: { fetched: false, data: [] },
         }}>
         <ProductClient />
         {/* <ProductClient product={productDataRes} icons={iconsData} colors={colorsData} /> */}
      </PageProvider>
   );
};

export default Product;

const fetchProduct = async (token: string | undefined, productId: string) => {
   return await fetchDbApi(`/api/v2/products/${productId}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      console.log('err in product page with id:', productId, ' err -->', err);
   });
};

const fetchIcons = () => {
   // get icons from the component/icons directory
   return fs
      .readdirSync(path.resolve('common/components/icons'))
      .map((fileName) => {
         if (fileName !== 'index.ts' && fileName !== 'README.md' && !fileName.includes('Luminary')) {
            const tempFileName = fileName.split('.tsx')[0];
            const titleCaseFileName = camelCaseToTitleCase(tempFileName);
            return {
               iconName: tempFileName.trim(),
               displayName: titleCaseFileName.trim(),
               iconConfig: {
                  name: tempFileName.trim(),
                  color: 'gray:400',
               },
            };
         }
      })
      .filter((iconObj: any) => iconObj);
};
