'use client'
import { TriggerProps } from "./triggerData"

const TriggerTile = ({ options }: TriggerProps) => {
   return (
      <>
         {options?.selectedStatusType?.name
            ? <div>Run automation whenever lead status type is updated to: <span className='text-lum-green-500'>{options.selectedStatusType.name}</span></div>
            : <div>Run automation whenever lead status type is updated.</div>
         }
      </>
   )
}

export default TriggerTile
