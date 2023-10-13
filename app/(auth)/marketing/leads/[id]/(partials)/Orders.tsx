import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DropDown from '../../../../../../common/components/drop-down/DropDown';
import Grid from '../../../../../../common/components/grid/Grid';
import Modal from '../../../../../../common/components/modal/Modal';
import Panel from '../../../../../../common/components/panel/Panel';
import useForm, { YupSchemaObject } from '../../../../../../common/hooks/useForm';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { selectPageContext, setPageContext } from '../../../../../../store/slices/pageContext';
import { selectUser } from '../../../../../../store/slices/user';
import FieldsOnOrder from './(orders-partials)/FieldsOnOrder';
import { setAddToast } from '../../../../../../store/slices/toast';
import OrderPanel from './(orders-partials)/OrderPanel';
import { fetchDbApi, triggerAutomation } from '@/serverActions';
import PanelLoader from '@/common/components/skeleton-loaders/PanelLoader';
import { convertNumberToCurrency, deepCopy } from '@/utilities/helpers';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';
import { LumError } from '@/utilities/models/LumError';

const initEditOrderConfig: any = { total: 0.0, product: null, fieldsOnOrder: [], editMode: false, id: null };
const fieldsOnOrderSchema = Yup.object().shape({
   answerIsRequired: Yup.boolean().required(),
   answer: Yup.string()
      .when('answerIsRequired', {
         is: true,
         then: (schema: any) => Yup.string().min(1).required('Answer is Required'),
         otherwise: (schema: any) => Yup.string(),
      })
      .required(`Answer is required`),
});

const defaultValSchema: YupSchemaObject<any> = {
   product: Yup.object().required('Product is required'),
   fieldsOnOrder: Yup.array().of(fieldsOnOrderSchema).required(`Fields On Product is Required...`),
};

interface Props { }
const Orders = ({ }: Props) => {
   const contextData = useAppSelector(selectPageContext);
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const router = useRouter();

   const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
   const [initialLoadData, setInitialLoadData] = useState<boolean>(false);
   const [openEditOrderModal, setOpenEditOrderModal] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [debouncingValue, setDeboucingValue] = useState<boolean>(false);
   const [totalAmount, setTotalAmount] = useState<any>();

   useEffect(() => {
      if (!initialLoadData && !isCollapsed) {
         setIsLoading(true);
         setInitialLoadData(true);
         const fetchData = async () => {
            const orders = await getOrders().then((ordersRes: Array<any>) => {
               return ordersRes.map((order: any) => ({
                  ...order,
               }));
            });

            console.log('orders:', orders);

            // here in the result of the products
            // need to filter the proposalOptions where the leadId matches
            const products = await getProducts();

            dispatch(
               setPageContext({
                  // ...contextData,
                  orders: [...orders],
                  products: [...products],
               })
            );
            setIsLoading(false);
         };
         fetchData();
      }
   }, [isCollapsed, initialLoadData]);

   const getOrders = async () => {
      // lumFetch({ url, method, authToken, body, contentType })
      // get the order data by the lead Id
      const leadId = contextData.lead?.id;
      return await fetchDbApi(`/api/v2/leads/${leadId}/orders`, {
         method: 'GET',
         headers: { Authorization: `Bearer ${user.token}` },
      }).catch((err) => {
         console.error('err:', err);
      });
   };

   const getProducts = async () => {
      return await fetchDbApi(`/api/v2/products`, {
         method: 'GET',
         headers: { Authorization: `Bearer ${user.token}` },
      }).catch((err) => {
         console.error('err:', err);
      });
   };

   const getTotalAmount = (fieldsOnOrder: Array<any>, fieldsOnProduct: Array<any>) => {
      return fieldsOnOrder
         .map((fieldOnOrder: any) => {
            // const foundCurrencyFieldOnProd = fieldsOnProduct.find((fieldOnProd: any) => {
            //    if (
            //       fieldOnProd.productFieldId === fieldOnOrder.productFieldId &&
            //       fieldOnProd.productField.fieldType.name === 'Currency'
            //    )
            //       return fieldOnProd;
            // });
            const foundCurrencyFieldOnProd = fieldsOnProduct.find((fieldOnProd: any) => {
               if (
                  fieldOnProd.id === fieldOnOrder.fieldOnProductId &&
                  fieldOnProd.productField.fieldType.name === 'Currency'
               )
                  return fieldOnProd;
            });
            if (foundCurrencyFieldOnProd) return +fieldOnOrder?.answer;
         })
         .filter((answer: number | undefined) => answer)
         .reduce((total: any, acc: any) => total + acc, 0);
   };

   const handleArchiveOrder = async (orderToArchive: any) => {
      const userAuthToken = user?.token;
      if (!orderToArchive?.id || !userAuthToken) return;

      // archive the order by the id
      await fetchDbApi(`/api/v2/orders/${orderToArchive.id}`, {
         method: 'DELETE',
         headers: { Authorization: `Bearer ${userAuthToken}` },
      })
         .then((res: any) => {
            dispatch(
               setPageContext({
                  orders: [...contextData.orders].filter((order: any) => order.id !== orderToArchive.id),
               })
            );
            dispatch(
               setAddToast({
                  details: [{ label: 'Success', text: 'Order Successfully Deleted' }],
                  iconName: 'CheckMarkCircle',
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
         })
         .catch((err: any) => {
            console.log('err', err);
            const errMsg = err.response?.data?.error?.errorMessage || 'Changes Not Saved';
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: errMsg }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const handleSaveOrder = async (e: any, updatedOrder: any) => {
      // NOT DONE
      setIsSaving(true);
      const dataToSave = deepCopy(updatedOrder);
      const userAuthToken = user?.token;

      // add leadId to the order
      dataToSave['leadId'] = contextData?.lead?.id || null;

      // delete unnecessary keys
      delete dataToSave['product'];

      if (!!dataToSave?.fieldsOnOrder.length) {
         // get new total amount to save
         // grab all the currency input types and add up
         dataToSave['total'] = getTotalAmount(
            dataToSave?.fieldsOnOrder,
            [...dataToSave?.fieldsOnOrder].map((fOO: any) => fOO.fieldOnProduct)
         );

         // filter out all the unncessary fieldsOnOrders... just where there is no answer
         // then delete unnecessary keys
         dataToSave['fieldsOnOrder'] = dataToSave?.fieldsOnOrder
            .filter(
               (fieldOnOrder: any) => (fieldOnOrder?.answer && fieldOnOrder?.answer?.length > 0) || fieldOnOrder?.id
            )
            .map((fieldOnOrder: any) => {
               delete fieldOnOrder['answerIsRequired'];
               delete fieldOnOrder['fieldOnProduct'];
               delete fieldOnOrder['orderId'];
               if (fieldOnOrder?.answer?.length === 0) fieldOnOrder['answer'] = null;
               return fieldOnOrder;
            });
      }

      // default tasksOnOrder, stagesOnOrder to an empty array
      dataToSave['tasksOnOrder'] = [];
      dataToSave['stagesOnOrder'] = [];

      console.log('dataToSave:', dataToSave);

      try {
         let result = null;
         if (dataToSave.id) {
            // find currentSaveOrder in the db / contextData
            const currSavedOrder = contextData?.orders?.find((order: any) => order.id === editOrderConfig.id);
            // need to make sure to 'archive: true' the fieldsOnOrder if the product changed if the current saved order product id does not equal to the updated product id
            if (currSavedOrder && currSavedOrder?.productId !== dataToSave?.productId) {
               const fieldsOnOrderToArchive = currSavedOrder.fieldsOnOrder.map((fieldOnOrder: any) => ({
                  ...fieldOnOrder,
                  archived: true,
               }));
               dataToSave['fieldsOnOrder'] = [...dataToSave.fieldsOnOrder, ...fieldsOnOrderToArchive];
            }

            // updating an order
            const url = `/api/v2/orders/${dataToSave.id}`;
            result = await fetchDbApi(url, {
               method: 'PUT',
               headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
               body: JSON.stringify(dataToSave),
            });
         } else {
            // creating an order
            const url = `/api/v2/orders`;
            // add createdById to the order
            dataToSave['createdById'] = user?.id;
            // add ownerId to the order
            dataToSave['ownerId'] = contextData?.lead?.ownerId || user?.id;

            // delete the id key cause it will always be null here
            delete dataToSave['id'];
            result = await fetchDbApi(url, {
               method: 'POST',
               headers: { Authorization: `Bearer ${userAuthToken}`, 'Content-Type': 'application/json' },
               body: JSON.stringify(dataToSave),
            });
         }

         if (!result?.errors?.length) {
            // refetch the orders
            const tempOrders = await getOrders();
            dispatch(setPageContext({ orders: tempOrders }));

            // reset useForm state
            // resetEditOrderConfig(initEditOrderConfig);
            setOpenEditOrderModal(false);
            resetEditOrderConfig(initEditOrderConfig);

            setTimeout(() => {
               setIsSaving(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Product Successfully Saved' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);

            triggerAutomation.fire('order_created', {
               leadId: contextData?.lead?.id,
               executorId: user?.id,
               newValue: result?.id,
               prevValue: '',
               orderId: result?.id,
            });

         } else throw new LumError(400, result?.errors[0] || result?.message);
      } catch (err: any) {
         console.log('err saving order', err);
         setIsSaving(false);
         const errMsg = err.response?.data?.error?.errorMessage || 'Error: Changed Not Saved';
         dispatch(
            setAddToast({
               iconName: 'XMarkCircle',
               details: [{ label: 'Error', text: errMsg }],
               variant: 'danger',
               autoCloseDelay: 5,
            })
         );
      }
   };

   const {
      handleBlur,
      handleChange,
      handleSubmit,
      values: editOrderConfig,
      setValue,
      resetTouched,
      resetValues: resetEditOrderConfig,
      errors: editOrderConfigErrors,
      setMultiValues: setEditOrderConfig,
   } = useForm({
      initialValues: initEditOrderConfig,
      validationSchema: defaultValSchema,
      onSubmit: handleSaveOrder,
   });

   useEffect(() => {
      // do this in useEffect so we only do the math when needed & not every single render...
      // get the total accumulated amount of every field on order that is a currency type
      const tempTotalAmount = convertNumberToCurrency(
         getTotalAmount(editOrderConfig?.fieldsOnOrder, editOrderConfig?.product?.fieldsOnProduct)
      );
      setTotalAmount(tempTotalAmount);
   }, [editOrderConfig?.fieldsOnOrder, editOrderConfig?.product?.fieldsOnProduct]);

   return (
      <>
         <Panel
            title='Orders'
            titleIconName='PriceTag'
            titleIconColor='blue'
            collapsible
            isCollapsed
            onCollapseBtnClick={(e: any) => {
               setIsCollapsed((prevState: boolean) => !prevState);
            }}
            showChildButton={!isLoading}
            childButtonText='Add Order'
            // if no products to choose from, disable the btn
            disableChildButton={!!!contextData?.products?.length}
            childButtonCallback={(e: any) => {
               setOpenEditOrderModal(!openEditOrderModal);
            }}>
            {isLoading ? (
               <PanelLoader count={2} />
            ) : !!contextData?.orders?.length ? (
               <Grid>
                  {contextData.orders.map((order: any, i: number) => (
                     <React.Fragment key={i}>
                        <OrderPanel
                           order={order}
                           products={contextData?.products}
                           handleArchiveOrder={handleArchiveOrder}
                           setOpenEditOrderModal={setOpenEditOrderModal}
                           setEditOrderConfig={setEditOrderConfig}
                        />
                     </React.Fragment>
                  ))}
               </Grid>
            ) : (
               <>No Orders</>
            )}
         </Panel>
         {/* {console.log('editOrderConfig:', editOrderConfig)} */}
         <Modal
            isOpen={openEditOrderModal}
            onClose={(e: any) => {
               // warning close modal here...
               setOpenEditOrderModal(false);
               resetEditOrderConfig(initEditOrderConfig);
            }}
            size='default'
            zIndex={100}
            title={'Add Order'}
            primaryButtonText={editOrderConfig?.editMode ? 'Update' : 'Save'}
            primaryButtonCallback={handleSubmit}
            disablePrimaryButton={
               debouncingValue || !editOrderConfig?.product || !editOrderConfig?.fieldsOnOrder?.length
            }
            // disablePrimaryButton={
            //    contextData?.debouncingValue || !editOrderConfig?.product || !editOrderConfig?.fieldsOnOrder?.length
            // }
            customFooter={
               <div className='col-start-1 justify-start'>
                  <div className='flex gap-1'>
                     <span>Total:</span>
                     <span>{totalAmount}</span>
                  </div>
               </div>
            }>
            <Grid columnCount={1}>
               <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Order Info</div>
               <DropDown
                  label='Product'
                  options={contextData?.products}
                  selectedValues={editOrderConfig?.product ? [editOrderConfig?.product] : []}
                  keyPath={['name']}
                  name='product'
                  placeholder='Select Product'
                  onOptionSelect={(e: any, selectedProduct: any) => {
                     // if they click the same product, don't do anything
                     if (selectedProduct.id === editOrderConfig?.productId) return;
                     // when changing the product, we will need to reset the fieldsOnOrder within the editOrderConfig
                     // no changes are saved until they hit the save btn
                     // setEditOrderConfig({ ...initEditOrderConfig });
                     setEditOrderConfig({ fieldsOnOrder: [] });
                     handleChange({ target: { type: 'text', name: 'productId', value: selectedProduct.id } });
                     handleChange({ target: { type: 'text', name: 'product', value: selectedProduct } });
                  }}
                  onBlur={handleBlur}
                  errorMessage={editOrderConfigErrors?.product}
                  required
                  disabled={!!!contextData?.products?.length}
               />
               {editOrderConfig?.product && (
                  <>
                     <FieldsOnOrder
                        editOrderConfig={editOrderConfig}
                        editOrderConfigErrors={editOrderConfigErrors}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        resetTouched={resetTouched}
                        setDebouncingValue={setDeboucingValue}
                     />
                  </>
               )}
            </Grid>
         </Modal>
         <LoadingBackdrop isOpen={isSaving} zIndex={105} />
      </>
   );
};

export default Orders;
