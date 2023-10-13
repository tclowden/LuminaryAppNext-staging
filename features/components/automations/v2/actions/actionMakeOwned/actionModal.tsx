import React, { useState, useEffect } from 'react'
import { ActionProps } from './actionData'
import DropDown from '@/common/components/drop-down/DropDown'
import { fetchDbApi } from '@/serverActions'

const ActionModal = ({ options, onData }: ActionProps) => {
   const [selectedValue, setSelectedValue] = useState<any>(options?.selectedValue)
   const [userList, setUserList] = useState<any[]>([])
   const [selectedUser, setSelectedUser] = useState<any>(options?.selectedUser)

   useEffect(() => {
      onData({ selectedUser, selectedValue })
   }, [selectedUser])

   useEffect(() => {
      fetchDbApi('/api/v2/users/')
         .then((res) => {
            console.log('res', res)
            setUserList(res)
         })
   }, [])

   const handleTypeDropdown = (index: number, key: string, value: any) => {
      setSelectedValue((prev: any) => (value))
   }

   const handleUserSelectDropdown = (index: number, key: string, value: any) => {
      setSelectedUser((prev: any) => (value))
   }

   return (
      <>
         <DropDown
            label='Automatic or Maual'
            keyPath={['text']}
            className='bg-color-white min-w-[160px]'
            placeholder='Select an option'
            selectedValues={selectedValue ? [selectedValue] : []}
            options={[
               { id: '1', text: 'User who initiated this action (Automatic)' },
               { id: '2', text: 'Specified user (Manual)' }
            ]}
            onOptionSelect={(e, arg) => handleTypeDropdown(0, 'newRow', arg)}
         />
         <div className='my-3'></div>

         {selectedValue?.id === '2' &&
            <DropDown
               searchable={true}
               label='Select the user'
               keyPath={['fullName']}
               className='bg-color-white min-w-[160px]'
               placeholder='Select an option'
               selectedValues={selectedUser ? [selectedUser] : []}
               options={userList}
               onOptionSelect={(e, arg) => handleUserSelectDropdown(0, 'newRow', arg)}
            />
         }
      </>
   )
}

export default ActionModal
