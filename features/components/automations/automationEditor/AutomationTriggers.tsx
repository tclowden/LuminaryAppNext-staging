import React, { useEffect, useState } from 'react'
import Button from '@/common/components/button/Button'
import Modal from '@/common/components/modal/Modal'

import automationTriggers from '../v2/triggers/triggersClient';
import { AutomationTriggerType } from '../v2/triggers/triggers';
import Icon from '@/common/components/Icon';
import Tooltip from '@/common/components/tooltip/Tooltip';

type ModalsType = {
   triggerList: boolean
   triggerAdd: boolean
   triggerConfig: null | {
      data: AutomationTriggerType;
      options?: {}
      index?: number
   };
   triggerIndex: number
   isEditMode?: boolean
}

const AutomationTriggers = ({ triggerData, updateTriggerData, automationType }: {
   triggerData: []
   updateTriggerData(data: any): void
   automationType: 'operations' | 'marketing'
}) => {
   const [modals, setModals] = useState<ModalsType>({
      triggerList: false,
      triggerAdd: false,
      triggerConfig: null,
      triggerIndex: 0,
      isEditMode: false
   });

   const handleConfigUpdate = (data: any) => {
      setModals(prev => prev.triggerConfig ?
         {
            ...prev,
            triggerConfig: {
               ...prev.triggerConfig,
               options: data
            }
         } : prev
      );
   };

   const handleTriggerDelete = (index: number) => {
      const triggers = [...triggerData];
      triggers.splice(index, 1);
      updateTriggerData(triggers)
   };

   const handleTriggerConfigSave = (e: any) => {

      if (modals.triggerConfig && modals.triggerConfig?.data) {
         const newTriggerData: any = [...triggerData]
         newTriggerData.splice(modals.triggerIndex ?? triggerData.length,
            modals.isEditMode ? 1 : 0,
            {
               name: modals.triggerConfig.data.name,
               options: modals.triggerConfig?.options
            }
         );
         updateTriggerData(newTriggerData)
      }

      setModals(prev => ({ ...prev, triggerList: true, triggerConfig: null, triggerIndex: 0 }))
   };


   const handleEditTrigger = (trigger: any, index: number) => {
      const foundTrigger = Object.values(automationTriggers).reduce((acc, val) => acc.concat(val), []).find((a: any) => a.name === trigger.name)
      foundTrigger && setModals(prev => ({ ...prev, triggerList: false, triggerConfig: { data: foundTrigger, options: trigger.options }, isEditMode: true, triggerIndex: index }))
   };


   // UI function to find and display action tiles
   const triggerTile = ({ trigger }: { trigger: any }) => {
      const foundAction = Object.values(automationTriggers).reduce((acc, val) => acc.concat(val), []).find((a: any) => a.name === trigger.name)

      return foundAction ? (
         <div className='w-full px-5 py-2 rounded-xl bg-lum-gray-600 grid grid-cols-[auto_1fr] gap-4 hover:brightness-110 active:brightness-90'>
            <Icon name={foundAction.iconName} className='w-7 fill-lum-gray-200' />
            <div className='text-left'>
               <div className='font-medium'>{foundAction.prettyName}</div>
               <div className='text-sm font-normal'>
                  {foundAction?.TileDescription ? (
                     // @ts-ignore
                     <foundAction.TileDescription options={trigger.options} />
                  ) : (
                     <>Dev error: No tile description defined</>
                  )}
               </div>
            </div>
         </div>
      ) : (
         <div className="p-3 py-1 bg-lum-red-800 rounded-xl shadow cursor-pointer grid place-items-center">
            <div>{trigger.name}</div>
            <div>Dev Error: trigger not found</div>
         </div>
      );
   };

   return (<>
      <Button color="green" iconName="Play" iconColor="green:200" onClick={() => {
         setModals(prev => ({ ...prev, triggerList: triggerData.length > 0 && true, triggerAdd: triggerData.length === 0 && true }))
      }}>
         <p className="text-white text-sm font-normal leading-[14px] select-none">
            Triggers: <span className="text-white text-sm font-bold leading-[14px]"> {triggerData.length}</span>
         </p>
      </Button>

      {/* Trigger List Modal */}
      <Modal
         isOpen={modals.triggerList}
         onClose={() => setModals(prev => ({ ...prev, triggerList: false }))}
         primaryButtonText="Add a trigger"
         primaryButtonCallback={() => setModals(prev => ({ ...prev, triggerList: false, triggerAdd: true }))}
         disablePrimaryButton={false}
         customHeader="Active Triggers"
      >
         {/* Display all added triggers */}
         <div className='flex flex-wrap gap-2'>
            {triggerData.length > 0
               ? triggerData
                  .sort((a: any, b: any) => a.name.localeCompare(b.name))
                  .map((trigger, i) => (
                     <div key={i} className='w-full flex'>
                        <div className="w-full rounded shadow cursor-pointer overflow-clip" onClick={() => handleEditTrigger(trigger, i)}>
                           {triggerTile({ trigger })}
                        </div>
                        <Tooltip content="Delete trigger">
                           <div className="p-1 m-3 bg-lum-gray-700 hover:brightness-[1.35] rounded cursor-pointer" onClick={() => handleTriggerDelete(i)}>
                              <Icon name="TrashCan" className="w-5 fill-lum-gray-200" />
                           </div>
                        </Tooltip>
                     </div>
                  ))
               : <div className='block'>
                  <div>There are no active triggers. </div>
                  <div>Please add a trigger</div>
               </div>
            }
         </div>
      </Modal>

      {/* Add Trigger Modal */}
      <Modal
         secondaryButtonText="Back"
         secondaryButtonCallback={() => setModals(prev => ({ ...prev, triggerList: true }))}
         disableSecondaryButton={false}
         zIndex={90}
         isOpen={modals.triggerAdd}
         onClose={() => setModals(prev => ({ ...prev, triggerAdd: false }))}
         customHeader="Select Trigger"
      >
         <div className='flex flex-wrap gap-2'>
            {/* Make both marketing and operation triggers available */}
            {Object.keys(automationTriggers)?.map((automationType, i) => (
               <div key={i} className='w-full grid gap-2'>

                  {automationTriggers[automationType].length > 0 &&
                     <div className='capitalize'>{automationType} Triggers</div>
                  }

                  {automationTriggers[automationType].map((trigger: any, i: any) => (
                     <button
                        key={i}
                        className='w-full px-5 py-2 rounded-xl bg-lum-gray-600 grid grid-cols-[auto_1fr] gap-4 hover:brightness-110 active:brightness-90'
                        onClick={() => setModals(prev => ({ ...prev, triggerAdd: false, triggerConfig: { data: trigger } }))}
                     >
                        <Icon name={trigger.iconName} className='w-7 fill-lum-gray-200' />
                        <div className='text-left'>
                           <div className='font-medium'>{trigger.prettyName}</div>
                           <div className='text-sm font-normal'>{trigger.description}</div>
                        </div>
                     </button>
                  ))}

               </div>
            ))}

            {/* {automationTriggers[automationType].map((trigger, i) => (
               <button
                  key={i}
                  className='w-full px-5 py-2 rounded-xl bg-lum-gray-600 grid grid-cols-[auto_1fr] gap-4 hover:brightness-110 active:brightness-90'
                  onClick={() => setModals(prev => ({ ...prev, triggerAdd: false, triggerConfig: { data: trigger } }))}
               >
                  <Icon name={trigger.iconName} className='w-7 fill-lum-gray-200' />
                  <div className='text-left'>
                     <div className='font-medium'>{trigger.prettyName}</div>
                     <div className='text-sm font-normal'>{trigger.description}</div>
                  </div>
               </button>
            ))} */}
         </div>
      </Modal>

      {/* Trigger Config Modal */}
      <Modal
         primaryButtonText="Save"
         primaryButtonCallback={handleTriggerConfigSave}
         disablePrimaryButton={false}
         secondaryButtonText="Back"
         secondaryButtonCallback={() => setModals(prev => ({ ...prev, triggerAdd: true }))}
         disableSecondaryButton={false}
         zIndex={90}
         isOpen={modals.triggerConfig ? true : false}
         onClose={() => setModals(prev => ({ ...prev, triggerConfig: null }))}
         customHeader={`${modals.isEditMode ? 'Edit' : 'Setup'} Action: ${modals.triggerConfig?.data.prettyName}`}
      >
         {modals.triggerConfig?.data?.Modal && (
            <modals.triggerConfig.data.Modal options={modals.triggerConfig?.options} onData={handleConfigUpdate} />
         )}
      </Modal>
   </>)
}

export default AutomationTriggers
