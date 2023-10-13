import React, { useEffect, useState } from 'react';
import Button from '@/common/components/button/Button';
import Modal from '@/common/components/modal/Modal';
import DropDown from '@/common/components/drop-down/DropDown';
import { fetchDbApi } from '@/serverActions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ModalsType = {
   segmentAdd: boolean
   segmentConfig: any
}

const AutomationSegment = ({
   segmentId,
   updateSegmentId,
}: {
   segmentId: string;
   updateSegmentId(data: any): void
}) => {
   const router = useRouter();
   const [modals, setModals] = useState<ModalsType>({
      segmentAdd: false,
      segmentConfig: null,
   });
   const [listOfSegments, setListOfSegments] = useState<any[]>([]);
   const [selectedSegment, setSelectedSegment] = useState<any>([]);

   useEffect(() => {
      // Fetch segment data from API
      fetchDbApi(`/api/v2/segments/`, {
         method: 'GET',
      }).then((res) => {
         setListOfSegments(res);
         if (segmentId) {
            setSelectedSegment([res.filter((segment: any) => segment.id === segmentId)]);
         }
      });
   }, []);

   useEffect(() => {
      if (segmentId && listOfSegments.length > 0) {
         setSelectedSegment(listOfSegments.filter((segment: any) => segment.id === segmentId));
      }
   }, [segmentId, listOfSegments]);


   const handleSegmentClick = () => {
      setModals(prev => ({ ...prev, segmentAdd: true }))
   };

   const handleSegmentSave = () => {
      setSelectedSegment(modals.segmentConfig?.segment || []);
      updateSegmentId(modals.segmentConfig?.segment[0].id);
      setModals(prev => ({ ...prev, segmentAdd: false }))
   }

   return (
      <>
         <Button color='blue' iconName='Users' iconColor='blue:200' onClick={handleSegmentClick}>
            <p className='text-white text-sm font-normal leading-[14px] select-none'>
               Segment:{' '}
               <span className='text-white text-sm font-bold leading-[14px]'>
                  {selectedSegment[0]?.leadCount?.toLocaleString() || 0}
               </span>
            </p>
         </Button>

         {/* Segment Modal */}
         <Modal
            zIndex={90}
            isOpen={modals.segmentAdd}
            onClose={() => {
               setModals(prev => ({ ...prev, segmentAdd: false, segmentConfig: { segment: selectedSegment } }))
            }}
            primaryButtonText="Save"
            primaryButtonCallback={handleSegmentSave}
            disablePrimaryButton={false}
            customHeader='Select Segment'>
            <div className='mb-1'>Select the segment that you would like to use for this automation.</div>
            <DropDown
               searchable={true}
               selectedValues={modals.segmentConfig?.segment || []}
               placeholder={'Select Segment'}
               keyPath={['name']}
               options={listOfSegments}
               onOptionSelect={function (e: any, arg: any): void {
                  setModals(prev => ({ ...prev, segmentConfig: { segment: [arg] } }))
               }}
            />
            {modals.segmentConfig && modals.segmentConfig?.segment?.length > 0
               ? <div className='my-3 flex justify-between items-center'>
                  <div className=''>This segment currently has <span className='text-lum-blue-500'>{modals.segmentConfig.segment[0].leadCount.toLocaleString()}</span> leads in it.</div>
                  <Button color='gray' iconColor='blue:200' onClick={() => setModals(prev => ({ ...prev, segmentConfig: { segment: [] } }))}>
                     <p className='text-white text-sm font-normal leading-[14px] select-none'>
                        Clear Selection
                     </p>
                  </Button>
               </div>
               : <div className='my-3'>Leave blank if you want automation to trigger on any lead/order.</div>
            }

            <div className='mt-16 flex justify-between items-center'>
               Or create a new segment.
               <Button color='blue' iconName='Plus' iconColor='blue:200' onClick={() => router.push(`/marketing/segments`)}>
                  <p className='text-white text-sm font-normal leading-[14px] select-none'>
                     New Segment
                  </p>
               </Button>
            </div>
         </Modal>
      </>
   );
};

export default AutomationSegment;

