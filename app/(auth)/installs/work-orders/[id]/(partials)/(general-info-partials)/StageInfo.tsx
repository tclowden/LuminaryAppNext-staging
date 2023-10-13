'use client';
import Button from '@/common/components/button/Button';
import Grid from '@/common/components/grid/Grid';
import Hr from '@/common/components/hr/Hr';
import React, { useEffect, useState } from 'react';
import Modal from '@/common/components/modal/Modal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import Radio from '@/common/components/radio/Radio';
import { fetchDbApi, triggerAutomation } from '@/serverActions';
import { selectUser } from '@/store/slices/user';
import { setAddToast } from '@/store/slices/toast';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';
import { LumError } from '@/utilities/models/LumError';
import { getOrderData } from '../../utilities';

interface Props {}

const StageInfo = ({}: Props) => {
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const { order, currStageOnProduct, currProductStageId, stagesOnProduct, coordinatorsOnProduct, fieldsOnProduct } =
      useAppSelector(selectPageContext);

   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [showStageModal, setShowStageModal] = useState<boolean>(false);
   const [userAllowedToUpdateStage, setUserAllowedToUpdateStage] = useState<boolean>(false);

   useEffect(() => {
      const handleUserAllowedToUpdateStage = () => {
         // add super secret dev role to this...
         // see if the user has a role that is attached to a coordinator for the product which is the order
         const roleIdsAllowed = [
            ...coordinatorsOnProduct
               ?.map((coordOnProd: any) => coordOnProd.productCoordinator.roles)
               .flat()
               .map((role: any) => role?.id),
            'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
         ];
         const userRoleIds = user.rolesOnUser?.map((roleOnUser: any) => roleOnUser?.role.id);
         const userHasCorrectRole = roleIdsAllowed?.some((roleId: any) => userRoleIds.includes(roleId));
         if (!userHasCorrectRole) return false;

         const fieldsWithCurrStageConstraint = fieldsOnProduct?.filter(
            (fieldOnProd: any) =>
               fieldOnProd?.stageOnProductConstraintId &&
               fieldOnProd?.stageOnProductConstraintId === currStageOnProduct?.id
         );

         if (!!fieldsWithCurrStageConstraint?.length) {
            // see if these fields have been answered...
            const fieldsWithStageConstraintNotComplete = fieldsWithCurrStageConstraint?.filter((fieldOnProd: any) => {
               const foundFieldOnOrder = order?.fieldsOnOrder?.some(
                  (fieldOnOrder: any) =>
                     fieldOnOrder?.fieldOnProductId === fieldOnProd?.id &&
                     fieldOnOrder?.answer &&
                     fieldOnOrder?.answer?.length > 0
               );
               if (!foundFieldOnOrder) return fieldOnProd;
            });

            if (!!fieldsWithStageConstraintNotComplete?.length) {
               console.log('fields need to be completed:', fieldsWithStageConstraintNotComplete);
               return false;
            }
         }

         const tasksWithCurrStageConstraint = order?.tasksOnOrder?.filter(
            (taskOnOrder: any) =>
               taskOnOrder?.taskOnProduct?.stageOnProductConstraintId === currStageOnProduct?.id ||
               !taskOnOrder?.taskOnProductId
         );

         if (!!tasksWithCurrStageConstraint?.length) {
            const tasksWithCurrStageConstraintNotCompleted = tasksWithCurrStageConstraint.filter(
               (taskOnOrder: any) => !taskOnOrder?.completed
            );
            if (!!tasksWithCurrStageConstraintNotCompleted?.length) {
               console.log('tasks need to be completed:', tasksWithCurrStageConstraintNotCompleted);
               return false;
            }
         }

         // make sure the user isn't assigned a role that is suppose to be excluded (stageOnProductRoleConstraints)
         if (!!currStageOnProduct?.excludedRoles?.length) {
            // since users can have multiple roles...
            // if a user has a role that is excluded... exclude the user? or only if the user has that role and is their only role?

            // don't need to compare the excludedRole.stageOnProductConstraintId === currStageOnProduct?.id because all the excluded roles are attached to the current stage
            const userRoles = user?.rolesOnUser?.map((roleOnUser: any) => roleOnUser?.role);
            const userRolesIsExcluded = currStageOnProduct?.excludedRoles?.some((excludedRole: any) =>
               userRoles.find((role: any) => role?.id === excludedRole?.roleId)
            );
            if (userRolesIsExcluded) {
               console.log('user is role that is excluded from this stage...');
               return false;
            }
         }

         // return userHasCorrectRole && requiredFieldsOnOrderFilledOut && requiredTasksOnOrderCompleted;
         // if here, we passed! return true
         return true;
      };

      const allowUpdateStageBtnAccess = handleUserAllowedToUpdateStage();
      setUserAllowedToUpdateStage(allowUpdateStageBtnAccess);
   }, [order]);

   useEffect(() => {
      // whenever the order changes, reset the curr product stage id
      dispatch(setPageContext({ currProductStageId: order?.productStageId, validatingUserCanUpdateStage: true }));
   }, [order?.id]);

   const handleUpdateStage = (e: any) => {
      // update whole order only if the currProductStageId is not the same as the order?.productStageId
      if (currProductStageId !== order?.productStageId) {
         setIsSaving(true);

         const newStageOnProd = stagesOnProduct?.find(
            (stageOnProd: any) => stageOnProd?.productStageId === currProductStageId
         );
         const prevStageOnProd = stagesOnProduct?.find(
            (stageOnProd: any) => stageOnProd?.productStageId === order?.productStageId
         );

         const tempStagesOnOrder = [{ stageOnProductId: newStageOnProd?.id, id: null }, ...order?.stagesOnOrder].map(
            (stageOnOrder: any) => {
               if (prevStageOnProd?.id === stageOnOrder?.stageOnProductId)
                  return { ...stageOnOrder, completedAt: new Date() };
               else return stageOnOrder;
            }
         );

         const updatedOrder = { ...order, productStageId: currProductStageId, stagesOnOrder: tempStagesOnOrder };

         fetchDbApi(`/api/v2/orders/${order?.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': `application/json`, Authorization: `Bearer ${user?.token}` },
            body: JSON.stringify(updatedOrder),
         })
            .then(async (res: any) => {
               if (!res?.errors?.length) {
                  // update currStageOnProd
                  const updatedCurrStageOnProduct = stagesOnProduct?.find(
                     (stageOnProd: any) => stageOnProd?.productStageId === updatedOrder?.productStageId
                  );
                  const tempOrder = await getOrderData(user?.token || undefined, updatedOrder?.id);

                  dispatch(
                     setPageContext({
                        order: tempOrder,
                        currStageOnProduct: updatedCurrStageOnProduct,
                     })
                  );

                  setTimeout(() => {
                     setIsSaving(false);
                     setShowStageModal(false);
                     dispatch(
                        setAddToast({
                           details: [{ label: 'Success', text: 'Stage Updated Successfully!' }],
                           iconName: 'CheckMarkCircle',
                           variant: 'success',
                           autoCloseDelay: 5,
                        })
                     );
                  }, 500);

                  triggerAutomation.fire('stage_updated', {
                     leadId: order.leadId,
                     executorId: user.id,
                     newValue: updatedCurrStageOnProduct?.productStage?.id,
                     prevValue: prevStageOnProd?.productStage?.id,
                     orderId: order?.id,
                  });
               } else throw new LumError(400, res?.errors[0] || res?.message);
            })
            .catch((err: any) => {
               console.log('err saving product', err);
               setIsSaving(false);
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
      }
   };

   // const progressBarData = [
   //    { tooltipContent: <div>Site Survey #1</div> },
   //    { tooltipContent: <div>Site Survey #2</div> },
   //    { tooltipContent: <div>Site Survey #3</div> },
   // ];

   // this will update whenever the order updates and gets saved... not when the currStageOnProductId updates
   const savedStageOnProduct = stagesOnProduct?.find(
      (stageOnProd: any) => stageOnProd?.productStageId === order?.productStageId
   );

   return (
      <>
         <Grid>
            <div>Stage</div>
            <Grid columnCount={4}>
               <Grid rowGap={0}>
                  <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Current Stage</div>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'>
                     {/* {console.log('updated order:', order)} */}
                     {savedStageOnProduct && savedStageOnProduct?.productStage?.name}
                  </div>
               </Grid>
               <div className='col-start-4'>
                  <Button
                     disabled={!userAllowedToUpdateStage}
                     iconName='PaperEdit'
                     color='blue'
                     onClick={(e: any) => {
                        console.log('update the staage...');
                        setShowStageModal(true);
                     }}>
                     Update Stage
                  </Button>
               </div>
            </Grid>
         </Grid>

         {/* <Hr className='-ml-[20px] w-[calc(100%+40px)]' />
         <Grid>
            <div>Stage Progess</div>
            <Grid>
               <div>PROGRESS BAR HERE</div>
               <ProgressBar strokeColor='green' progressPercentage={34} showIndicators data={progressBarData} />
            </Grid>
         </Grid> */}

         <Modal
            isOpen={showStageModal}
            onClose={(e: any) => {
               // warning close modal here...
               setShowStageModal(false);
               dispatch(setPageContext({ currProductStageId: order?.productStageId }));
            }}
            size={'default'}
            zIndex={100}
            title={`Update Stage`}
            primaryButtonText={'Update Stage'}
            primaryButtonCallback={handleUpdateStage}>
            <>
               <Grid columnCount={3}>
                  {stagesOnProduct?.length &&
                     stagesOnProduct?.map((stageOnProd: any, i: number) => {
                        return (
                           <React.Fragment key={i}>
                              <Radio
                                 key={i}
                                 checked={currProductStageId === stageOnProd.productStageId}
                                 name={'name'}
                                 label={stageOnProd?.productStage?.name}
                                 onChange={(e) => {
                                    dispatch(setPageContext({ currProductStageId: stageOnProd?.productStageId }));
                                 }}
                              />
                           </React.Fragment>
                        );
                     })}
               </Grid>
            </>
         </Modal>
         <LoadingBackdrop isOpen={isSaving} zIndex={201} />
      </>
   );
};

export default StageInfo;
