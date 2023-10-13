'use client'
import { TriggerProps } from "./triggerData"

const TriggerTile = ({ options }: TriggerProps) => {
   return (
      <>
      {options?.selectedStatus?.name
            ? <div>Run automation whenever lead status is updated to: <span className='text-lum-green-500'>{options.selectedStatus.name}</span></div>
            : <div>Run automation whenever lead status type is updated.</div>
         }
         
      </>
   )
}

export default TriggerTile
