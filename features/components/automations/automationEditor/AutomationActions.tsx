import React, { useEffect, useState } from 'react';
import Icon from '@/common/components/Icon';
import Modal from '@/common/components/modal/Modal';
import Tooltip from '@/common/components/tooltip/Tooltip';
import AutomationLine from './AutomationLine';
import automationActions from '../v2/actions/actionsClient';
import { AutomationActionType } from '../v2/actions/actions';

type ModalsType = {
   actionAdd: boolean
   actionConfig: null | {
      data: AutomationActionType;
      options?: {}
   };
   actionIndex: number
   isEditMode?: boolean
}

const AutomationActions = ({ actionData, updateActionData, automationType }: {
   actionData: []
   updateActionData(data: any): void
   automationType: 'operations' | 'marketing'
}) => {
   const [modals, setModals] = useState<ModalsType>({
      actionAdd: false,
      actionConfig: null,
      actionIndex: 0,
      isEditMode: false
   });

   const handleAddActionClick = (index: number) => {
      setModals(prev => ({ ...prev, actionAdd: true, actionIndex: index }))
   };

   const handleConfigUpdate = (data: any) => {
      setModals(prev => prev.actionConfig ?
         {
            ...prev,
            actionConfig: {
               ...prev.actionConfig,
               options: data
            }
         } : prev
      );
   };

   const handleActionDelete = (index: number) => {
      const actions = [...actionData];
      actions.splice(index, 1);
      updateActionData(actions)
   };

   const handleActionConfigSave = (e: any) => {
      // console.log('config', modals.actionConfig)

      if (modals.actionConfig && modals.actionConfig?.data) {
         const newActionData: any = [...actionData]
         newActionData.splice(modals.actionIndex ?? actionData.length,
            modals.isEditMode ? 1 : 0,
            {
               name: modals.actionConfig.data.name,
               options: modals.actionConfig?.options,
            }
         );
         updateActionData(newActionData)
      }

      setModals(prev => ({ ...prev, actionConfig: null, actionIndex: 0 }))
   };

   const handleEditAction = (action: any, index: number) => {
      const foundAction = Object.values(automationActions).reduce((acc, val) => acc.concat(val), []).find((a: any) => a.name === action.name)
      foundAction && setModals(prev => ({ ...prev, actionConfig: { data: foundAction, options: action.options }, actionIndex: index, isEditMode: true }))
   };

   // UI function to find and display action tiles
   const actionTile = ({ action }: { action: any }) => {
      if (automationActions) {
         const foundAction: any = Object.values(automationActions).reduce((acc, val) => acc.concat(val), []).find((a: any) => a.name === action.name)

         return foundAction && foundAction?.Tile ? (
            <foundAction.Tile options={action.options} />
         ) : (
            <div className="p-3 py-1 bg-lum-red-800 rounded shadow cursor-pointer grid place-items-center">
               <div>{action.name}</div>
               <div>Dev Error: No tile specified</div>
            </div>
         );
      }

   };

   return (
      <>
         <AutomationLine addAction={handleAddActionClick} />

         {automationActions &&
            actionData.map((action: any, i: any) => (
               <div key={i} className='w-full grid place-items-center select-none'>
                  <div className='relative p-3 -m-3 group'>
                     <div
                        className='rounded shadow cursor-pointer overflow-clip'
                        onClick={() => handleEditAction(action, i)}>
                        {actionTile({ action })}
                     </div>
                     <div className='absolute -ml-3 pr-3 inset-y-0 left-full flex place-items-center place-content-center group-hover:translate-x-0 group-hover:visible translate-x-1/3 group-hover:opacity-100 opacity-0 ease-out duration-150 pointer-events-none group-hover:pointer-events-auto'>
                        <div className='w-0 h-0 border-t-[6px] border-t-transparent border-r-[9px] border-r-lum-gray-700 border-b-[6px] border-b-transparent'></div>
                        <div className='p-1 bg-lum-gray-700 flex gap-1 rounded cursor-pointer'>
                           <Tooltip content='Edit action'>
                              <div
                                 className='p-1 bg-lum-gray-700 hover:brightness-[1.35] rounded'
                                 onClick={() => handleEditAction(action, i)}>
                                 <Icon name='Edit' className='w-5 fill-lum-gray-200' />
                              </div>
                           </Tooltip>
                           <Tooltip content='Delete action'>
                              <div
                                 className='p-1 bg-lum-gray-700 hover:brightness-[1.35] rounded'
                                 onClick={() => handleActionDelete(i)}>
                                 <Icon name='TrashCan' className='w-5 fill-lum-gray-200' />
                              </div>
                           </Tooltip>
                        </div>
                     </div>
                  </div>
                  <AutomationLine addAction={handleAddActionClick} index={i + 1} />
               </div>
            ))}

         {/* Add Action Modal */}
         <Modal
            zIndex={90}
            isOpen={modals.actionAdd}
            onClose={() => setModals(prev => ({ ...prev, actionAdd: false }))}
            customHeader="Select Action"
         >
            <div className="grid gap-2">
               {Object.keys(automationActions)?.map((action, i) => (
                  <div key={i} className='grid gap-2'>
                     <div className='capitalize'>{action} Actions</div>
                     {automationActions[action].map((action: any, i: any) => (
                        <button
                           key={i}
                           className='w-full px-5 py-2 rounded-xl bg-lum-gray-600 grid grid-cols-[auto_1fr] gap-4 hover:brightness-110 active:brightness-90'
                           onClick={() =>
                              setModals((prev) => ({ ...prev, actionAdd: false, actionConfig: { data: action } }))
                           }>
                           <Icon name={action.iconName} className='w-7 fill-lum-gray-200' />
                           <div className='text-left'>
                              <div className='font-medium'>{action.prettyName}</div>
                              <div className='text-sm font-normal'>{action.description}</div>
                           </div>
                        </button>
                     ))}
                  </div>
               ))}
            </div>
         </Modal>

         {/* Add/Edit Action Modal */}
         <Modal
            primaryButtonText="Save"
            primaryButtonCallback={handleActionConfigSave}
            disablePrimaryButton={false}
            secondaryButtonText="Back"
            secondaryButtonCallback={() => {
               setModals((prev) => ({ ...prev, actionAdd: true }));
            }}
            disableSecondaryButton={false}
            zIndex={90}
            isOpen={modals.actionConfig ? true : false}
            onClose={() => {
               setModals((prev) => ({...prev, actionConfig: null }));
            }}
         customHeader={`${modals.isEditMode ? 'Edit' : 'Setup'} Action: ${modals.actionConfig?.data.prettyName}`}>
         {modals.actionConfig?.data?.Modal && (
            <modals.actionConfig.data.Modal options={modals.actionConfig.options} onData={handleConfigUpdate} />
         )}
      </Modal >
      </>
   )
}

export default AutomationActions
