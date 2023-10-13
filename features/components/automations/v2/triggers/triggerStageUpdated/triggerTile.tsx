'use client'
import { TriggerProps } from "./triggerData"

const TriggerTile = ({ options }: TriggerProps) => {
   const { selectedProduct, selectedStage } = options
   return (
      <div className=''>Run automation when prduct <span className='text-lum-green-500'>{selectedProduct?.name}</span> stage changes
         {selectedStage && <span> to <span className='text-lum-green-500'>{selectedStage?.name}</span></span>}.</div>
   )
}

export default TriggerTile
