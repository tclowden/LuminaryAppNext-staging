'use client'
import React, { useState, useEffect } from 'react'
import { TriggerProps } from './triggerData'
import DropDown from '@/common/components/drop-down/DropDown'
import { fetchDbApi } from '@/serverActions'
import Button from '@/common/components/button/Button'

export const TriggerModal = ({ options, onData }: TriggerProps) => {
   const [statusList, setStatusList] = useState<any[]>([])
   const [selectedStatus, setSelectedStatus] = useState<any>(options?.selectedStatus)

   useEffect(() => {
      onData({ selectedStatus })
   }, [selectedStatus])

   useEffect(() => {
      // get all the lead statuses
      fetchDbApi('/api/v2/statuses')
         .then((res) => {
            console.log('res', res)
            setStatusList(res)
         })

      return () => {
      }
   }, [])


   return (
      <>
         <DropDown
            searchable={true}
            label='Statuses'
            keyPath={['name']}
            className='bg-color-white min-w-[160px]'
            placeholder='Select the lead status'
            selectedValues={selectedStatus ? [selectedStatus] : []}
            options={statusList.sort((a, b) => a.name.localeCompare(b.name))}
            onOptionSelect={(e, arg) => setSelectedStatus((prev: any) => (arg))}
         />

         {selectedStatus
            ? <div className='my-3 flex justify-between items-center'>
               <div className=''>This automation will run when lead status changes to <span className='text-lum-green-500'>{selectedStatus.name}</span>.</div>
               <Button color='gray' iconColor='blue:200' onClick={() => setSelectedStatus((prev: any) => null)}>
                  <p className='text-white text-sm font-normal leading-[14px] select-none'>
                     Clear Selection
                  </p>
               </Button>
            </div>
            : <div className='my-3'>Leave blank if you want automation to trigger on any lead status change.</div>
         }
      </>
   )
}

export default TriggerModal