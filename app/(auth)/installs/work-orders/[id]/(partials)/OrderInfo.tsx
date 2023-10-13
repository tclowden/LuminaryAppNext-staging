'use client';
import Link from 'next/link';
import React from 'react';
import KeyValue from '../../../../../../common/components/key-value/KeyValue';
import Hr from '../../../../../../common/components/hr/Hr';
import Panel from '../../../../../../common/components/panel/Panel';
import Grid from '../../../../../../common/components/grid/Grid';
import { useAppSelector } from '../../../../../../store/hooks';
import { selectPageContext } from '../../../../../../store/slices/pageContext';
import { convertNumberToCurrency, formatPostgresTimestamp } from '@/utilities/helpers';

interface Props {}

const OrderInfo = ({}: Props) => {
   const { order, currStageOnProduct, fieldsOnProduct } = useAppSelector(selectPageContext);

   // filter out all the fields on orders that have no answer to them
   const fieldsOnOrders = fieldsOnProduct
      .map((fieldOnProd: any) => {
         const foundFieldOnOrder = order?.fieldsOnOrder?.find(
            (fieldOnOrder: any) => fieldOnOrder?.fieldOnProductId === fieldOnProd?.id
         );

         const fieldOnOrderHasConstraint =
            foundFieldOnOrder?.fieldOnProduct?.stageOnProductConstraintId === currStageOnProduct?.id;
         const fieldOnProdHasConstraint = fieldOnProd?.stageOnProductConstraintId === currStageOnProduct?.id;

         if (foundFieldOnOrder && fieldOnOrderHasConstraint) return { ...foundFieldOnOrder, requiredThisStage: true };
         else if (foundFieldOnOrder && !fieldOnOrderHasConstraint) return foundFieldOnOrder;
         else if (!foundFieldOnOrder && fieldOnProdHasConstraint)
            return {
               answer: '',
               id: null,
               fieldOnProduct: fieldOnProd,
               fieldOnProductId: fieldOnProd?.id,
               orderId: order?.id,
               requiredThisStage: true,
            };
         else return undefined;
      })
      .filter((fOO: any) => fOO);
   // const fieldsOnOrders = [...order?.fieldsOnOrder].filter((fOO: any) => (fOO?.answer && fOO?.answer?.length > 0) || fOO?.requiredThisStage);

   // const utilCompany = fieldsOnOrders?.find(
   //    (fieldOnOrder: any) => fieldOnOrder?.fieldOnProduct?.productField === 'Utility Company'
   // );
   // const financier = fieldsOnOrders?.find(
   //    (fieldOnOrder: any) => fieldOnOrder?.fieldOnProduct?.productField === 'Financing Option'
   // );
   // const dealerFee = fieldsOnOrders?.find(
   //    (fieldOnOrder: any) => fieldOnOrder?.fieldOnProduct?.productField === 'Dealer Fee'
   // );

   return (
      <Panel title={`Order Info`} titleSize={'md'} collapsible>
         <Grid rowGap={24}>
            {/*  */}
            <Grid columnCount={4}>
               <Grid rowGap={0}>
                  <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Product</div>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>{order?.product?.name || ''}</div>
               </Grid>
               <Grid rowGap={0}>
                  <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Order Number</div>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>{order?.id || ''}</div>
               </Grid>
               <Grid rowGap={0}>
                  <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Purchase Date</div>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>{order?.firstFundedAt || ''}</div>
               </Grid>
               <Grid rowGap={0}>
                  <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Sales Rep</div>
                  <Link className='text-lum-blue-500 text-[16px]' href={`/admin/users/${order?.owner?.id}`}>
                     {order?.owner?.fullName || ''}
                  </Link>
               </Grid>
            </Grid>

            <Hr className='-ml-[20px] w-[calc(100%+40px)]' />

            {/*  */}
            {/* <Grid columnCount={4}>
               <Grid rowGap={0}>
                  <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>
                     Selected Proposal
                  </div>
                  <Link className='text-lum-blue-500 text-[16px]' href={''}>
                     {order?.proposalName || ''}
                  </Link>
               </Grid>
               <Grid rowGap={0}>
                  <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Utility Company</div>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>{order?.utilityCompany?.name}</div>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>{utilCompany?.name}</div>
               </Grid>
               <Grid rowGap={0}>
                  <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Lender</div>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>{order?.financier?.name}</div>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>{financier?.name}</div>
               </Grid>
               <Grid rowGap={0}>
                  <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Dealer Fee</div>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>{order?.financier?.fee}</div>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>{dealerFee?.name}</div>
               </Grid>
            </Grid> */}

            {/* <Hr className='-ml-[20px] w-[calc(100%+40px)]' /> */}

            {/* PRODUCT FIELDS */}
            <Grid columnCount={2} rowGap={5}>
               {!!fieldsOnOrders?.length &&
                  [...Object.keys(fieldsOnOrders)].map((key, index) => {
                     const obj = fieldsOnOrders[key as keyof object];
                     let objKey = obj?.fieldOnProduct?.productField?.label;

                     let objVal = null;
                     const fieldType = obj?.fieldOnProduct?.productField?.fieldType?.name;
                     switch (fieldType) {
                        case 'Date':
                           objVal = formatPostgresTimestamp(obj?.answer);
                           break;
                        case 'Currency':
                           objVal = convertNumberToCurrency(obj?.answer);
                           break;
                        default:
                           objVal = obj?.answer;
                           break;
                     }

                     if ((obj?.requiredThisStage && !objVal) || objVal?.length < 1)
                        objVal = <span className='text-lum-red-500'>REQUIRED</span>;

                     return <KeyValue key={index} objectKey={objKey} objectValue={objVal} />;
                  })}
            </Grid>
         </Grid>
      </Panel>
   );
};

export default OrderInfo;
