'use client';
import React, { useEffect, useState } from 'react';
import AutomationLine from './AutomationLine';
import AutomationSegment from './AutomationSegment';
import AutomationTriggers from './AutomationTriggers';
import AutomationActions from './AutomationActions';
import Input from '@/common/components/input/Input';

type AutomationDataType = {
   id: string
   name: string
   type: 'operations' | 'marketing'
   segmentId: string
   triggers: []
   actions: []
}

const AutomationEditor = ({ automationInit, automationForm }: { automationInit: AutomationDataType, automationForm: any }) => {

   useEffect(() => {
      // console.log('automationInit: ', automationInit);
      automationForm.setMultiValues({
         name: automationInit.name,
         type: automationInit.type,
         segmentId: automationInit.segmentId,
         triggers: automationInit.triggers,
         actions: automationInit.actions,
      })

   }, [])

   // const handleNameChange = (name: string) => {
   //    // automationForm.setValue('name', name)
   //    automationForm.handleChange({ target: { name: 'name', value: name, type: 'text' } })
   // }

   return (
      <div className="relative w-full grid place-items-center select-none">

         <div className='absolute top-0 left-0'>
            <Input
               name={'name'}
               value={automationForm?.values.name || ''}
               onChange={automationForm.handleChange}
               errorMessage={automationForm.errors?.name}
            />
         </div>

         {automationInit && automationForm && <>

            <AutomationSegment
               segmentId={automationForm.values?.segmentId || ''}
               updateSegmentId={(segmentId) => automationForm.setValue('segmentId', segmentId)}
            />

            <AutomationLine />

            <AutomationTriggers
               // triggerData={automationData.triggers}
               // updateTriggerData={(triggerData) => setAutomationData((prev) => ({ ...prev, triggers: triggerData }))}
               triggerData={automationForm.values?.triggers || []}
               updateTriggerData={(triggerData) => automationForm.setValue('triggers', triggerData)}
               automationType={automationInit.type}
            />

            <AutomationActions
               // actionData={automationData.actions}
               // updateActionData={(actionData) => setAutomationData((prev) => ({ ...prev, actions: actionData }))}
               actionData={automationForm.values?.actions || []}
               updateActionData={(actionData) => automationForm.setValue('actions', actionData)}
               automationType={automationInit.type}
            />
         </>}


         {/* End Flow */}
         <div className="w-[108px] h-10 bg-lum-white rounded shadow grid place-items-center">
            <div className="text-center text-lum-gray-700 text-sm font-normal leading-[14px] select-none">End Flow</div>
         </div>
      </div>
   );
};

export default AutomationEditor;
