'use client'
import React, { useState, useEffect } from 'react'
import { TriggerProps } from './triggerData'
import { fetchDbApi } from '@/serverActions'
import DropDown from '@/common/components/drop-down/DropDown'
import Button from '@/common/components/button/Button'

export const TriggerModal = ({ options, onData }: TriggerProps) => {
   const [statusTypeList, setStatusTypeList] = useState<any[]>([])
   const [selectedStatusType, setSelectedStatusType] = useState<any>(options?.selectedStatusType)

   useEffect(() => {
      onData({ selectedStatusType })
   }, [selectedStatusType])

   useEffect(() => {
      // get all the lead statuses
      fetchDbApi('/api/v2/statuses/types')
         .then((res) => {
            console.log('res', res)
            setStatusTypeList(res)
         })

      return () => {
      }
   }, [])

   return (
      <>
         <DropDown
            searchable={true}
            label='Status Types'
            keyPath={['name']}
            className='bg-color-white min-w-[160px]'
            placeholder='Select a statyus type'
            selectedValues={selectedStatusType ? [selectedStatusType] : []}
            options={statusTypeList.sort((a, b) => a.name.localeCompare(b.name))}
            onOptionSelect={(e, arg) => setSelectedStatusType((prev: any) => (arg))}
         />

         {selectedStatusType
            ? <div className='my-3 flex justify-between items-center'>
               <div className=''>This automation will run when lead status changes to <span className='text-lum-green-500'>{selectedStatusType.name}</span>.</div>
               <Button color='gray' iconColor='blue:200' onClick={() => setSelectedStatusType((prev: any) => null)}>
                  <p className='text-white text-sm font-normal leading-[14px] select-none'>
                     Clear Selection
                  </p>
               </Button>
            </div>
            : <div className='my-3'>Leave blank if you want automation to trigger on any lead status type change.</div>
         }
      </>
   )
}

export default TriggerModal