'use client';
import React, { useState } from 'react';
import Button from '../../../../../../../common/components/button/Button';
import ConfirmModal from '../../../../../../../common/components/confirm-modal/ConfirmModal';
import Grid from '../../../../../../../common/components/grid/Grid';
import Hr from '../../../../../../../common/components/hr/Hr';
import Icon from '../../../../../../../common/components/Icon';
import KeyValue from '../../../../../../../common/components/key-value/KeyValue';
import { revalidate } from '@/serverActions';
import { useRouter } from 'next/navigation';
import { convertNumberToCurrency } from '@/utilities/helpers';

interface Props {
   order: any;
   products: Array<any>;
   handleArchiveOrder: (order: any) => void;
   setOpenEditOrderModal: (prevState: boolean) => void;
   setEditOrderConfig: (values: any) => void;
}

const OrderPanel = ({ order, products, handleArchiveOrder, setOpenEditOrderModal, setEditOrderConfig }: Props) => {
   const router = useRouter();
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

   const handleActionClick = (e: any, actionKey: string, order: any) => {
      switch (actionKey) {
         case 'delete':
            setOpenConfirmModal(true);
            break;
         case 'edit':
            // using the products array, add the fieldsOnProductArray to the objct
            const currProductFieldsOnProduct = products?.find((prod: any) => prod.id === order?.product.id);
            const currProduct = { ...currProductFieldsOnProduct };

            setEditOrderConfig({
               ...order,
               product: currProduct,
               editMode: true,
            });
            setOpenEditOrderModal(true);
            break;
         default:
            break;
      }
   };

   return (
      <>
         <Grid rowGap={20} className={`bg-lum-gray-50 dark:bg-lum-gray-700 p-[20px] rounded`}>
            <Grid columnCount={5} className='items-center'>
               <Grid colSpan={4} columnCount={2} rowGap={20}>
                  <div>
                     <div className='uppercase text-[10px] text-lum-gray-500 dark:text-lum-gray-300'>Product</div>
                     <div className='flex flex-row items-center justify-start'>
                        <Icon
                           style={{ marginRight: '7px' }}
                           name={order?.product?.iconName ?? 'SolarPanel'}
                           color={order?.product?.iconColor ?? 'gray'}
                           width='18'
                        />
                        <span className='text-[16px] text-lum-gray-700 dark:text-lum-white'>
                           {order?.product?.name ?? ''}
                        </span>
                     </div>
                  </div>
                  <div>
                     <div className='uppercase text-[10px] text-lum-gray-500 dark:text-lum-gray-300'>Stage</div>
                     <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>
                        {order?.productStage?.name ?? 'N/A'}
                     </div>
                  </div>
                  <div>
                     <div className='uppercase text-[10px] text-lum-gray-500 dark:text-lum-gray-300'>
                        Install Address
                     </div>
                     <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>
                        {order?.installAddress ?? 'N/A'}
                     </div>
                  </div>
                  <div>
                     <div className='uppercase text-[10px] text-lum-gray-500 dark:text-lum-gray-300'>Order Total</div>
                     <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>
                        {convertNumberToCurrency(order?.total) ?? '$0.00'}
                     </div>
                  </div>
               </Grid>
               <Grid className='justify-self-end' colSpan={1} columnCount={4} columnGap={0}>
                  <Button iconName='MailOpen' color='transparent' tooltipContent={'Not sure?'} />
                  <Button
                     iconName='Eye'
                     color='transparent'
                     tooltipContent={'View Order'}
                     onClick={async (e: any) => {
                        if (order?.id) {
                           const url = `/installs/work-orders/${order?.id}`;
                           await revalidate({ path: url });
                           router.push(url);
                        }
                     }}
                  />
                  <Button
                     iconName='Edit'
                     color='transparent'
                     tooltipContent={'Edit Order'}
                     onClick={(e: any) => {
                        handleActionClick(e, 'edit', order);
                     }}
                  />
                  {/* <Button iconName='DocumentEdit' color='transparent' tooltipContent={'Edit Order'} /> */}
                  <Button
                     iconName='TrashCan'
                     color='transparent'
                     tooltipContent={'Delete Order'}
                     onClick={(e: any) => {
                        handleActionClick(e, 'delete', order);
                     }}
                  />
               </Grid>
            </Grid>
            {/* <Hr className='-ml-[20px] w-[calc(100%+40px)]' />
            {!!order?.fieldsOnOrder?.length && (
               <Grid columnCount={5}>
                  <Grid colSpan={4} columnCount={2} rowGap={0}>
                     {order.fieldsOnOrder.map((fieldOnOrder: any, index: number) => {
                        const key = fieldOnOrder?.fieldOnProduct?.productField?.label ?? 'Unknown';
                        return (
                           <KeyValue
                              className='hover:bg-lum-gray-100 dark:hover:bg-lum-gray-650'
                              key={index}
                              objectKey={key}
                              objectValue={fieldOnOrder['answer']}
                           />
                        );
                     })}
                  </Grid>
               </Grid>
            )} */}
         </Grid>
         <ConfirmModal
            open={openConfirmModal}
            handleOnClose={(e: any) => {
               setOpenConfirmModal(!openConfirmModal);
            }}
            handleOnConfirm={(e: any) => {
               setOpenConfirmModal(false);
               handleArchiveOrder(order);
            }}
            value={'order, "' + order?.product?.name + '"'}
         />
      </>
   );
};

export default OrderPanel;
