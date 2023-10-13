'use client';
import Button from '@/common/components/button/Button';
import Grid from '@/common/components/grid/Grid';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';
import Modal from '@/common/components/modal/Modal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import React, { useEffect, useState } from 'react';

interface Props {}

const InstallDetails = ({}: Props) => {
   const dispatch = useAppDispatch();
   const { order } = useAppSelector(selectPageContext);
   const [currStageOnOrder, setCurrStageOnOrder] = useState<any>();
   const [showInstallDetailsModal, setShowInstallDetailsModal] = useState<boolean>(false);
   const [isSaving, setIsSaving] = useState<boolean>(false);

   useEffect(() => {
      if (order?.productStageId) {
         setCurrStageOnOrder(
            order?.stagesOnOrder?.find(
               (stageOnOrder: any) => stageOnOrder?.stageOnProduct?.productStageId === order?.productStageId
            )
         );
      }
   }, [order?.productStageId]);

   const handleUpdateInstallDetails = () => {};

   const btnEnabled = currStageOnOrder?.stageOnProduct?.scheduled;
   return (
      <>
         <Grid>
            <div>Install Details</div>
            <Grid columnCount={4}>
               <Grid rowGap={0}>
                  <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Date</div>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'></div>
               </Grid>
               <Grid rowGap={0}>
                  <div className='text-[10px] uppercase text-lum-gray-450 dark:text-lum-gray-300'>Team</div>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-white'></div>
               </Grid>
               <div className='col-start-4'>
                  <Button
                     disabled={!btnEnabled}
                     iconName='PaperEdit'
                     color='blue'
                     onClick={(e: any) => {
                        console.log('update the install inforamtion...');
                        setShowInstallDetailsModal(true);
                     }}>
                     Update Install Info
                  </Button>
               </div>
            </Grid>
         </Grid>
         <Modal
            isOpen={showInstallDetailsModal}
            onClose={(e: any) => {
               // warning close modal here...
               setShowInstallDetailsModal(false);
            }}
            size={'default'}
            zIndex={100}
            title={`Update Install Information`}
            primaryButtonText={'Update'}
            primaryButtonCallback={handleUpdateInstallDetails}>
            <>
               <Grid columnCount={3}>
                  <>INSTALL STUFF GOES HERE!</>
               </Grid>
            </>
         </Modal>
         <LoadingBackdrop isOpen={isSaving} zIndex={201} />
      </>
   );
};

export default InstallDetails;
